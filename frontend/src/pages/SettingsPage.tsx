import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { PenaSettings } from '../types';

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();
  const [settings, setSettings] = useState<PenaSettings | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api
      .getPena(id)
      .then((p) => setSettings(p.settings))
      .catch(() => setError('Error al cargar'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !settings) return;
    setError('');
    setSaved(false);
    try {
      await api.updateSettings(id, settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
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
  if (!settings)
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
      </div>
    );

  return (
    <div className="page" style={{ maxWidth: 600 }}>
      <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-8)' }}>
        ⚙️ Ajustes de la peña
      </h1>

      {error && <div className="alert alert-error">{error}</div>}
      {saved && <div className="alert alert-success">✅ Guardado correctamente</div>}

      <form onSubmit={handleSubmit}>
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="section-title">General</h2>
          <div className="form-group">
            <label className="form-label" htmlFor="s-name">
              Nombre de la peña
            </label>
            <input
              id="s-name"
              className="form-input"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="s-mpw">
              Partidos por semana
            </label>
            <input
              id="s-mpw"
              className="form-input"
              type="number"
              min={1}
              max={7}
              value={settings.matchesPerWeek}
              onChange={(e) => setSettings({ ...settings, matchesPerWeek: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
          {/* Team A */}
          <div className="card">
            <h2 className="section-title">🔵 Equipo A</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="ta-name">
                Nombre
              </label>
              <input
                id="ta-name"
                className="form-input"
                value={settings.teamA.name}
                onChange={(e) =>
                  setSettings({ ...settings, teamA: { ...settings.teamA, name: e.target.value } })
                }
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="ta-color">
                Color
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <input
                  id="ta-color"
                  type="color"
                  value={settings.teamA.color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      teamA: { ...settings.teamA, color: e.target.value },
                    })
                  }
                  style={{
                    width: 48,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'none',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {settings.teamA.color}
                </span>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="card">
            <h2 className="section-title">🔴 Equipo B</h2>
            <div className="form-group">
              <label className="form-label" htmlFor="tb-name">
                Nombre
              </label>
              <input
                id="tb-name"
                className="form-input"
                value={settings.teamB.name}
                onChange={(e) =>
                  setSettings({ ...settings, teamB: { ...settings.teamB, name: e.target.value } })
                }
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="tb-color">
                Color
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
                <input
                  id="tb-color"
                  type="color"
                  value={settings.teamB.color}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      teamB: { ...settings.teamB, color: e.target.value },
                    })
                  }
                  style={{
                    width: 48,
                    height: 40,
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    cursor: 'pointer',
                    background: 'none',
                  }}
                />
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  {settings.teamB.color}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', padding: 'var(--space-4)' }}
        >
          💾 Guardar cambios
        </button>
      </form>
    </div>
  );
}
