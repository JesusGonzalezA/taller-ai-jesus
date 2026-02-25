import { Router } from 'express';
import { computeSeasonStats } from '../lineup';
import { loadPena } from '../store';

type PenaParams = { id: string };
type PlayerParams = { id: string; playerId: string };

export const statsRouter = Router({ mergeParams: true });

// Global stats for a season (defaults to active season)
statsRouter.get<PenaParams>('/', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const { seasonId } = req.query as { seasonId?: string };
  const season = seasonId
    ? pena.seasons.find((s) => s.id === seasonId)
    : (pena.seasons.find((s) => !s.closed) ?? pena.seasons.at(-1));

  if (!season) {
    res.status(404).json({ error: 'No season found' });
    return;
  }

  const stats = computeSeasonStats(pena, season);
  res.json({ season: { id: season.id, name: season.name, closed: season.closed }, stats });
});

// Individual player stats (all seasons)
statsRouter.get<PlayerParams>('/:playerId', (req, res) => {
  const pena = loadPena(req.params.id);
  if (!pena) {
    res.status(404).json({ error: 'Peña not found' });
    return;
  }
  const player = pena.players.find((p) => p.id === req.params.playerId);
  if (!player) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }

  const bySeasonArr = pena.seasons.map((season) => {
    const stats = computeSeasonStats(pena, season);
    const playerStat = stats.find((s) => s.playerId === player.id);
    return {
      seasonId: season.id,
      seasonName: season.name,
      closed: season.closed,
      stats: playerStat ?? {
        playerId: player.id,
        playerName: player.name,
        position: player.position,
        matchesPlayed: 0,
        matchesWon: 0,
        goals: 0,
        assists: 0,
      },
    };
  });

  const total = bySeasonArr.reduce(
    (acc, { stats: s }) => ({
      matchesPlayed: acc.matchesPlayed + s.matchesPlayed,
      matchesWon: acc.matchesWon + s.matchesWon,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
    }),
    { matchesPlayed: 0, matchesWon: 0, goals: 0, assists: 0 },
  );

  res.json({ player, bySeasonArr, total });
});
