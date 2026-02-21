import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../components/FileUploader';
import { useCampaigns } from '../context/CampaignContext';
import { useCompany } from '../context/CompanyContext';
import { generateCampaign } from '../lib/api';

export default function CampaignNew() {
  const navigate = useNavigate();
  const { company, isConfigured } = useCompany();
  const { addCampaign } = useCampaigns();

  const [sourceContent, setSourceContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!sourceContent.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const campaign = await generateCampaign(company, sourceContent);
      addCampaign(campaign);
      navigate(`/campaigns/${campaign.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al generar la campaña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Nueva campaña</h1>
        <p className="text-gray-500 mt-1">
          Sube un transcript, notas o cualquier texto y la IA generará una estrategia de marketing
          completa
        </p>
      </div>

      {!isConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          ⚠️ Configura primero tu empresa y al menos una red social en{' '}
          <a href="/company" className="underline font-medium">
            Configuración de empresa
          </a>{' '}
          para obtener mejores resultados.
        </div>
      )}

      {/* Company summary */}
      {isConfigured && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-brand-900 mb-1">
            Generando para: {company.name}
          </h3>
          <p className="text-sm text-brand-700">
            {company.socialNetworks.length} red{company.socialNetworks.length !== 1 ? 'es' : ''}{' '}
            configurada{company.socialNetworks.length !== 1 ? 's' : ''}:{' '}
            {company.socialNetworks.map((n) => n.platform).join(', ')}
          </p>
        </div>
      )}

      {/* Source content input */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Contenido fuente</h2>
        <p className="text-sm text-gray-500">
          Sube un transcript de Teams, notas de reunión, un briefing de campaña o cualquier
          contenido a partir del cual quieras generar la estrategia.
        </p>
        <FileUploader
          value={sourceContent}
          onChange={setSourceContent}
          placeholder="Pega aquí el transcript de tu reunión, briefing, notas..."
        />
      </section>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          ❌ {error}
        </div>
      )}

      {/* Generate button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={loading || !sourceContent.trim()}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 text-white text-lg font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            Generando campaña... esto puede tardar un momento
          </>
        ) : (
          <>
            <Sparkles size={22} />
            Generar campaña de marketing
          </>
        )}
      </button>
    </div>
  );
}
