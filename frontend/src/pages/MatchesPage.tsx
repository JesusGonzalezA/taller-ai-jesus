import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { MatchWithSeason, Pena } from '../types';

export default function MatchesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pena, setPena] = useState<Pena | null>(null);
  const [matches, setMatches] = useState<MatchWithSeason[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getPena(id), api.getMatches(id)])
      .then(([p, m]) => {
        setPena(p);
        setMatches(m);
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  const activeSeason = pena.seasons.find((s) => !s.closed);

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--space-6)',
        }}
      >
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>⚽ Partidos</h1>
        {activeSeason && (
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/pena/${id}/match/new`)}>
            + Nuevo partido
          </button>
        )}
      </div>

      {matches.length === 0 && (
        <div className="empty-state">
          <div className="icon">⚽</div>
          <h3>Sin partidos</h3>
          <p>
            {activeSeason ? 'Crea el primer partido de la temporada' : 'Crea una temporada primero'}
          </p>
        </div>
      )}

      {/* Group by season */}
      {pena.seasons.map((season) => {
        const seasonMatches = matches.filter((m) => m.seasonId === season.id);
        if (seasonMatches.length === 0) return null;
        return (
          <div key={season.id} style={{ marginBottom: 'var(--space-8)' }}>
            <h2
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
              }}
            >
              🏆 {season.name}
              {season.closed && <span className="badge">Cerrada</span>}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {seasonMatches.map((match) => (
                <button
                  key={match.id}
                  onClick={() => navigate(`/pena/${id}/match/${match.id}`)}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-4) var(--space-5)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    width: '100%',
                    textAlign: 'left',
                    transition: 'all var(--transition)',
                    fontFamily: 'var(--font-sans)',
                    color: 'var(--color-text)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                  }}
                >
                  <span
                    style={{
                      fontSize: 'var(--text-sm)',
                      color: 'var(--color-text-muted)',
                      minWidth: 90,
                    }}
                  >
                    {new Date(match.date).toLocaleDateString('es-ES')}
                  </span>
                  <span style={{ flex: 1, fontSize: 'var(--text-sm)' }}>
                    {match.attendance.length} jugadores
                  </span>
                  {match.result ? (
                    <span style={{ fontWeight: 700 }}>
                      <span style={{ color: pena.settings.teamA.color }}>
                        {match.result.teamAGoals}
                      </span>
                      <span style={{ color: 'var(--color-text-muted)', margin: '0 6px' }}>-</span>
                      <span style={{ color: pena.settings.teamB.color }}>
                        {match.result.teamBGoals}
                      </span>
                    </span>
                  ) : (
                    <span className="badge badge-orange">Pendiente</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
