import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { Pena, PlayerSeasonStats, SeasonSummary, StatsResponse } from '../types';

type Position = 'goalkeeper' | 'defender' | 'winger' | 'forward';
const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: '🧤 Portero',
  defender: '🛡️ Defensa',
  winger: '💨 Ala',
  forward: '⚡ Delantero',
};

export default function StatsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pena, setPena] = useState<Pena | null>(null);
  const [seasons, setSeasons] = useState<SeasonSummary[]>([]);
  const [selectedSeason, setSelectedSeason] = useState('');
  const [statsData, setStatsData] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getPena(id), api.getSeasons(id)])
      .then(([p, s]) => {
        setPena(p);
        setSeasons(s);
        const active = s.find((x) => !x.closed);
        const initial = active?.id ?? (s.length > 0 ? s[s.length - 1].id : '');
        setSelectedSeason(initial);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedSeason) return;
    api
      .getStats(id, selectedSeason)
      .then(setStatsData)
      .catch(() => {});
  }, [id, selectedSeason]);

  if (loading)
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  if (!pena)
    return (
      <div className="page">
        <div className="alert alert-error">Error</div>
      </div>
    );

  const stats = statsData?.stats ?? [];
  const topScorer = stats[0];

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-4)',
          marginBottom: 'var(--space-6)',
          flexWrap: 'wrap',
        }}
      >
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, flex: 1 }}>📊 Estadísticas</h1>
        {seasons.length > 0 && (
          <select
            className="form-select"
            style={{ width: 'auto', maxWidth: 240 }}
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            {seasons.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.closed ? ' (cerrada)' : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Podium top 3 */}
      {stats.length >= 3 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {[
            { rank: 2, stat: stats[1] },
            { rank: 1, stat: stats[0] },
            { rank: 3, stat: stats[2] },
          ].map(({ rank, stat }) => (
            <button
              key={stat.playerId}
              onClick={() => navigate(`/pena/${id}/stats/${stat.playerId}`)}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)',
                cursor: 'pointer',
                textAlign: 'center',
                minWidth: 120,
                transform: rank === 1 ? 'translateY(-12px) scale(1.05)' : 'none',
                transition: 'all var(--transition)',
                fontFamily: 'var(--font-sans)',
                color: 'var(--color-text)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>
                {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
              </div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{stat.playerName}</div>
              <div className="stat-number">{stat.goals}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                goles
              </div>
            </button>
          ))}
        </div>
      )}

      {stats.length === 0 && (
        <div className="empty-state">
          <div className="icon">📊</div>
          <h3>Sin estadísticas</h3>
          <p>Registra partidos con resultado para ver estadísticas</p>
        </div>
      )}

      {stats.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Posición</th>
                <th>PJ</th>
                <th>PG</th>
                <th>⚽ Goles</th>
                <th>🎯 Asistencias</th>
                <th>% Vic</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s: PlayerSeasonStats, idx: number) => (
                <tr
                  key={s.playerId}
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/pena/${id}/stats/${s.playerId}`)}
                >
                  <td style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>{idx + 1}</td>
                  <td style={{ fontWeight: 600 }}>{s.playerName}</td>
                  <td>{POSITION_LABELS[s.position as Position]}</td>
                  <td>{s.matchesPlayed}</td>
                  <td>{s.matchesWon}</td>
                  <td style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{s.goals}</td>
                  <td>{s.assists}</td>
                  <td style={{ color: 'var(--color-text-muted)' }}>
                    {s.matchesPlayed > 0 ? Math.round((s.matchesWon / s.matchesPlayed) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {topScorer && (
        <p
          style={{
            marginTop: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-dim)',
            textAlign: 'right',
          }}
        >
          Haz click en un jugador para ver sus estadísticas detalladas
        </p>
      )}
    </div>
  );
}
