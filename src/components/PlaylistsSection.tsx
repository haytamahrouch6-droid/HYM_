import { Play } from 'lucide-react';
import type { PlaylistItem } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface PlaylistsSectionProps {
  playlists: PlaylistItem[];
  onPlayPlaylist: (playlistId: string) => void;
}

export function PlaylistsSection({ playlists, onPlayPlaylist }: PlaylistsSectionProps) {
  return (
    <section id="listas" className="border-b border-white/10 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-zinc-400">Series del canal</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Listas de reproducción
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-md">
            Colecciones ordenadas por formato para escuchar sesiones seguidas o maratonear retos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <article
              key={playlist.id}
              className="group flex flex-col justify-between rounded-xl border border-white/10 bg-[#12141C] overflow-hidden"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-black">
                  <MediaFrame
                    src={playlist.coverImage}
                    alt={playlist.title}
                    fallbackTitle={playlist.title}
                    coverTheme={playlist.coverTheme}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                  />
                  <p className="absolute bottom-3 left-4 font-mono text-xs text-zinc-200 tabular-nums">
                    {playlist.indexLabel} <span aria-hidden="true">·</span> {playlist.episodeCount}{' '}
                    episodios <span aria-hidden="true">·</span> {playlist.totalDuration}
                  </p>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="font-display text-2xl font-bold tracking-tight text-white">
                    {playlist.indexLabel}. {playlist.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{playlist.subtitle}</p>
                </div>
              </div>

              <div className="px-5 py-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => onPlayPlaylist(playlist.id)}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#E11D48] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Play className="w-4 h-4 fill-current text-[#E11D48]" aria-hidden="true" />
                  <span>Reproducir serie completa</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
