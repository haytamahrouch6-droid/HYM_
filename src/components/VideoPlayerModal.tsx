import { ArrowUpRight, Bookmark, Check, Clock, Play, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CHANNEL_URL } from '../data/channelData';
import type { VideoItem } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  queue: VideoItem[];
  isSaved: boolean;
  onToggleSave: (videoId: string) => void;
  onSelectVideo: (video: VideoItem) => void;
  onClose: () => void;
}

export function VideoPlayerModal({
  video,
  queue,
  isSaved,
  onToggleSave,
  onSelectVideo,
  onClose,
}: VideoPlayerModalProps) {
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setActiveChapterIdx(0);
    setCopied(false);
  }, [video?.id]);

  useEffect(() => {
    if (!video) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [video, onClose]);

  if (!video) return null;

  const formatViews = (views: number) => new Intl.NumberFormat('es-ES').format(views);

  const watchOnYouTubeUrl = video.youtubeId
    ? `https://www.youtube.com/watch?v=${video.youtubeId}`
    : CHANNEL_URL;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(watchOnYouTubeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
    >
      <div className="relative w-full max-w-6xl rounded-2xl border border-white/15 bg-[#0E1016] overflow-hidden my-auto">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
          <p className="text-xs font-mono text-zinc-400 truncate">
            HYM_YT <span aria-hidden="true">·</span> {video.category}{' '}
            <span aria-hidden="true">·</span> {video.seriesTag || 'Emisión del canal'}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar reproductor"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 space-y-5">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black">
              {video.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1`}
                  title={video.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <MediaFrame
                    src={video.thumbnail}
                    alt={video.title}
                    fallbackTitle={video.title}
                    coverTheme={video.coverTheme}
                    className="w-full h-full"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-mono text-zinc-300 tabular-nums">
                        Capítulo activo: {video.chapters[activeChapterIdx]?.time ?? '00:00'}
                      </p>
                      <p className="text-base sm:text-lg font-semibold text-white">
                        {video.chapters[activeChapterIdx]?.label ?? video.title}
                      </p>
                    </div>
                    <a
                      href={watchOnYouTubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-[#E11D48] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#BE123C] transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                      <span>Ver en YouTube</span>
                      <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                    </a>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs font-mono text-zinc-400 tabular-nums">
                  {formatViews(video.views)} visualizaciones <span aria-hidden="true">·</span>{' '}
                  {video.publishedLabel} <span aria-hidden="true">·</span> Duración{' '}
                  {video.duration}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onToggleSave(video.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isSaved
                        ? 'border-[#E11D48] bg-[#E11D48]/15 text-[#E11D48]'
                        : 'border-white/15 text-zinc-200 hover:bg-white/5'
                    }`}
                  >
                    <Bookmark
                      className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`}
                      aria-hidden="true"
                    />
                    <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                    <span>{copied ? 'Copiado' : 'Compartir'}</span>
                  </button>
                </div>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {video.title}
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed">{video.description}</p>
            </div>
          </div>

          <aside className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#12141C] p-6 space-y-6 max-h-[680px] overflow-y-auto">
            {video.chapters.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-mono text-zinc-400">Capítulos del vídeo</h4>
                <div className="space-y-1.5">
                  {video.chapters.map((chapter, idx) => (
                    <button
                      key={`${chapter.time}-${idx}`}
                      type="button"
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs transition-colors cursor-pointer ${
                        activeChapterIdx === idx
                          ? 'bg-[#E11D48]/15 text-white border border-[#E11D48]/40'
                          : 'bg-[#0D0F15] text-zinc-300 border border-white/5 hover:border-white/20'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" aria-hidden="true" />
                      <span className="font-mono text-zinc-400 tabular-nums shrink-0">
                        {chapter.time}
                      </span>
                      <span className="truncate font-medium">{chapter.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3 border-t border-white/10 pt-5">
              <h4 className="text-xs font-mono text-zinc-400">A continuación en HYM_YT</h4>
              <div className="space-y-2.5">
                {queue
                  .filter((item) => item.id !== video.id)
                  .slice(0, 5)
                  .map((nextItem) => (
                    <button
                      key={nextItem.id}
                      type="button"
                      onClick={() => onSelectVideo(nextItem)}
                      className="w-full flex items-center gap-3 rounded-lg border border-white/5 bg-[#0D0F15] p-2 text-left hover:border-white/20 transition-colors cursor-pointer"
                    >
                      <MediaFrame
                        src={nextItem.thumbnail}
                        alt={nextItem.title}
                        coverTheme={nextItem.coverTheme}
                        className="w-24 aspect-video rounded-md shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                          {nextItem.title}
                        </p>
                        <p className="text-[11px] font-mono text-zinc-400 tabular-nums">
                          {nextItem.category} · {nextItem.duration}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
