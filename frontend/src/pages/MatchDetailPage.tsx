import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { PositionBadge } from '../components/PlayerCard';
import type { MatchWithSeason, Pena, Player, PlayerMatchStats } from '../types';

export default function MatchDetailPage() {
  const { id, matchId } = useParams<{ id: string; matchId: string }>();
  const navigate = useNavigate();
  const [pena, setPena] = useState<Pena | null>(null);
  const [match, setMatch] = useState<MatchWithSeason | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Result form
  const [teamAGoals, setTeamAGoals] = useState('');
  const [teamBGoals, setTeamBGoals] = useState('');
  const [scorers, setScorers] = useState<PlayerMatchStats[]>([]);

  useEffect(() => {
    if (!id || !matchId) return;
    Promise.all([api.getPena(id), api.getMatch(id, matchId)])
      .then(([p, m]) => {
        setPena(p);
        setMatch(m);
      })
      .catch(() => setError('Error al cargar el partido'))
      .finally(() => setLoading(false));
  }, [id, matchId]);

  function getPlayer(pid: string): Player | undefined {
    return pena?.players.find((p) => p.id === pid);
  }

  function updateScorer(playerId: string, field: 'goals' | 'assists', value: number) {
    setScorers((prev) => {
      const existing = prev.find((s) => s.playerId === playerId);
      if (existing) {
        return prev.map((s) => (s.playerId === playerId ? { ...s, [field]: value } : s));
      }
      return [...prev, { playerId, goals: 0, assists: 0, [field]: value }];
    });
  }

  async function handleSubmitResult(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !matchId) return;
    setSubmitting(true);
    setError('');
    try {
      const updated = (await api.submitResult(id, matchId, {
        teamAGoals: Number(teamAGoals),
        teamBGoals: Number(teamBGoals),
        scorers: scorers.filter((s) => s.goals > 0 || s.assists > 0),
      })) as MatchWithSeason;
      setMatch({ ...updated, seasonName: match?.seasonName ?? '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading)
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  if (!pena || !match)
    return (
      <div className="page">
        <div className="alert alert-error">{error || 'Partido no encontrado'}</div>
      </div>
    );

  const teamAColor = pena.settings.teamA.color;
  const teamBColor = pena.settings.teamB.color;
  const allPlayers = [...match.teamA, ...match.teamB];

  return (
    <div className="page">
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: 'var(--space-4)' }}
      >
        ← Volver
      </button>

      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
          {pena.settings.teamA.name} vs {pena.settings.teamB.name}
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-sm)',
            marginTop: 'var(--space-1)',
          }}
        >
          {new Date(match.date).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}{' '}
          · {match.seasonName}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Result display or form */}
      {match.result ? (
        <div className="card" style={{ marginBottom: 'var(--space-6)', textAlign: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--space-8)',
              padding: 'var(--space-6) 0',
            }}
          >
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: teamAColor }}>
                {pena.settings.teamA.name}
              </div>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: teamAColor }}>
                {match.result.teamAGoals}
              </div>
            </div>
            <div
              style={{
                color: 'var(--color-text-muted)',
                fontSize: 'var(--text-2xl)',
                fontWeight: 300,
              }}
            >
              -
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 'var(--text-lg)', color: teamBColor }}>
                {pena.settings.teamB.name}
              </div>
              <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: teamBColor }}>
                {match.result.teamBGoals}
              </div>
            </div>
          </div>
          {match.result.scorers.length > 0 && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h3
                style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'var(--text-sm)',
                  marginBottom: 'var(--space-3)',
                }}
              >
                ⚽ Goleadores
              </h3>
              <div
                style={{
                  display: 'flex',
                  gap: 'var(--space-3)',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}
              >
                {match.result.scorers.map((s) => {
                  const p = getPlayer(s.playerId);
                  return p ? (
                    <span key={s.playerId} className="badge badge-green">
                      {p.name} ⚽{s.goals}
                      {s.assists > 0 ? ` 🎯${s.assists}` : ''}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="section-title">📝 Registrar resultado</h2>
          <form onSubmit={handleSubmitResult}>
            <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="goals-a">
                  {pena.settings.teamA.name} — Goles
                </label>
                <input
                  id="goals-a"
                  className="form-input"
                  type="number"
                  min={0}
                  value={teamAGoals}
                  onChange={(e) => setTeamAGoals(e.target.value)}
                  required
                  style={{
                    fontSize: 'var(--text-2xl)',
                    textAlign: 'center',
                    color: teamAColor,
                    fontWeight: 700,
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="goals-b">
                  {pena.settings.teamB.name} — Goles
                </label>
                <input
                  id="goals-b"
                  className="form-input"
                  type="number"
                  min={0}
                  value={teamBGoals}
                  onChange={(e) => setTeamBGoals(e.target.value)}
                  required
                  style={{
                    fontSize: 'var(--text-2xl)',
                    textAlign: 'center',
                    color: teamBColor,
                    fontWeight: 700,
                  }}
                />
              </div>
            </div>

            {/* Scorer inputs */}
            <h3
              style={{
                fontWeight: 600,
                fontSize: 'var(--text-sm)',
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-4)',
              }}
            >
              ⚽ Goles y asistencias individuales (opcional)
            </h3>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                marginBottom: 'var(--space-6)',
              }}
            >
              {allPlayers.map((pid) => {
                const p = getPlayer(pid);
                if (!p) return null;
                const scorer = scorers.find((s) => s.playerId === pid);
                const isTeamA = match.teamA.includes(pid);
                return (
                  <div
                    key={pid}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: `${isTeamA ? teamAColor : teamBColor}33`,
                        border: `2px solid ${isTeamA ? teamAColor : teamBColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        color: isTeamA ? teamAColor : teamBColor,
                        flexShrink: 0,
                      }}
                    >
                      {p.name[0]?.toUpperCase()}
                    </div>
                    <span style={{ flex: 1, fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                      {p.name}
                    </span>
                    <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
                      <label
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}
                      >
                        ⚽
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={scorer?.goals ?? 0}
                        onChange={(e) => updateScorer(pid, 'goals', Number(e.target.value))}
                        style={{
                          width: 52,
                          background: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text)',
                          padding: '4px 8px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--text-sm)',
                        }}
                      />
                      <label
                        style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}
                      >
                        🎯
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={scorer?.assists ?? 0}
                        onChange={(e) => updateScorer(pid, 'assists', Number(e.target.value))}
                        style={{
                          width: 52,
                          background: 'var(--color-surface-2)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text)',
                          padding: '4px 8px',
                          textAlign: 'center',
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'var(--text-sm)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%' }}
              disabled={submitting}
            >
              {submitting ? '⏳ Guardando...' : '💾 Guardar resultado'}
            </button>
          </form>
        </div>
      )}

      {/* Lineups display */}
      <div className="grid-2">
        <div className="card" style={{ borderTop: `3px solid ${teamAColor}` }}>
          <h3 style={{ fontWeight: 700, color: teamAColor, marginBottom: 'var(--space-4)' }}>
            {pena.settings.teamA.name}
          </h3>
          {match.teamA.map((pid) => {
            const p = getPlayer(pid);
            return p ? (
              <div
                key={pid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{p.name}</span>
                <PositionBadge position={p.position} />
              </div>
            ) : null;
          })}
        </div>
        <div className="card" style={{ borderTop: `3px solid ${teamBColor}` }}>
          <h3 style={{ fontWeight: 700, color: teamBColor, marginBottom: 'var(--space-4)' }}>
            {pena.settings.teamB.name}
          </h3>
          {match.teamB.map((pid) => {
            const p = getPlayer(pid);
            return p ? (
              <div
                key={pid}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{p.name}</span>
                <PositionBadge position={p.position} />
              </div>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}
