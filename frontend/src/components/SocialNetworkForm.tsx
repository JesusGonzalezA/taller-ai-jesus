import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { Platform, SocialNetwork } from '../types';
import { PLATFORM_LABELS } from '../types';

interface SocialNetworkFormProps {
  networks: SocialNetwork[];
  onAdd: (network: SocialNetwork) => void;
  onUpdate: (id: string, updates: Partial<SocialNetwork>) => void;
  onRemove: (id: string) => void;
}

const PLATFORMS: Platform[] = ['instagram', 'twitter', 'linkedin', 'facebook', 'tiktok', 'youtube'];

export default function SocialNetworkForm({
  networks,
  onAdd,
  onUpdate,
  onRemove,
}: SocialNetworkFormProps) {
  const [adding, setAdding] = useState(false);
  const [newNetwork, setNewNetwork] = useState<Partial<SocialNetwork>>({
    platform: 'instagram',
    handle: '',
    style: '',
    audience: '',
    postFrequency: '3 posts/week',
  });

  const handleAdd = () => {
    if (!newNetwork.handle?.trim()) return;
    onAdd({
      id: crypto.randomUUID(),
      platform: newNetwork.platform as Platform,
      handle: newNetwork.handle ?? '',
      style: newNetwork.style ?? '',
      audience: newNetwork.audience ?? '',
      postFrequency: newNetwork.postFrequency ?? '3 posts/week',
    });
    setNewNetwork({
      platform: 'instagram',
      handle: '',
      style: '',
      audience: '',
      postFrequency: '3 posts/week',
    });
    setAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Redes sociales</h3>
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700"
        >
          <Plus size={16} /> Añadir red
        </button>
      </div>

      {/* Existing networks */}
      {networks.map((network) => (
        <div key={network.id} className="border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">
              {PLATFORM_LABELS[network.platform]} – @{network.handle}
            </span>
            <button
              type="button"
              onClick={() => onRemove(network.id)}
              className="text-red-400 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Estilo / tono</span>
              <input
                type="text"
                value={network.style}
                onChange={(e) => onUpdate(network.id, { style: e.target.value })}
                placeholder="Ej: informal, visual, con emojis"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Audiencia</span>
              <input
                type="text"
                value={network.audience}
                onChange={(e) => onUpdate(network.id, { audience: e.target.value })}
                placeholder="Ej: jóvenes 18-25, profesionales tech"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Frecuencia</span>
              <input
                type="text"
                value={network.postFrequency}
                onChange={(e) => onUpdate(network.id, { postFrequency: e.target.value })}
                placeholder="Ej: 3 posts/week"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
          </div>
        </div>
      ))}

      {/* Add new form */}
      {adding && (
        <div className="border-2 border-dashed border-brand-300 rounded-xl p-4 space-y-3 bg-brand-50/50">
          <h4 className="font-medium text-gray-900">Nueva red social</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Plataforma</span>
              <select
                value={newNetwork.platform}
                onChange={(e) =>
                  setNewNetwork({ ...newNetwork, platform: e.target.value as Platform })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {PLATFORM_LABELS[p]}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Handle</span>
              <input
                type="text"
                value={newNetwork.handle}
                onChange={(e) => setNewNetwork({ ...newNetwork, handle: e.target.value })}
                placeholder="@tu-cuenta"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Estilo</span>
              <input
                type="text"
                value={newNetwork.style}
                onChange={(e) => setNewNetwork({ ...newNetwork, style: e.target.value })}
                placeholder="Ej: profesional, educativo"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Audiencia</span>
              <input
                type="text"
                value={newNetwork.audience}
                onChange={(e) => setNewNetwork({ ...newNetwork, audience: e.target.value })}
                placeholder="Ej: emprendedores, mamás"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-gray-500 mb-1">Frecuencia</span>
              <input
                type="text"
                value={newNetwork.postFrequency}
                onChange={(e) => setNewNetwork({ ...newNetwork, postFrequency: e.target.value })}
                placeholder="Ej: 5 posts/week"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
            </label>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!newNetwork.handle?.trim()}
              className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 disabled:opacity-50"
            >
              Añadir
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="px-4 py-2 text-gray-600 text-sm rounded-lg hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {networks.length === 0 && !adding && (
        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-xl">
          Aún no has configurado redes sociales, ¡añade al menos una!
        </div>
      )}
    </div>
  );
}
