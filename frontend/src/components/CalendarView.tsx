import { useMemo, useState } from 'react';
import type { Platform, Publication } from '../types';
import { PLATFORM_LABELS } from '../types';
import PublicationCard from './PublicationCard';

interface CalendarViewProps {
  publications: Publication[];
  onUpdatePublication: (pubId: string, updates: Partial<Publication>) => void;
  onRegeneratePublication: (pubId: string, feedback: string) => void;
  onReorder: (publications: Publication[]) => void;
  regeneratingIds: Set<string>;
}

type ViewMode = 'timeline' | 'byPlatform';

export default function CalendarView({
  publications,
  onUpdatePublication,
  onRegeneratePublication,
  onReorder,
  regeneratingIds,
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [filterPlatform, setFilterPlatform] = useState<Platform | 'all'>('all');

  const platforms = useMemo(
    () => [...new Set(publications.map((p) => p.platform))],
    [publications],
  );

  const sorted = useMemo(() => {
    let list = [...publications];
    if (filterPlatform !== 'all') {
      list = list.filter((p) => p.platform === filterPlatform);
    }

    if (viewMode === 'timeline') {
      list.sort(
        (a, b) =>
          new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime() ||
          a.order - b.order,
      );
    } else {
      list.sort((a, b) => a.platform.localeCompare(b.platform) || a.order - b.order);
    }

    return list;
  }, [publications, viewMode, filterPlatform]);

  const movePublication = (pubId: string, direction: 'up' | 'down') => {
    const idx = publications.findIndex((p) => p.id === pubId);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= publications.length) return;

    const reordered = [...publications];
    [reordered[idx], reordered[newIdx]] = [reordered[newIdx], reordered[idx]];
    onReorder(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* View mode */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setViewMode('timeline')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'timeline'
                ? 'bg-white shadow text-brand-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cronología
          </button>
          <button
            type="button"
            onClick={() => setViewMode('byPlatform')}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              viewMode === 'byPlatform'
                ? 'bg-white shadow text-brand-700 font-medium'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Por red
          </button>
        </div>

        {/* Platform filter */}
        <select
          value={filterPlatform}
          onChange={(e) => setFilterPlatform(e.target.value as Platform | 'all')}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">Todas las redes ({publications.length})</option>
          {platforms.map((p) => (
            <option key={p} value={p}>
              {PLATFORM_LABELS[p]} ({publications.filter((pub) => pub.platform === p).length})
            </option>
          ))}
        </select>

        <div className="flex-1" />

        <span className="text-sm text-gray-500">
          {sorted.length} publicación{sorted.length !== 1 ? 'es' : ''}
        </span>
      </div>

      {/* Publications list */}
      <div className="space-y-3">
        {sorted.map((pub, idx) => (
          <PublicationCard
            key={pub.id}
            publication={pub}
            onUpdate={(updates) => onUpdatePublication(pub.id, updates)}
            onRegenerate={(feedback) => onRegeneratePublication(pub.id, feedback)}
            onMoveUp={idx > 0 ? () => movePublication(pub.id, 'up') : undefined}
            onMoveDown={idx < sorted.length - 1 ? () => movePublication(pub.id, 'down') : undefined}
            isRegenerating={regeneratingIds.has(pub.id)}
          />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12 text-gray-400">No hay publicaciones que mostrar</div>
      )}
    </div>
  );
}
