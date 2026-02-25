import type {
  CreateMatchResponse,
  MatchResult,
  MatchWithSeason,
  Pena,
  Player,
  PlayerSeasonStats,
  PlayerStatsResponse,
  Position,
  SeasonSummary,
  StatsResponse,
} from '../types';

const BASE =
  typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV
    ? 'http://localhost:3000'
    : '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  // Peñas
  listPenas: () => request<{ id: string; settings: { name: string } }[]>('/api/penas'),
  createPena: (data: { name: string; matchesPerWeek?: number }) =>
    request<Pena>('/api/penas', { method: 'POST', body: JSON.stringify(data) }),
  getPena: (id: string) => request<Pena>(`/api/penas/${id}`),
  updateSettings: (id: string, data: Partial<Pena['settings']>) =>
    request<Pena>(`/api/penas/${id}/settings`, { method: 'PUT', body: JSON.stringify(data) }),

  // Players
  getPlayers: (penaId: string) => request<Player[]>(`/api/penas/${penaId}/players`),
  addPlayer: (penaId: string, data: { name: string; position: Position }) =>
    request<Player>(`/api/penas/${penaId}/players`, { method: 'POST', body: JSON.stringify(data) }),
  updatePlayer: (penaId: string, playerId: string, data: Partial<Player>) =>
    request<Player>(`/api/penas/${penaId}/players/${playerId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlayer: (penaId: string, playerId: string) =>
    request<void>(`/api/penas/${penaId}/players/${playerId}`, { method: 'DELETE' }),

  // Seasons
  getSeasons: (penaId: string) => request<SeasonSummary[]>(`/api/penas/${penaId}/seasons`),
  createSeason: (penaId: string, data: { name: string }) =>
    request<SeasonSummary>(`/api/penas/${penaId}/seasons`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  closeSeason: (penaId: string, seasonId: string) =>
    request<SeasonSummary>(`/api/penas/${penaId}/seasons/${seasonId}/close`, { method: 'PUT' }),

  // Matches
  getMatches: (penaId: string, seasonId?: string) =>
    request<MatchWithSeason[]>(
      `/api/penas/${penaId}/matches${seasonId ? `?seasonId=${seasonId}` : ''}`,
    ),
  createMatch: (penaId: string, data: { whatsappList?: string; playerIds?: string[] }) =>
    request<CreateMatchResponse>(`/api/penas/${penaId}/matches`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getMatch: (penaId: string, matchId: string) =>
    request<MatchWithSeason>(`/api/penas/${penaId}/matches/${matchId}`),
  submitResult: (penaId: string, matchId: string, data: MatchResult) =>
    request<MatchWithSeason>(`/api/penas/${penaId}/matches/${matchId}/result`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Stats
  getStats: (penaId: string, seasonId?: string) =>
    request<StatsResponse>(`/api/penas/${penaId}/stats${seasonId ? `?seasonId=${seasonId}` : ''}`),
  getPlayerStats: (penaId: string, playerId: string) =>
    request<PlayerStatsResponse>(`/api/penas/${penaId}/stats/${playerId}`),

  // needed for stats response type
  _playerSeasonStats: null as unknown as PlayerSeasonStats,
};
