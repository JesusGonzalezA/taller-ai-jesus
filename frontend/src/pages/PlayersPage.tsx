import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/client';
import PlayerCard from '../components/PlayerCard';
import type { Player, Position } from '../types';

const POSITIONS: Position[] = ['goalkeeper', 'defender', 'winger', 'forward'];
const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: 'Portero',
  defender: 'Defensa',
  winger: 'Ala',
  forward: 'Delantero',
};

const EMPTY_FORM = { name: '', position: 'forward' as Position };

export default function PlayersPage() {
  const { id } = useParams<{ id: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [editPlayer, setEditPlayer] = useState<Player | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(() => {
    if (!id) return;
    api
      .getPlayers(id)
      .then(setPlayers)
      .catch(() => setError('Error al cargar jugadores'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(load, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !form.name.trim()) return;
    setError('');
    try {
      if (editPlayer) {
        await api.updatePlayer(id, editPlayer.id, form);
      } else {
        await api.addPlayer(id, { name: form.name.trim(), position: form.position });
      }
      setForm(EMPTY_FORM);
      setEditPlayer(null);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  async function handleDelete(player: Player) {
    if (!id || !window.confirm(`¿Eliminar a ${player.name}?`)) return;
    try {
      await api.deletePlayer(id, player.id);
      setPlayers((prev) => prev.filter((p) => p.id !== player.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
    }
  }

  function startEdit(player: Player) {
    setEditPlayer(player);
    setForm({ name: player.name, position: player.position });
    setShowForm(true);
  }

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
        <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
          👥 Jugadores{' '}
          <span
            style={{
              fontSize: 'var(--text-base)',
              color: 'var(--color-text-muted)',
              fontWeight: 400,
            }}
          >
            ({players.length})
          </span>
        </h1>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditPlayer(null);
            setForm(EMPTY_FORM);
          }}
        >
          + Jugador
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
          <h2 className="section-title">{editPlayer ? '✏️ Editar jugador' : '🆕 Nuevo jugador'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="p-name">
                  Nombre
                </label>
                <input
                  id="p-name"
                  className="form-input"
                  placeholder="Cristiano Ronaldo"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="p-pos">
                  Posición
                </label>
                <select
                  id="p-pos"
                  className="form-select"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value as Position })}
                >
                  {POSITIONS.map((pos) => (
                    <option key={pos} value={pos}>
                      {POSITION_LABELS[pos]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button type="submit" className="btn btn-primary">
                {editPlayer ? '💾 Guardar' : '➕ Añadir'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditPlayer(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && <div className="spinner" />}

      {!loading && players.length === 0 && (
        <div className="empty-state">
          <div className="icon">👥</div>
          <h3>Sin jugadores</h3>
          <p>Añade jugadores a la peña para poder crear partidos</p>
        </div>
      )}

      {/* Players grouped by position */}
      {POSITIONS.map((pos) => {
        const group = players.filter((p) => p.position === pos);
        if (group.length === 0) return null;
        return (
          <div key={pos} style={{ marginBottom: 'var(--space-6)' }}>
            <h2
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                color: 'var(--color-text-muted)',
                marginBottom: 'var(--space-3)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {POSITION_LABELS[pos]} ({group.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {group.map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  onEdit={() => startEdit(player)}
                  onDelete={() => handleDelete(player)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
