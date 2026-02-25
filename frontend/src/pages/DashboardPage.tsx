import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { MatchWithSeason, Pena, SeasonSummary } from '../types';

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pena, setPena] = useState<Pena | null>(null);
  const [seasons, setSeasons] = useState<SeasonSummary[]>([]);
  const [matches, setMatches] = useState<MatchWithSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [showNewSeason, setShowNewSeason] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    Promise.all([api.getPena(id), api.getSeasons(id)])
      .then(([p, s]) => {
        setPena(p);
        setSeasons(s);
        const active = s.find((x) => !x.closed);
        if (active) setSelectedSeason(active.id);
        else if (s.length > 0) setSelectedSeason(s[s.length - 1].id);
      })
      .catch(() => setError('Error al cargar la peña'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !selectedSeason) return;
    api
      .getMatches(id, selectedSeason)
      .then(setMatches)
      .catch(() => {});
  }, [id, selectedSeason]);

  async function handleCreateSeason(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !newSeasonName.trim()) return;
    try {
      const s = (await api.createSeason(id, { name: newSeasonName.trim() })) as SeasonSummary;
      setSeasons((prev) => [...prev, s]);
      setSelectedSeason(s.id);
      setNewSeasonName('');
      setShowNewSeason(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleCloseSeason() {
    if (!id || !selectedSeason || !window.confirm('¿Cerrar la temporada actual?')) return;
    try {
      await api.closeSeason(id, selectedSeason);
      const updated = await api.getSeasons(id);
      setSeasons(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  if (loading)
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  if (!pena)
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );

  const activeSeason = seasons.find((s) => !s.closed);
  const currentSeason = seasons.find((s) => s.id === selectedSeason);

  return (
    <div className="page">
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 700 }}>{pena.settings.name}</h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>
          {pena.players.length} jugadores · {pena.settings.matchesPerWeek} partido(s)/semana
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Season selector */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}
        >
          <label
            style={{
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
            }}
          >
            📅 Temporada:
          </label>
          {seasons.length > 0 ? (
            <select
              className="form-select"
              style={{ width: 'auto', flex: 1, maxWidth: 280 }}
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
            >
              {seasons.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.closed ? '(cerrada)' : '✅'}
                </option>
              ))}
            </select>
          ) : (
            <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              Sin temporadas
            </span>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-2)', marginLeft: 'auto' }}>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowNewSeason(!showNewSeason)}
            >
              + Temporada
            </button>
            {activeSeason && (
              <button type="button" className="btn btn-danger btn-sm" onClick={handleCloseSeason}>
                Cerrar temporada
              </button>
            )}
          </div>
        </div>

        {showNewSeason && (
          <form
            onSubmit={handleCreateSeason}
            style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)' }}
          >
            <input
              className="form-input"
              placeholder="Temporada 2025/26"
              value={newSeasonName}
              onChange={(e) => setNewSeasonName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Crear
            </button>
          </form>
        )}
      </div>

      {/* Quick actions */}
      {activeSeason && (
        <div className="grid-3" style={{ marginBottom: 'var(--space-8)' }}>
          <Link to={`/pena/${id}/match/new`} style={{ textDecoration: 'none' }}>
            <div
              className="card"
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-8)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>⚽</div>
              <div style={{ fontWeight: 600 }}>Nuevo partido</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Generar alineación
              </div>
            </div>
          </Link>
          <Link to={`/pena/${id}/players`} style={{ textDecoration: 'none' }}>
            <div
              className="card"
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-8)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>👥</div>
              <div style={{ fontWeight: 600 }}>Jugadores</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {pena.players.length} registrados
              </div>
            </div>
          </Link>
          <Link to={`/pena/${id}/stats`} style={{ textDecoration: 'none' }}>
            <div
              className="card"
              style={{ cursor: 'pointer', textAlign: 'center', padding: 'var(--space-8)' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📊</div>
              <div style={{ fontWeight: 600 }}>Estadísticas</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {currentSeason?.matchCount ?? 0} partidos
              </div>
            </div>
          </Link>
        </div>
      )}

      {!activeSeason && seasons.length === 0 && (
        <div className="empty-state">
          <div className="icon">🏆</div>
          <h3>Sin temporadas</h3>
          <p>Crea una temporada para empezar a registrar partidos</p>
        </div>
      )}

      {/* Recent matches */}
      {matches.length > 0 && (
        <div>
          <h2 className="section-title">📋 Últimos partidos</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {matches.slice(0, 5).map((match) => (
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
                <span style={{ flex: 1 }}>
                  {pena.settings.teamA.name} vs {pena.settings.teamB.name}
                </span>
                {match.result ? (
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-lg)' }}>
                    <span style={{ color: pena.settings.teamA.color }}>
                      {match.result.teamAGoals}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', margin: '0 4px' }}>-</span>
                    <span style={{ color: pena.settings.teamB.color }}>
                      {match.result.teamBGoals}
                    </span>
                  </span>
                ) : (
                  <span className="badge badge-orange">Sin resultado</span>
                )}
              </button>
            ))}
          </div>
          {matches.length > 5 && (
            <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
              <Link to={`/pena/${id}/matches`} className="btn btn-secondary">
                Ver todos ({matches.length})
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
