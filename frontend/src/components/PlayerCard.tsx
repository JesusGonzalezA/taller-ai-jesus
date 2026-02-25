import type { Player, Position } from '../types';

const POSITION_LABELS: Record<Position, string> = {
  goalkeeper: '🧤 Portero',
  defender: '🛡️ Defensa',
  winger: '💨 Ala',
  forward: '⚡ Delantero',
};

export function PositionBadge({ position }: { position: Position }) {
  return <span className={`pos-${position}`}>{POSITION_LABELS[position]}</span>;
}

export default function PlayerCard({
  player,
  goals = 0,
  assists = 0,
  matchesPlayed = 0,
  teamColor,
  onEdit,
  onDelete,
}: {
  player: Player;
  goals?: number;
  assists?: number;
  matchesPlayed?: number;
  teamColor?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-4)',
        padding: 'var(--space-4)',
        borderLeft: teamColor ? `3px solid ${teamColor}` : undefined,
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: teamColor ?? 'var(--color-surface-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--text-lg)',
          flexShrink: 0,
          border: '2px solid var(--color-border)',
        }}
      >
        {player.name[0]?.toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 'var(--text-sm)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {player.name}
        </div>
        <PositionBadge position={player.position} />
      </div>

      {matchesPlayed > 0 && (
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          <span>⚽ {goals}</span>
          <span>🎯 {assists}</span>
          <span>🏃 {matchesPlayed}</span>
        </div>
      )}

      {(onEdit || onDelete) && (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {onEdit && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onEdit}>
              ✏️
            </button>
          )}
          {onDelete && (
            <button type="button" className="btn btn-danger btn-sm" onClick={onDelete}>
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
}
