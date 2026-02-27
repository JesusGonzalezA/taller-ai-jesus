import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Image,
  Loader2,
  RefreshCw,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { generateImage, generateVideo } from '../lib/api';
import type { Publication } from '../types';
import { PLATFORM_COLORS, PLATFORM_LABELS } from '../types';

interface PublicationCardProps {
  publication: Publication;
  onUpdate: (updates: Partial<Publication>) => void;
  onRegenerate: (feedback: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isRegenerating?: boolean;
}

export default function PublicationCard({
  publication,
  onUpdate,
  onRegenerate,
  onMoveUp,
  onMoveDown,
  isRegenerating,
}: PublicationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editCopy, setEditCopy] = useState(publication.copy);
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedImageData, setGeneratedImageData] = useState<{
    base64: string;
    mediaType: string;
  } | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [generatedVideoData, setGeneratedVideoData] = useState<{
    base64: string;
    mediaType: string;
  } | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);

  const date = new Date(publication.scheduledDate).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const handleCopyToClipboard = async () => {
    const text = `${publication.copy}\n\n${publication.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportMarkdown = () => {
    const content = `# ${PLATFORM_LABELS[publication.platform]} – ${date}

## Copy
${publication.copy}

## Hashtags
${publication.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}

## Image Prompt
${publication.imagePrompt}

## Video Prompt
${publication.videoPrompt}
`;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${publication.platform}-${publication.scheduledDate}.md`;
    a.click();
    URL.revokeObjectURL(url);
    onUpdate({ status: 'exported' });
  };

  const handleSaveEdit = () => {
    onUpdate({ copy: editCopy });
    setEditing(false);
  };

  const handleRegenerate = () => {
    if (feedback.trim()) {
      onRegenerate(feedback);
      setFeedback('');
      setShowFeedback(false);
    }
  };

  const handleRefineImagePrompt = async () => {
    setIsGeneratingImage(true);
    setImageError(null);
    try {
      const result = await generateImage(publication.imagePrompt);
      setGeneratedImageData(result);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Error al generar la imagen');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoError(null);
    try {
      const result = await generateVideo(publication.videoPrompt);
      setGeneratedVideoData(result);
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Error al generar el vídeo');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div
      className={`border rounded-xl bg-white shadow-sm transition-shadow hover:shadow-md ${
        publication.status === 'approved' ? 'border-green-300' : 'border-gray-200'
      }`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 p-4">
        {/* Platform badge */}
        <span
          className={`${PLATFORM_COLORS[publication.platform]} text-white text-xs font-bold px-2.5 py-1 rounded-full`}
        >
          {PLATFORM_LABELS[publication.platform]}
        </span>

        <span className="text-sm text-gray-500">{date}</span>

        {publication.status === 'approved' && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            ✓ Aprobado
          </span>
        )}
        {publication.status === 'exported' && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            ↗ Exportado
          </span>
        )}

        <div className="flex-1" />

        {/* Reorder */}
        <div className="flex gap-1">
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Mover arriba"
            >
              <ChevronUp size={16} />
            </button>
          )}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Mover abajo"
            >
              <ChevronDown size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-brand-600 hover:text-brand-800 font-medium"
        >
          {expanded ? 'Cerrar' : 'Ver más'}
        </button>
      </div>

      {/* Copy preview */}
      <div className="px-4 pb-3">
        {editing ? (
          <div className="space-y-2">
            <textarea
              value={editCopy}
              onChange={(e) => setEditCopy(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-3 py-1.5 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditCopy(publication.copy);
                }}
                className="px-3 py-1.5 text-gray-600 text-sm rounded-lg hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="text-sm text-gray-700 line-clamp-3 cursor-pointer text-left w-full"
            onClick={() => setEditing(true)}
            title="Clic para editar"
          >
            {publication.copy}
          </button>
        )}

        {/* Hashtags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {publication.hashtags.slice(0, expanded ? undefined : 5).map((tag) => (
            <span key={tag} className="text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
              {tag.startsWith('#') ? tag : `#${tag}`}
            </span>
          ))}
          {!expanded && publication.hashtags.length > 5 && (
            <span className="text-xs text-gray-400">+{publication.hashtags.length - 5} más</span>
          )}
        </div>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t px-4 py-4 space-y-4">
          {/* Image prompt */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
              <Image size={14} className="inline mr-1" />
              Prompt de imagen
            </h4>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {publication.imagePrompt}
            </p>
            <button
              type="button"
              onClick={handleRefineImagePrompt}
              disabled={isGeneratingImage}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-purple-300 text-purple-700 hover:bg-purple-50 disabled:opacity-50"
            >
              {isGeneratingImage ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Image size={12} />
              )}
              {isGeneratingImage ? 'Generando imagen...' : 'Generar imagen'}
            </button>
            {imageError && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">{imageError}</div>
            )}
            {generatedImageData && (
              <div className="mt-3">
                <img
                  src={`data:${generatedImageData.mediaType};base64,${generatedImageData.base64}`}
                  alt="Imagen generada por IA"
                  className="w-full max-w-lg rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Video prompt */}
          {publication.videoPrompt && (
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                <Video size={14} className="inline mr-1" />
                Prompt de vídeo
              </h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                {publication.videoPrompt}
              </p>
              <button
                type="button"
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
              >
                {isGeneratingVideo ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Video size={12} />
                )}
                {isGeneratingVideo ? 'Generando vídeo...' : 'Generar vídeo'}
              </button>
              {videoError && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {videoError}
                </div>
              )}
              {generatedVideoData && (
                <div className="mt-3">
                  <video
                    src={`data:${generatedVideoData.mediaType};base64,${generatedVideoData.base64}`}
                    controls
                    autoPlay
                    className="w-full max-w-lg rounded-lg shadow-md"
                  >
                    <track kind="captions" />
                    Tu navegador no soporta la reproducción de vídeo.
                  </video>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              {copied ? 'Copiado!' : 'Copiar copy'}
            </button>

            <button
              type="button"
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Download size={14} />
              Exportar
            </button>

            <button
              type="button"
              onClick={() => setShowFeedback(!showFeedback)}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-brand-300 text-brand-700 hover:bg-brand-50 disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRegenerating ? 'animate-spin' : ''} />
              {isRegenerating ? 'Regenerando...' : 'Regenerar'}
            </button>

            {publication.status !== 'approved' && (
              <button
                type="button"
                onClick={() => onUpdate({ status: 'approved' })}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700"
              >
                <Check size={14} />
                Aprobar
              </button>
            )}
          </div>

          {/* Feedback for regeneration */}
          {showFeedback && (
            <div className="space-y-2">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe qué cambios quieres (ej: 'más informal', 'incluir un CTA', 'enfocarlo en el producto X')..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500"
              />
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={!feedback.trim() || isRegenerating}
                className="px-4 py-2 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 disabled:opacity-50"
              >
                Enviar feedback y regenerar
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
