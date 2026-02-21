import { Building2, CalendarDays, LayoutDashboard, Plus } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/company', label: 'Empresa', icon: Building2 },
  { to: '/campaigns', label: 'Campañas', icon: CalendarDays },
  { to: '/campaigns/new', label: 'Nueva campaña', icon: Plus },
];

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-brand-950 text-white flex flex-col">
        <div className="p-6">
          <p className="text-xl font-bold tracking-tight">🚀 MarketingAI</p>
          <p className="text-brand-300 text-xs mt-1">Plataforma de marketing inteligente</p>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-700 text-white'
                    : 'text-brand-200 hover:bg-brand-900 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 text-brand-400 text-xs">Powered by Vercel AI Gateway</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
