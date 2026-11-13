import { ArrowUpRight, Play } from 'lucide-react';
import type { ChannelProfile, VideoItem } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface HeroSectionProps {
  profile: ChannelProfile;
  featuredVideo: VideoItem;
  totalVideos: number;
  totalShorts: number;
  onPlayFeatured: (video: VideoItem) => void;
}

export function HeroSection({
  profile,
  featuredVideo,
  totalVideos,
  totalShorts,
  onPlayFeatured,
}: HeroSectionProps) {
  const formatViews = (views: number) =>
    new Intl.NumberFormat('es-ES').format(views);

  return (
    <section id="inicio" className="border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-12 lg:pt-14 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-stretch">
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            <div className="space-y-5">
              <p className="text-sm font-medium tracking-wide text-zinc-400">
                Gaming, Música y Directos <span aria-hidden="true">·</span> {profile.handle}
              </p>

              <h1 className="font-display text-[clamp(2.65rem,4.5vw,4.25rem)] font-bold leading-[0.96] tracking-tight text-white [text-wrap:balance]">
                Beats, gameplays y retos al límite
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-zinc-300">
                {profile.tagline}. Todo el catálogo de {profile.name} reunido en una sola web:
                vídeos largos, Shorts verticales, listas y encuestas de la comunidad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="button"
                onClick={() => onPlayFeatured(featuredVideo)}
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#E11D48] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#BE123C] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0B0D]"
              >
                <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                <span>Ver último estreno</span>
              </button>

              <a
                href="#perfil"
                className="inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-zinc-200 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
              >
                <span>Ver perfil del canal</span>
              </a>

              <a
                href={profile.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition-colors duration-150 whitespace-nowrap shrink-0 underline-offset-4 hover:underline"
              >
                <span>Abrir YouTube</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex">
            <button
              type="button"
              onClick={() => onPlayFeatured(featuredVideo)}
              aria-label={`Reproducir estreno destacado: ${featuredVideo.title}`}
              className="group relative w-full min-h-[340px] lg:h-full rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-[#0F1726] via-[#10121A] to-[#1C1216] p-6 sm:p-8 flex flex-col items-center justify-between text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
            >
              <div className="w-full flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Canal oficial · {profile.handle}</span>
                <span className="tabular-nums">{featuredVideo.duration}</span>
              </div>

              <div className="my-5 flex flex-col items-center gap-3">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-white/15 bg-[#0A0B0D] transition-transform duration-300 group-hover:scale-[1.03]">
                  <MediaFrame
                    src={profile.avatarUrl}
                    alt={`Logotipo de ${profile.name}`}
                    fallbackTitle={profile.name}
                    coverTheme="controller"
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="w-full flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                <div className="space-y-1 max-w-md">
                  <p className="text-xs font-mono text-zinc-400 tabular-nums">
                    Estreno destacado <span aria-hidden="true">·</span>{' '}
                    {formatViews(featuredVideo.views)} vistas
                  </p>
                  <p className="font-display text-xl sm:text-2xl font-bold leading-tight text-white [text-wrap:balance]">
                    {featuredVideo.title}
                  </p>
                </div>

                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#E11D48] text-white shrink-0 transition-transform duration-150 group-hover:scale-105">
                  <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
                </span>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-6 border-t border-white/10 pt-8">
          <div className="space-y-1">
            <p className="text-xs font-mono text-zinc-400">01 · Catálogo activo</p>
            <p className="text-lg font-semibold text-white tabular-nums">
              {totalVideos} vídeos y {totalShorts} Shorts
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-zinc-400">02 · Calendario semanal</p>
            <p className="text-lg font-semibold text-white">{profile.schedule}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-zinc-400">03 · Formatos</p>
            <p className="text-lg font-semibold text-white">
              Gameplays, Beats y Retos
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-zinc-400">04 · Emisión oficial</p>
            <p className="text-lg font-semibold text-white">
              youtube.com/{profile.handle}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
