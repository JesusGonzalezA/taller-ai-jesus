import { ArrowLeft, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SocialNetworkForm from '../components/SocialNetworkForm';
import { useCompany } from '../context/CompanyContext';
import type { SocialNetwork } from '../types';

export default function CompanySettings() {
  const { id } = useParams<{ id: string }>();
  const { companies, updateCompany, addNetwork, updateNetwork, removeNetwork } = useCompany();

  const company = companies.find((c) => c.id === id);

  const [fields, setFields] = useState({
    name: '',
    industry: '',
    description: '',
    targetAudience: '',
    briefing: '',
    communicationStyle: '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company) {
      setFields({
        name: company.name,
        industry: company.industry,
        description: company.description,
        targetAudience: company.targetAudience,
        briefing: company.briefing,
        communicationStyle: company.communicationStyle,
      });
    }
  }, [company]);

  if (!id || (!company && companies.length > 0)) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Empresa no encontrada.</p>
        <Link to="/companies" className="text-brand-600 hover:underline mt-3 inline-block text-sm">
          ← Volver a empresas
        </Link>
      </div>
    );
  }

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateCompany(id, fields);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof typeof fields, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddNetwork = async (network: SocialNetwork) => {
    if (!id) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, ...rest } = network;
    await addNetwork(id, rest);
  };

  const handleUpdateNetwork = async (networkId: string, updates: Partial<SocialNetwork>) => {
    if (!id) return;
    await updateNetwork(id, networkId, updates);
  };

  const handleRemoveNetwork = async (networkId: string) => {
    if (!id) return;
    await removeNetwork(id, networkId);
  };

  const isConfigured = fields.name.trim().length > 0 && (company?.socialNetworks.length ?? 0) > 0;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/companies"
            className="inline-flex items-center gap-1 text-sm text-brand-600 hover:text-brand-800 mb-2"
          >
            <ArrowLeft size={14} /> Empresas
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de empresa</h1>
          <p className="text-gray-500 mt-1">
            Define tu marca para que la IA genere contenido alineado
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50"
        >
          <Save size={16} />
          {saved ? '¡Guardado!' : saving ? 'Guardando...' : 'Guardar'}
        </button>
      </div>

      {isConfigured && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-800">
          ✓ Tu empresa está configurada y lista para generar campañas
        </div>
      )}

      {/* Basic info */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Información básica</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la empresa
            </span>
            <input
              type="text"
              value={fields.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Acme Corp"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Industria</span>
            <input
              type="text"
              value={fields.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              placeholder="Tecnología, Retail, Salud..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Descripción</span>
          <textarea
            value={fields.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="¿Qué hace tu empresa? ¿Cuál es su propuesta de valor?"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
          />
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Público objetivo</span>
          <input
            type="text"
            value={fields.targetAudience}
            onChange={(e) => updateField('targetAudience', e.target.value)}
            placeholder="Ej: Emprendedores de 25-45 años interesados en productividad"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </label>
      </section>

      {/* Briefing */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Briefing</h2>
        <p className="text-sm text-gray-500">
          Contexto general de la marca: misión, valores, diferenciadores, qué temas tratar y cuáles
          evitar.
        </p>
        <textarea
          value={fields.briefing}
          onChange={(e) => updateField('briefing', e.target.value)}
          placeholder="Somos una empresa comprometida con... Nuestra misión es... Los temas clave son... Evitamos hablar de..."
          rows={6}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
        />
      </section>

      {/* Communication style */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Estilo de comunicación</h2>
        <p className="text-sm text-gray-500">
          Define el tono general de la marca (puedes ajustar el tono por red social).
        </p>
        <textarea
          value={fields.communicationStyle}
          onChange={(e) => updateField('communicationStyle', e.target.value)}
          placeholder="Cercano pero profesional. Usa 'tú', no 'usted'. Incluir datos cuando sea posible. Humor sutil pero sin excesos."
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
        />
      </section>

      {/* Social networks */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <SocialNetworkForm
          networks={company?.socialNetworks ?? []}
          onAdd={handleAddNetwork}
          onUpdate={handleUpdateNetwork}
          onRemove={handleRemoveNetwork}
        />
      </section>
    </div>
  );
}
