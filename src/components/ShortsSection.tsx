import { ChevronLeft, ChevronRight, Heart, Play, Share2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CHANNEL_URL } from '../data/channelData';
import type { ShortItem } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface ShortsSectionProps {
  shorts: ShortItem[];
  likedShortIds: string[];
  onToggleLike: (shortId: string) => void;
}

export function ShortsSection({ shorts, likedShortIds, onToggleLike }: ShortsSectionProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeShort = activeIndex !== null ? shorts[activeIndex] ?? null : null;

  useEffect(() => {
    if (activeIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveIndex(null);
      if (e.key === 'ArrowRight' && activeIndex < shorts.length - 1) {
        setActiveIndex((i) => (i !== null ? i + 1 : null));
      }
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((i) => (i !== null ? i - 1 : null));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, shorts.length]);

  const formatCompact = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1).replace('.0', '')}K`;
    }
    return String(num);
  };

  const handleCopyShare = async (short: ShortItem) => {
    const shareUrl = short.youtubeId
      ? `https://www.youtube.com/shorts/${short.youtubeId}`
      : CHANNEL_URL;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedId(short.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setCopiedId(short.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="shorts" className="border-b border-white/10 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-zinc-400">Formato vertical</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              HYM_YT Shorts
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Drops sincronizados con jugadas imposibles, líneas de bajo ocultas y momentos
            rápidos en menos de un minuto.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {shorts.map((short, index) => (
            <button
              key={short.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Abrir Short: ${short.title}`}
              className="group relative aspect-[9/16] rounded-xl overflow-hidden border border-white/10 bg-[#12141C] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
            >
              <MediaFrame
                src={short.thumbnail}
                alt={short.title}
                fallbackTitle={short.title}
                coverTheme={short.coverTheme}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent"
              />

              <span className="absolute top-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-black/60 text-white border border-white/15 group-hover:bg-[#E11D48] group-hover:border-[#E11D48] transition-colors">
                <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-4 space-y-1.5">
                <p className="text-xs font-mono text-zinc-300 tabular-nums">
                  {short.duration} <span aria-hidden="true">·</span> {formatCompact(short.views)}{' '}
                  vistas
                </p>
                <h3 className="font-display text-lg sm:text-xl font-bold leading-snug text-white line-clamp-2">
                  {short.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeShort && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={activeShort.title}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Cerrar reproductor de Shorts"
            className="absolute top-5 right-5 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 max-w-2xl w-full justify-center">
            <button
              type="button"
              onClick={() => setActiveIndex((i) => (i !== null && i > 0 ? i - 1 : i))}
              disabled={activeIndex === 0}
              aria-label="Short anterior"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 bg-[#12141C] text-white disabled:opacity-30 hover:bg-[#1B1E29] cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-[360px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/15 bg-[#12141C]">
              {activeShort.youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeShort.youtubeId}?autoplay=1`}
                  title={activeShort.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <MediaFrame
                    src={activeShort.thumbnail}
                    alt={activeShort.title}
                    fallbackTitle={activeShort.title}
                    coverTheme={activeShort.coverTheme}
                    className="w-full h-full"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/30"
                  />
                </>
              )}

              <div className="absolute inset-x-0 bottom-0 p-5 space-y-3 pointer-events-auto">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-zinc-300 tabular-nums">
                    @hym_yt <span aria-hidden="true">·</span> {activeShort.publishedLabel}{' '}
                    <span aria-hidden="true">·</span> {activeShort.duration}
                  </p>
                  <h3 className="font-display text-2xl font-bold leading-tight text-white">
                    {activeShort.title}
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">{activeShort.caption}</p>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2 border-t border-white/15">
                  <button
                    type="button"
                    onClick={() => onToggleLike(activeShort.id)}
                    aria-pressed={likedShortIds.includes(activeShort.id)}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer tabular-nums ${
                      likedShortIds.includes(activeShort.id)
                        ? 'bg-[#E11D48] text-white'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        likedShortIds.includes(activeShort.id) ? 'fill-current' : ''
                      }`}
                      aria-hidden="true"
                    />
                    <span>
                      {formatCompact(
                        activeShort.likes + (likedShortIds.includes(activeShort.id) ? 1 : 0)
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyShare(activeShort)}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" aria-hidden="true" />
                    <span>{copiedId === activeShort.id ? 'Enlace copiado' : 'Compartir'}</span>
                  </button>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((i) => (i !== null && i < shorts.length - 1 ? i + 1 : i))
              }
              disabled={activeIndex === shorts.length - 1}
              aria-label="Siguiente Short"
              className="hidden sm:inline-flex items-center justify-center w-11 h-11 rounded-full border border-white/15 bg-[#12141C] text-white disabled:opacity-30 hover:bg-[#1B1E29] cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
