import { Building2, CalendarDays, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { useCompany } from '../context/CompanyContext';

export default function Dashboard() {
  const { activeCompany, isConfigured } = useCompany();
  const { campaigns } = useCampaigns();

  const totalPubs = campaigns.reduce((sum, c) => sum + c.publications.length, 0);
  const approvedPubs = campaigns.reduce(
    (sum, c) => sum + c.publications.filter((p) => p.status === 'approved').length,
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          {isConfigured
            ? `Bienvenido de vuelta, ${activeCompany?.name}`
            : 'Configura tu empresa para empezar'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-100 rounded-lg">
              <CalendarDays className="text-brand-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
              <p className="text-sm text-gray-500">Campañas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPubs}</p>
              <p className="text-sm text-gray-500">Publicaciones generadas</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{approvedPubs}</p>
              <p className="text-sm text-gray-500">Publicaciones aprobadas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isConfigured && (
          <Link
            to="/company"
            className="block bg-white rounded-xl border-2 border-dashed border-brand-300 p-6 hover:border-brand-500 hover:bg-brand-50/50 transition-colors"
          >
            <Building2 className="text-brand-500 mb-3" size={28} />
            <h3 className="font-semibold text-gray-900">Configura tu empresa</h3>
            <p className="text-sm text-gray-500 mt-1">
              Define tu marca, briefing y redes sociales para empezar a generar campañas
            </p>
          </Link>
        )}

        <Link
          to="/campaigns/new"
          className="block bg-white rounded-xl border-2 border-dashed border-green-300 p-6 hover:border-green-500 hover:bg-green-50/50 transition-colors"
        >
          <Plus className="text-green-500 mb-3" size={28} />
          <h3 className="font-semibold text-gray-900">Nueva campaña</h3>
          <p className="text-sm text-gray-500 mt-1">
            Sube un transcript o contenido y genera una estrategia de marketing completa
          </p>
        </Link>

        {campaigns.length > 0 && (
          <Link
            to="/campaigns"
            className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <CalendarDays className="text-brand-500 mb-3" size={28} />
            <h3 className="font-semibold text-gray-900">Ver campañas</h3>
            <p className="text-sm text-gray-500 mt-1">
              Revisa, edita y exporta tus campañas generadas
            </p>
          </Link>
        )}
      </div>

      {/* Recent campaigns */}
      {campaigns.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Campañas recientes</h2>
          <div className="space-y-2">
            {campaigns.slice(0, 5).map((campaign) => (
              <Link
                key={campaign.id}
                to={`/campaigns/${campaign.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{campaign.summary}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-brand-600">
                      {campaign.publications.length} publicaciones
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(campaign.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
