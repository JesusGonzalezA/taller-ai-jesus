import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCampaigns } from '../context/CampaignContext';
import { PLATFORM_LABELS, type Platform } from '../types';

export default function CampaignList() {
  const { campaigns, removeCampaign } = useCampaigns();

  if (campaigns.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
        <div className="text-center py-16">
          <CalendarDays className="mx-auto text-gray-300 mb-4" size={48} />
          <h2 className="text-xl font-semibold text-gray-600">No hay campañas todavía</h2>
          <p className="text-gray-400 mt-2">Crea tu primera campaña de marketing con IA</p>
          <Link
            to="/campaigns/new"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700"
          >
            <Plus size={18} /> Nueva campaña
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Campañas</h1>
        <Link
          to="/campaigns/new"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700"
        >
          <Plus size={16} /> Nueva campaña
        </Link>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => {
          const platformCounts = campaign.publications.reduce(
            (acc, p) => {
              acc[p.platform] = (acc[p.platform] || 0) + 1;
              return acc;
            },
            {} as Record<Platform, number>,
          );

          const approved = campaign.publications.filter((p) => p.status === 'approved').length;

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <Link to={`/campaigns/${campaign.id}`} className="flex-1 block">
                  <h3 className="font-semibold text-gray-900 text-lg">{campaign.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{campaign.summary}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(platformCounts).map(([platform, count]) => (
                      <span
                        key={platform}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {PLATFORM_LABELS[platform as Platform]}: {count}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                    <span>{campaign.publications.length} publicaciones</span>
                    <span>{approved} aprobadas</span>
                    <span>{new Date(campaign.createdAt).toLocaleDateString('es-ES')}</span>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => removeCampaign(campaign.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors ml-4"
                  title="Eliminar campaña"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
