import type { Match, Pena, Player, PlayerSeasonStats, Season } from './types';

export function computeSeasonStats(pena: Pena, season: Season): PlayerSeasonStats[] {
  const statsMap = new Map<string, PlayerSeasonStats>();

  // Initialise all players
  for (const player of pena.players) {
    statsMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      position: player.position,
      matchesPlayed: 0,
      matchesWon: 0,
      goals: 0,
      assists: 0,
    });
  }

  for (const match of season.matches) {
    if (!match.result) continue;

    const { teamAGoals, teamBGoals, scorers } = match.result;
    const teamAWon = teamAGoals > teamBGoals;

    const updatePlayer = (playerId: string, won: boolean): void => {
      const s = statsMap.get(playerId);
      if (!s) {
        // player removed from roster but played — skip
        return;
      }
      s.matchesPlayed += 1;
      if (won) s.matchesWon += 1;
    };

    for (const pid of match.teamA) updatePlayer(pid, teamAWon);
    for (const pid of match.teamB) updatePlayer(pid, !teamAWon && teamAGoals !== teamBGoals);

    for (const scorer of scorers) {
      const s = statsMap.get(scorer.playerId);
      if (!s) continue;
      s.goals += scorer.goals;
      s.assists += scorer.assists;
    }
  }

  return Array.from(statsMap.values()).sort((a, b) => b.goals - a.goals);
}

export function getActiveSeason(pena: Pena): Season | undefined {
  return pena.seasons.find((s) => !s.closed);
}

export function resolveAttendance(
  attendanceList: string[],
  players: Player[],
): { matched: Player[]; unmatched: string[] } {
  const matched: Player[] = [];
  const unmatched: string[] = [];

  for (const name of attendanceList) {
    const normalised = name.trim().toLowerCase();
    const found = players.find((p) => p.name.toLowerCase() === normalised);
    if (found) {
      matched.push(found);
    } else {
      unmatched.push(name.trim());
    }
  }

  return { matched, unmatched };
}

function computeScore(playerId: string, seasonMatches: Match[]): number {
  let played = 0;
  let won = 0;
  let goals = 0;
  let assists = 0;

  for (const match of seasonMatches) {
    if (!match.result) continue;
    const inTeamA = match.teamA.includes(playerId);
    const inTeamB = match.teamB.includes(playerId);
    if (!inTeamA && !inTeamB) continue;

    played += 1;
    const teamAWon = match.result.teamAGoals > match.result.teamBGoals;
    if ((inTeamA && teamAWon) || (inTeamB && !teamAWon)) won += 1;

    for (const s of match.result.scorers) {
      if (s.playerId === playerId) {
        goals += s.goals;
        assists += s.assists;
      }
    }
  }

  if (played === 0) return 0;
  const winRate = won / played;
  const goalsPerMatch = goals / played;
  const assistsPerMatch = assists / played;
  return winRate * 3 + goalsPerMatch * 2 + assistsPerMatch;
}

export function generateLineup(
  players: Player[],
  seasonMatches: Match[],
): { teamA: string[]; teamB: string[]; subs: string[] } {
  const positionOrder: Array<Player['position']> = ['goalkeeper', 'defender', 'winger', 'forward'];

  // Score each player
  const scores = new Map<string, number>();
  for (const p of players) {
    scores.set(p.id, computeScore(p.id, seasonMatches));
  }

  // Group by position
  const byPosition = new Map<string, Player[]>();
  for (const pos of positionOrder) {
    byPosition.set(pos, []);
  }
  for (const p of players) {
    byPosition.get(p.position)?.push(p);
  }

  // Sort each group by score descending
  for (const pos of positionOrder) {
    const group = byPosition.get(pos) ?? [];
    group.sort((a, b) => (scores.get(b.id) ?? 0) - (scores.get(a.id) ?? 0));
    byPosition.set(pos, group);
  }

  // Snake draft: alternately assign to teamA and teamB within each position group
  const teamA: string[] = [];
  const teamB: string[] = [];
  const subs: string[] = [];

  for (const pos of positionOrder) {
    const group = byPosition.get(pos) ?? [];
    let turn = 0; // 0 = teamA, 1 = teamB

    // If position has only 1 player, put a goalkeeper in one team and skip
    for (const player of group) {
      // Last player if group is odd-sized AND it's the last one
      // We handle odd total at the end
      if (turn === 0) {
        teamA.push(player.id);
      } else {
        teamB.push(player.id);
      }
      turn = 1 - turn;
    }
  }

  // Balance team sizes — move extras to subs
  while (teamA.length > 0 && teamB.length > 0) {
    const diff = teamA.length - teamB.length;
    if (Math.abs(diff) <= 1) break;
    if (diff > 1) {
      subs.push(teamA.pop() as string);
    } else {
      subs.push(teamB.pop() as string);
    }
  }

  return { teamA, teamB, subs };
}

export function parseWhatsAppList(raw: string): string[] {
  return raw
    .split('\n')
    .map((line) =>
      line
        .replace(/^\d+[\.\-\)]\s*/, '') // remove numbering like "1. " "1) " "1- "
        .replace(/^[-*•]\s*/, '') // remove bullet chars
        .trim(),
    )
    .filter((line) => line.length > 0);
}
