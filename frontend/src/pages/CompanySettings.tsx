import { Save } from 'lucide-react';
import { useState } from 'react';
import SocialNetworkForm from '../components/SocialNetworkForm';
import { useCompany } from '../context/CompanyContext';

export default function CompanySettings() {
  const { company, updateField, addNetwork, updateNetwork, removeNetwork, isConfigured } =
    useCompany();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Data is auto-persisted via localStorage; this is UX feedback
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración de empresa</h1>
          <p className="text-gray-500 mt-1">
            Define tu marca para que la IA genere contenido alineado
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
        >
          <Save size={16} />
          {saved ? '¡Guardado!' : 'Guardar'}
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
              value={company.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Acme Corp"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Industria</span>
            <input
              type="text"
              value={company.industry}
              onChange={(e) => updateField('industry', e.target.value)}
              placeholder="Tecnología, Retail, Salud..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </label>
        </div>

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">Descripción</span>
          <textarea
            value={company.description}
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
            value={company.targetAudience}
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
          value={company.briefing}
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
          value={company.communicationStyle}
          onChange={(e) => updateField('communicationStyle', e.target.value)}
          placeholder="Cercano pero profesional. Usa 'tú', no 'usted'. Incluir datos cuando sea posible. Humor sutil pero sin excesos."
          rows={4}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-y"
        />
      </section>

      {/* Social networks */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <SocialNetworkForm
          networks={company.socialNetworks}
          onAdd={addNetwork}
          onUpdate={updateNetwork}
          onRemove={removeNetwork}
        />
      </section>
    </div>
  );
}
