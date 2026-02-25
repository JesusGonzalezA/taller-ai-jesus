import { Link, useParams } from 'react-router-dom';

const LINKS = [
  { to: (id: string) => `/pena/${id}`, label: '🏠 Inicio' },
  { to: (id: string) => `/pena/${id}/players`, label: '👥 Jugadores' },
  { to: (id: string) => `/pena/${id}/matches`, label: '⚽ Partidos' },
  { to: (id: string) => `/pena/${id}/stats`, label: '📊 Stats' },
  { to: (id: string) => `/pena/${id}/settings`, label: '⚙️ Ajustes' },
];

export default function Navbar({ penaName }: { penaName?: string }) {
  const { id } = useParams<{ id: string }>();

  return (
    <header
      style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-6)',
          height: '56px',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontWeight: 700,
            fontSize: 'var(--text-lg)',
            color: 'var(--color-accent)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          ⚽ {penaName ?? 'Peñas'}
        </Link>

        {id && (
          <nav style={{ display: 'flex', gap: 'var(--space-1)', overflow: 'auto' }}>
            {LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.to(id)}
                style={{
                  padding: 'var(--space-2) var(--space-3)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-text-muted)',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)';
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-glow)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--color-text-muted)';
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
