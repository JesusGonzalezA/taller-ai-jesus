export type Position = 'goalkeeper' | 'defender' | 'winger' | 'forward';

export interface Player {
  id: string;
  name: string;
  position: Position;
}

export interface TeamConfig {
  name: string;
  color: string;
}

export interface PenaSettings {
  name: string;
  matchesPerWeek: number;
  teamA: TeamConfig;
  teamB: TeamConfig;
}

export interface PlayerMatchStats {
  playerId: string;
  goals: number;
  assists: number;
}

export interface MatchResult {
  teamAGoals: number;
  teamBGoals: number;
  scorers: PlayerMatchStats[];
}

export interface Match {
  id: string;
  seasonId: string;
  date: string;
  attendance: string[];
  teamA: string[];
  teamB: string[];
  subs: string[];
  result?: MatchResult;
}

export interface MatchWithSeason extends Match {
  seasonName: string;
}

export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  closed: boolean;
  matches: Match[];
}

export interface SeasonSummary {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  closed: boolean;
  matchCount: number;
}

export interface Pena {
  id: string;
  settings: PenaSettings;
  players: Player[];
  seasons: Season[];
}

export interface PlayerSeasonStats {
  playerId: string;
  playerName: string;
  position: Position;
  matchesPlayed: number;
  matchesWon: number;
  goals: number;
  assists: number;
}

export interface StatsResponse {
  season: { id: string; name: string; closed: boolean };
  stats: PlayerSeasonStats[];
}

export interface PlayerStatsResponse {
  player: Player;
  bySeasonArr: {
    seasonId: string;
    seasonName: string;
    closed: boolean;
    stats: PlayerSeasonStats;
  }[];
  total: {
    matchesPlayed: number;
    matchesWon: number;
    goals: number;
    assists: number;
  };
}

export interface CreateMatchResponse {
  match: Match;
  newPlayers: Player[];
  pena: { id: string; players: Player[] };
}
