import { Bookmark, Play, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { VideoCategory, VideoItem } from '../types/channel';
import { MediaFrame } from './MediaFrame';

interface VideoCatalogProps {
  videos: VideoItem[];
  savedIds: string[];
  onToggleSave: (videoId: string) => void;
  onSelectVideo: (video: VideoItem) => void;
  onOpenCreatorDrawer: () => void;
}

const CATEGORIES: VideoCategory[] = [
  'Todos',
  'Gameplays',
  'Música y Beats',
  'Retos',
  'Directos',
];

type SortOption = 'recent' | 'views' | 'duration';

export function VideoCatalog({
  videos,
  savedIds,
  onToggleSave,
  onSelectVideo,
  onOpenCreatorDrawer,
}: VideoCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>('Todos');
  const [onlySaved, setOnlySaved] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const filteredVideos = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const list = videos.filter((video) => {
      if (onlySaved && !savedIds.includes(video.id)) return false;
      if (selectedCategory !== 'Todos' && video.category !== selectedCategory) return false;
      if (!query) return true;
      return (
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query) ||
        video.category.toLowerCase().includes(query) ||
        (video.seriesTag ?? '').toLowerCase().includes(query)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'views') return b.views - a.views;
      if (sortBy === 'duration') return b.durationSeconds - a.durationSeconds;
      return new Date(b.publishedIso).getTime() - new Date(a.publishedIso).getTime();
    });
  }, [videos, savedIds, onlySaved, selectedCategory, searchQuery, sortBy]);

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1).replace('.0', '')}K`;
    }
    return String(views);
  };

  const resetFilters = () => {
    setSelectedCategory('Todos');
    setOnlySaved(false);
    setSearchQuery('');
    setSortBy('recent');
  };

  const isDefaultBento =
    selectedCategory === 'Todos' && !onlySaved && searchQuery.trim() === '' && sortBy === 'recent';

  return (
    <section id="videos" className="border-b border-white/10 py-14 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-mono text-zinc-400">Archivo multimedia</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Vídeos del canal
            </h2>
          </div>

          <button
            type="button"
            onClick={onOpenCreatorDrawer}
            className="inline-flex items-center gap-2 self-start md:self-auto rounded-lg border border-white/15 bg-[#12141C] px-4 py-2 text-sm font-medium text-white hover:bg-[#1B1E29] transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
          >
            <Plus className="w-4 h-4 text-[#E11D48]" aria-hidden="true" />
            <span>Añadir o sincronizar YouTube</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-y border-white/10 py-4">
          <div
            className="flex flex-wrap items-center gap-1.5"
            role="tablist"
            aria-label="Filtrar por categoría"
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category && !onlySaved;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setSelectedCategory(category);
                    setOnlySaved(false);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                    active
                      ? 'bg-[#E11D48] text-white'
                      : 'bg-[#12141C] text-zinc-300 hover:text-white hover:bg-[#1B1E29]'
                  }`}
                >
                  {category}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setOnlySaved((prev) => !prev)}
              aria-pressed={onlySaved}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                onlySaved
                  ? 'bg-white text-[#0A0B0D]'
                  : 'bg-[#12141C] text-zinc-300 hover:text-white hover:bg-[#1B1E29]'
              }`}
            >
              Guardados ({savedIds.length})
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <label className="relative flex items-center">
              <Search
                className="w-4 h-4 text-zinc-400 absolute left-3 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar juego, beat o reto..."
                aria-label="Buscar vídeo"
                className="w-full sm:w-64 rounded-lg border border-white/15 bg-[#12141C] pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#E11D48]"
              />
            </label>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              aria-label="Ordenar vídeos"
              className="rounded-lg border border-white/15 bg-[#12141C] px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-[#E11D48] cursor-pointer"
            >
              <option value="recent">Más recientes</option>
              <option value="views">Más vistos</option>
              <option value="duration">Mayor duración</option>
            </select>
          </div>
        </div>

        {filteredVideos.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#12141C] p-12 text-center space-y-4">
            <p className="text-base font-medium text-white">
              No hay vídeos que coincidan con los filtros actuales.
            </p>
            <p className="text-sm text-zinc-400">
              Prueba otra categoría, limpia la búsqueda o añade un enlace directo de YouTube.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center rounded-lg bg-[#E11D48] px-4 py-2 text-sm font-semibold text-white hover:bg-[#BE123C] transition-colors cursor-pointer"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => {
              const isFeaturedBento = isDefaultBento && index === 0;
              const isSaved = savedIds.includes(video.id);

              return (
                <article
                  key={video.id}
                  className={`group flex flex-col justify-between rounded-xl border border-white/10 bg-[#12141C] overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 ${
                    isFeaturedBento ? 'md:col-span-2' : ''
                  }`}
                >
                  <div>
                    <button
                      type="button"
                      onClick={() => onSelectVideo(video)}
                      aria-label={`Ver vídeo: ${video.title}`}
                      className={`relative block w-full overflow-hidden bg-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                        isFeaturedBento ? 'aspect-[16/9] md:aspect-[21/10]' : 'aspect-video'
                      }`}
                    >
                      <MediaFrame
                        src={video.thumbnail}
                        alt={video.title}
                        fallbackTitle={video.title}
                        coverTheme={video.coverTheme}
                        className="w-full h-full"
                        imgClassName="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"
                      />
                      <span className="absolute bottom-3 left-3 font-mono text-xs font-medium text-white bg-black/75 px-2 py-0.5 rounded tabular-nums">
                        {video.duration}
                      </span>
                      <span className="absolute bottom-3 right-3 inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#E11D48] text-white opacity-90 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 fill-current ml-0.5" aria-hidden="true" />
                      </span>
                    </button>

                    <div className="p-5 space-y-2.5">
                      <p className="text-xs text-zinc-400 tabular-nums">
                        {video.category} <span aria-hidden="true">·</span> {formatViews(video.views)}{' '}
                        vistas <span aria-hidden="true">·</span> {video.publishedLabel}
                        {video.youtubeId ? (
                          <>
                            {' '}
                            <span aria-hidden="true">·</span> YouTube
                          </>
                        ) : null}
                      </p>

                      <button
                        type="button"
                        onClick={() => onSelectVideo(video)}
                        className="block text-left cursor-pointer focus-visible:outline-none focus-visible:underline"
                      >
                        <h3
                          className={`font-display font-bold tracking-tight text-white group-hover:text-zinc-200 transition-colors [text-wrap:balance] ${
                            isFeaturedBento ? 'text-2xl sm:text-3xl leading-tight' : 'text-xl leading-snug'
                          }`}
                        >
                          {video.title}
                        </h3>
                      </button>

                      <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 border-t border-white/10 flex items-center justify-between gap-4">
                    <span className="text-xs text-zinc-400 truncate">
                      {video.seriesTag || 'HYM_YT'}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleSave(video.id)}
                      aria-pressed={isSaved}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer py-1 px-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48] ${
                        isSaved ? 'text-[#E11D48]' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`}
                        aria-hidden="true"
                      />
                      <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
