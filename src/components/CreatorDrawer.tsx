import { RefreshCw, Trash2, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { VideoCategory, VideoItem } from '../types/channel';

interface CreatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  videos: VideoItem[];
  onAddVideo: (video: VideoItem) => void;
  onRemoveVideo: (videoId: string) => void;
  onSyncYouTubeFeed: () => Promise<{ synced: boolean; count: number; message: string }>;
}

const ASSIGNABLE_CATEGORIES: Exclude<VideoCategory, 'Todos'>[] = [
  'Gameplays',
  'Música y Beats',
  'Retos',
  'Directos',
];

export function CreatorDrawer({
  isOpen,
  onClose,
  videos,
  onAddVideo,
  onRemoveVideo,
  onSyncYouTubeFeed,
}: CreatorDrawerProps) {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState<Exclude<VideoCategory, 'Todos'>>('Gameplays');
  const [customDescription, setCustomDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'info' | 'error';
    text: string;
  } | null>(null);

  if (!isOpen) return null;

  const customVideos = videos.filter((v) => v.isCustom);

  const handleResolveAndAdd = async (e: FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!youtubeUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Pega un enlace de vídeo o Short de YouTube.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `/api/youtube/resolve?url=${encodeURIComponent(youtubeUrl.trim())}`
      );
      const data = await response.json();

      if (!response.ok || !data.youtubeId) {
        setStatusMessage({
          type: 'error',
          text: data.error || 'No se pudo reconocer el enlace de YouTube.',
        });
        return;
      }

      const newVideo: VideoItem = {
        id: `yt-${data.youtubeId}-${Date.now()}`,
        youtubeId: data.youtubeId,
        title: data.title,
        category,
        duration: data.isShort ? '0:58' : '12:00',
        durationSeconds: data.isShort ? 58 : 720,
        views: 1,
        publishedLabel: 'Recién añadido',
        publishedIso: new Date().toISOString(),
        thumbnail: data.thumbnailUrl,
        coverTheme: category === 'Música y Beats' ? 'waveform' : 'controller',
        description:
          customDescription.trim() ||
          `Vídeo añadido directamente desde YouTube (${data.authorName || 'HYM_YT'}).`,
        seriesTag: data.isShort ? 'YouTube Short' : 'Estreno YouTube',
        chapters: [{ time: '00:00', label: 'Inicio del vídeo' }],
        isCustom: true,
      };

      onAddVideo(newVideo);
      setYoutubeUrl('');
      setCustomDescription('');
      setStatusMessage({
        type: 'success',
        text: `Añadido "${data.title}" al catálogo del canal.`,
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error de conexión al resolver el enlace de YouTube.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setStatusMessage(null);
    try {
      const result = await onSyncYouTubeFeed();
      setStatusMessage({
        type: result.synced && result.count > 0 ? 'success' : 'info',
        text: result.message,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Gestor de vídeos del canal HYM_YT"
    >
      <div className="w-full max-w-lg bg-[#0E1016] border-l border-white/15 h-full overflow-y-auto p-6 sm:p-8 flex flex-col gap-8">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <p className="text-xs font-mono text-zinc-400">Panel del creador</p>
            <h3 className="font-display text-2xl font-bold text-white">
              Sincronizar y añadir vídeos
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-[#12141C] p-5 space-y-3">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">
              Sincronizar feed público de @hym_yt
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consulta el RSS oficial de YouTube de @hym_yt para importar automáticamente tus
              últimos vídeos públicos.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-[#0A0B0D] px-4 py-2 text-xs font-semibold text-white hover:bg-white/5 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar @hym_yt ahora'}</span>
          </button>
        </div>

        <form onSubmit={handleResolveAndAdd} className="space-y-4">
          <h4 className="text-sm font-semibold text-white">Añadir enlace de YouTube manualmente</h4>

          <div className="space-y-1.5">
            <label htmlFor="yt-url-input" className="block text-xs font-medium text-zinc-300">
              URL del vídeo o Short de YouTube
            </label>
            <input
              id="yt-url-input"
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o youtu.be/..."
              className="w-full rounded-lg border border-white/15 bg-[#12141C] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="yt-cat-select" className="block text-xs font-medium text-zinc-300">
              Categoría en la app
            </label>
            <select
              id="yt-cat-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as Exclude<VideoCategory, 'Todos'>)
              }
              className="w-full rounded-lg border border-white/15 bg-[#12141C] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#E11D48]"
            >
              {ASSIGNABLE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="yt-desc-input" className="block text-xs font-medium text-zinc-300">
              Nota o descripción breve (opcional)
            </label>
            <textarea
              id="yt-desc-input"
              rows={2}
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="Detalles del gameplay, beat o reto..."
              className="w-full rounded-lg border border-white/15 bg-[#12141C] px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
            />
          </div>

          {statusMessage && (
            <p
              role="status"
              className={`text-xs font-medium ${
                statusMessage.type === 'error'
                  ? 'text-rose-400'
                  : statusMessage.type === 'success'
                    ? 'text-emerald-400'
                    : 'text-zinc-300'
              }`}
            >
              {statusMessage.text}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#E11D48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Resolviendo enlace...' : 'Añadir vídeo al catálogo'}
          </button>
        </form>

        {customVideos.length > 0 && (
          <div className="border-t border-white/10 pt-5 space-y-3">
            <h4 className="text-xs font-mono text-zinc-400">
              Vídeos añadidos ({customVideos.length})
            </h4>
            <ul className="space-y-2">
              {customVideos.map((vid) => (
                <li
                  key={vid.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#12141C] px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{vid.title}</p>
                    <p className="text-[11px] font-mono text-zinc-400">{vid.category}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveVideo(vid.id)}
                    aria-label={`Eliminar ${vid.title}`}
                    className="p-1.5 text-zinc-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
