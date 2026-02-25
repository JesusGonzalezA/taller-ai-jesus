import { Building2, CalendarDays, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/companies', label: 'Empresas', icon: Building2 },
  { to: '/campaigns', label: 'Campañas', icon: CalendarDays },
  { to: '/campaigns/new', label: 'Nueva campaña', icon: Plus },
];

export default function Layout() {
  const { signOut, user } = useAuth();
  const { activeCompany } = useCompany();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-brand-950 text-white flex flex-col">
        <div className="p-6">
          <p className="text-xl font-bold tracking-tight">🚀 MarketingAI</p>
          <p className="text-brand-300 text-xs mt-1">Plataforma de marketing inteligente</p>
        </div>

        {/* Active company badge */}
        {activeCompany && (
          <div className="mx-3 mb-3 px-3 py-2 bg-brand-900 rounded-lg">
            <p className="text-brand-400 text-xs">Empresa activa</p>
            <p className="text-white text-sm font-medium truncate">{activeCompany.name}</p>
          </div>
        )}

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

        <div className="p-4 border-t border-brand-800 space-y-3">
          <p className="text-brand-400 text-xs truncate">{user?.email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-brand-300 hover:text-white hover:bg-brand-900 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
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
