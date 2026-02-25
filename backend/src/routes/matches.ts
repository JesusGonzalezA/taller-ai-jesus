import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { generateLineup, parseWhatsAppList, resolveAttendance } from '../lineup';
import { loadPena, savePena } from '../store';
import type { Match, MatchResult, Player } from '../types';

type PenaParams = { id: string };
type MatchParams = { id: string; matchId: string };

export const matchesRouter = Router({ mergeParams: true });

// List matches (optionally filter by seasonId)
matchesRouter.get<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const { seasonId } = req.query;
  const seasons = seasonId ? pena.seasons.filter((s) => s.id === seasonId) : pena.seasons;

  const matches = seasons.flatMap((s) => s.matches.map((m) => ({ ...m, seasonName: s.name })));
  // Sort by date desc
  matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(matches);
});

// Create a match — requires whatsapp list, generates lineup
matchesRouter.post<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const activeSeason = pena.seasons.find((s) => !s.closed);
  if (!activeSeason) {
    res.status(400).json({ error: 'No active season. Create a season first.' });
    return;
  }

  const { whatsappList, playerIds } = req.body as {
    whatsappList?: string;
    playerIds?: string[];
  };

  let attendingPlayers: Player[] = [];
  let attendance: string[] = [];
  let newPlayers: Player[] = [];

  if (whatsappList) {
    const names = parseWhatsAppList(whatsappList);
    attendance = names;
    const { matched, unmatched } = resolveAttendance(names, pena.players);
    attendingPlayers = [...matched];

    // Auto-create profiles for unmatched names
    newPlayers = unmatched.map((name) => ({
      id: uuidv4(),
      name,
      position: 'forward' as const, // default position
    }));
    pena.players.push(...newPlayers);
    attendingPlayers.push(...newPlayers);
  } else if (playerIds) {
    attendingPlayers = pena.players.filter((p) => playerIds.includes(p.id));
    attendance = attendingPlayers.map((p) => p.name);
  } else {
    res.status(400).json({ error: 'whatsappList or playerIds required' });
    return;
  }

  const seasonMatches = activeSeason.matches;
  const { teamA, teamB, subs } = generateLineup(attendingPlayers, seasonMatches);

  const match: Match = {
    id: uuidv4(),
    seasonId: activeSeason.id,
    date: new Date().toISOString(),
    attendance,
    teamA,
    teamB,
    subs,
  };

  activeSeason.matches.push(match);
  savePena(pena);

  res.status(201).json({
    match,
    newPlayers,
    pena: { id: pena.id, players: pena.players },
  });
});

// Get match detail
matchesRouter.get<MatchParams>('/:matchId', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  for (const season of pena.seasons) {
    const match = season.matches.find((m) => m.id === req.params.matchId);
    if (match) {
      res.json({ ...match, seasonName: season.name });
      return;
    }
  }
  res.status(404).json({ error: 'Match not found' });
});

// Submit match result
matchesRouter.put<MatchParams>('/:matchId/result', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const result = req.body as MatchResult;
  if (result.teamAGoals == null || result.teamBGoals == null) {
    res.status(400).json({ error: 'teamAGoals and teamBGoals are required' });
    return;
  }

  for (const season of pena.seasons) {
    const match = season.matches.find((m) => m.id === req.params.matchId);
    if (match) {
      match.result = {
        teamAGoals: result.teamAGoals,
        teamBGoals: result.teamBGoals,
        scorers: result.scorers ?? [],
      };
      savePena(pena);
      res.json(match);
      return;
    }
  }
  res.status(404).json({ error: 'Match not found' });
});
