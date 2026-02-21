import { ArrowLeft, Download } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CalendarView from '../components/CalendarView';
import { useCampaigns } from '../context/CampaignContext';
import { useCompany } from '../context/CompanyContext';
import { regeneratePublication } from '../lib/api';
import type { Publication } from '../types';

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const { company } = useCompany();
  const { getCampaign, updatePublication, reorderPublications } = useCampaigns();
  const [regeneratingIds, setRegeneratingIds] = useState<Set<string>>(new Set());

  const campaign = getCampaign(id ?? '');

  if (!campaign) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-600">Campaña no encontrada</h2>
        <Link to="/campaigns" className="text-brand-600 hover:underline mt-4 inline-block">
          ← Volver a campañas
        </Link>
      </div>
    );
  }

  const handleRegenerate = async (pubId: string, feedback: string) => {
    const pub = campaign.publications.find((p) => p.id === pubId);
    if (!pub) return;

    setRegeneratingIds((prev) => new Set(prev).add(pubId));
    try {
      const updated = await regeneratePublication(company, pub, feedback);
      updatePublication(campaign.id, pubId, {
        copy: updated.copy,
        imagePrompt: updated.imagePrompt,
        hashtags: updated.hashtags,
      });
    } catch (err) {
      console.error('Regeneration failed:', err);
    } finally {
      setRegeneratingIds((prev) => {
        const next = new Set(prev);
        next.delete(pubId);
        return next;
      });
    }
  };

  const handleExportAll = () => {
    const content = campaign.publications
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .map(
        (pub, i) =>
          `## ${i + 1}. ${pub.platform.toUpperCase()} – ${pub.scheduledDate}

**Copy:**
${pub.copy}

**Hashtags:** ${pub.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

**Image Prompt:** ${pub.imagePrompt}

---`,
      )
      .join('\n\n');

    const full = `# ${campaign.name}

${campaign.summary}

Generada: ${new Date(campaign.createdAt).toLocaleDateString('es-ES')}

---

${content}`;

    const blob = new Blob([full], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign-${campaign.id.slice(0, 8)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpdatePublication = (pubId: string, updates: Partial<Publication>) => {
    updatePublication(campaign.id, pubId, updates);
  };

  const handleReorder = (publications: Publication[]) => {
    reorderPublications(campaign.id, publications);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 mb-2"
          >
            <ArrowLeft size={14} /> Campañas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{campaign.name}</h1>
          <p className="text-gray-500 mt-1">{campaign.summary}</p>
          <p className="text-xs text-gray-400 mt-2">
            Creada: {new Date(campaign.createdAt).toLocaleDateString('es-ES')} ·{' '}
            {campaign.publications.length} publicaciones
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAll}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
        >
          <Download size={16} /> Exportar todo
        </button>
      </div>

      {/* Calendar view */}
      <CalendarView
        publications={campaign.publications}
        onUpdatePublication={handleUpdatePublication}
        onRegeneratePublication={handleRegenerate}
        onReorder={handleReorder}
        regeneratingIds={regeneratingIds}
      />
    </div>
  );
}
