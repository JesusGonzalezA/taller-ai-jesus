import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';

export default function HomePage() {
  const [penas, setPenas] = useState<{ id: string; settings: { name: string } }[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api
      .listPenas()
      .then(setPenas)
      .catch(() => setError('No se pudieron cargar las peñas'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError('');
    try {
      const pena = (await api.createPena({ name: newName.trim() })) as { id: string };
      navigate(`/pena/${pena.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la peña');
    }
  }

  return (
    <div className="page">
      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'var(--space-12) 0 var(--space-10)' }}>
        <div style={{ fontSize: '5rem', marginBottom: 'var(--space-4)' }}>⚽</div>
        <h1
          style={{ fontSize: 'var(--text-4xl)', fontWeight: 700, marginBottom: 'var(--space-4)' }}
        >
          Peñas de <span style={{ color: 'var(--color-accent)' }}>Fútbol</span>
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-lg)',
            maxWidth: 500,
            margin: '0 auto',
          }}
        >
          Gestiona tu peña, genera alineaciones automáticas y lleva el registro de estadísticas.
        </p>
      </div>

      <div className="grid-2" style={{ maxWidth: 800, margin: '0 auto', gap: 'var(--space-8)' }}>
        {/* Create new */}
        <div className="card">
          <h2 className="section-title">🆕 Nueva peña</h2>
          {error && <div className="alert alert-error">{error}</div>}
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label" htmlFor="pena-name">
                Nombre de la peña
              </label>
              <input
                id="pena-name"
                className="form-input"
                placeholder="Los Galácticos"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Crear peña →
            </button>
          </form>
        </div>

        {/* Existing peñas */}
        <div className="card">
          <h2 className="section-title">📋 Peñas existentes</h2>
          {loading && <div className="spinner" />}
          {!loading && penas.length === 0 && (
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              No hay peñas creadas todavía.
            </p>
          )}
          <ul
            style={{
              listStyle: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {penas.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/pena/${p.id}`)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    background: 'var(--color-surface-2)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3) var(--space-4)',
                    color: 'var(--color-text)',
                    cursor: 'pointer',
                    fontSize: 'var(--text-sm)',
                    fontFamily: 'var(--font-sans)',
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--color-text)';
                  }}
                >
                  ⚽ {p.settings.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {creating && <div style={{ display: 'none' }}>{creating}</div>}
    </div>
  );
}
