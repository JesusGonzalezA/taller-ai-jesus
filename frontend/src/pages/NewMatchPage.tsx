import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { PositionBadge } from '../components/PlayerCard';
import type { CreateMatchResponse, Pena, Player } from '../types';

export default function NewMatchPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pena, setPena] = useState<Pena | null>(null);
  const [whatsappList, setWhatsappList] = useState('');
  const [result, setResult] = useState<CreateMatchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    api
      .getPena(id)
      .then(setPena)
      .catch(() => setError('Error al cargar la peña'))
      .finally(() => setInitLoading(false));
  }, [id]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !whatsappList.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await api.createMatch(id, { whatsappList });
      setResult(res);
      // Reload pena to get updated players list
      const updatedPena = await api.getPena(id);
      setPena(updatedPena);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la alineación');
    } finally {
      setLoading(false);
    }
  }

  if (initLoading)
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  if (!pena)
    return (
      <div className="page">
        <div className="alert alert-error">{error || 'Peña no encontrada'}</div>
      </div>
    );

  const teamAColor = pena.settings.teamA.color;
  const teamBColor = pena.settings.teamB.color;

  const getPlayer = (pid: string): Player | undefined =>
    result?.pena.players.find((p) => p.id === pid) ?? pena.players.find((p) => p.id === pid);

  return (
    <div className="page">
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-8)' }}>
        ⚽ Nuevo partido
      </h1>

      {error && <div className="alert alert-error">{error}</div>}

      {!result ? (
        <div className="card" style={{ maxWidth: 640 }}>
          <h2 className="section-title">📱 Lista de WhatsApp</h2>
          <p
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Pega la lista de asistentes copiada de WhatsApp. Un nombre por línea. Los jugadores ya
            registrados se reconocerán automáticamente; los nuevos se crearán con perfil vacío.
          </p>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label className="form-label" htmlFor="wa-list">
                Lista de asistentes
              </label>
              <textarea
                id="wa-list"
                className="form-textarea"
                placeholder={'1. Juan García\n2. Pedro Martínez\n3. Carlos López\n...'}
                value={whatsappList}
                onChange={(e) => setWhatsappList(e.target.value)}
                rows={10}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: 'var(--space-4)' }}
              disabled={loading}
            >
              {loading ? '⏳ Generando alineación...' : '🎲 Generar alineación'}
            </button>
          </form>
        </div>
      ) : (
        <div>
          {result.newPlayers.length > 0 && (
            <div className="alert alert-success" style={{ marginBottom: 'var(--space-6)' }}>
              ✨ Se crearon {result.newPlayers.length} perfil(es) nuevo(s):{' '}
              {result.newPlayers.map((p) => p.name).join(', ')}
            </div>
          )}

          <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
            {/* Team A */}
            <div className="card" style={{ borderTop: `4px solid ${teamAColor}` }}>
              <h2
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: teamAColor,
                  marginBottom: 'var(--space-4)',
                }}
              >
                {pena.settings.teamA.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {result.match.teamA.map((pid) => {
                  const p = getPlayer(pid);
                  return p ? (
                    <div
                      key={pid}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: `${teamAColor}33`,
                          border: `2px solid ${teamAColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                          color: teamAColor,
                          flexShrink: 0,
                        }}
                      >
                        {p.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.name}</div>
                        <PositionBadge position={p.position} />
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Team B */}
            <div className="card" style={{ borderTop: `4px solid ${teamBColor}` }}>
              <h2
                style={{
                  fontSize: 'var(--text-xl)',
                  fontWeight: 700,
                  color: teamBColor,
                  marginBottom: 'var(--space-4)',
                }}
              >
                {pena.settings.teamB.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {result.match.teamB.map((pid) => {
                  const p = getPlayer(pid);
                  return p ? (
                    <div
                      key={pid}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: `${teamBColor}33`,
                          border: `2px solid ${teamBColor}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 'var(--text-sm)',
                          fontWeight: 700,
                          color: teamBColor,
                          flexShrink: 0,
                        }}
                      >
                        {p.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{p.name}</div>
                        <PositionBadge position={p.position} />
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {result.match.subs.length > 0 && (
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
              <h3
                style={{
                  fontWeight: 600,
                  marginBottom: 'var(--space-3)',
                  color: 'var(--color-text-muted)',
                }}
              >
                🪑 Suplentes
              </h3>
              <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                {result.match.subs.map((pid) => {
                  const p = getPlayer(pid);
                  return p ? (
                    <span key={pid} className="badge">
                      {p.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/pena/${id}/match/${result.match.id}`)}
            >
              📝 Registrar resultado
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setResult(null);
                setWhatsappList('');
              }}
            >
              🔄 Nueva alineación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
