export type Position = 'goalkeeper' | 'defender' | 'winger' | 'forward';

export interface Player {
  id: string;
  name: string;
  position: Position;
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
  date: string; // ISO string
  attendance: string[]; // player names from WhatsApp list
  teamA: string[]; // player IDs
  teamB: string[]; // player IDs
  subs: string[]; // player IDs (odd player out)
  result?: MatchResult;
}

export interface TeamConfig {
  name: string;
  color: string; // hex color
}

export interface PenaSettings {
  name: string;
  matchesPerWeek: number;
  teamA: TeamConfig;
  teamB: TeamConfig;
}

export interface Season {
  id: string;
  name: string;
  startDate: string; // ISO string
  endDate?: string; // ISO string
  closed: boolean;
  matches: Match[];
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
