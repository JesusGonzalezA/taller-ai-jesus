import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { PositionBadge } from '../components/PlayerCard';
import type { PlayerStatsResponse } from '../types';

export default function PlayerStatsPage() {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<PlayerStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || !playerId) return;
    api
      .getPlayerStats(id, playerId)
      .then(setData)
      .finally(() => setLoading(false));
  }, [id, playerId]);

  if (loading)
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  if (!data)
    return (
      <div className="page">
        <div className="alert alert-error">Jugador no encontrado</div>
      </div>
    );

  const { player, bySeasonArr, total } = data;

  return (
    <div className="page" style={{ maxWidth: 700 }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 'var(--space-4)' }}
      >
        ← Volver
      </button>

      {/* Player header */}
      <div
        className="card"
        style={{
          marginBottom: 'var(--space-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-5)',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--color-accent-glow)',
            border: '3px solid var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--text-2xl)',
            fontWeight: 700,
            color: 'var(--color-accent)',
            flexShrink: 0,
          }}
        >
          {player.name[0]?.toUpperCase()}
        </div>
        <div>
          <h1
            style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}
          >
            {player.name}
          </h1>
          <PositionBadge position={player.position} />
        </div>
      </div>

      {/* Totals */}
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'Partidos jugados', value: total.matchesPlayed, icon: '🏃' },
          { label: 'Victorias', value: total.matchesWon, icon: '🏆' },
          { label: 'Goles', value: total.goals, icon: '⚽' },
          { label: 'Asistencias', value: total.assists, icon: '🎯' },
        ].map(({ label, value, icon }) => (
          <div key={label} className="card" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: 'var(--space-1)' }}>{icon}</div>
            <div className="stat-number">{value}</div>
            <div
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-muted)',
                marginTop: 'var(--space-1)',
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      {total.matchesPlayed > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--space-1)' }}>📈</div>
          <div className="stat-number">
            {Math.round((total.matchesWon / total.matchesPlayed) * 100)}%
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Porcentaje de victorias
          </div>
        </div>
      )}

      {/* By season */}
      <h2 className="section-title">Por temporada</h2>
      {bySeasonArr.length === 0 && (
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
          Sin temporadas registradas
        </p>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {bySeasonArr.map(({ seasonId, seasonName, closed, stats: s }) => (
          <div key={seasonId} className="card" style={{ padding: 'var(--space-4) var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <span style={{ fontWeight: 600, flex: 1 }}>🏆 {seasonName}</span>
              {closed && (
                <span className="badge" style={{ fontSize: '10px' }}>
                  Cerrada
                </span>
              )}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-2)',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                  {s.matchesPlayed}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  PJ
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{s.matchesWon}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  PG
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{s.goals}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  ⚽
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>{s.assists}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                  🎯
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
