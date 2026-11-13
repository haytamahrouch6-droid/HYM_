import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChannelProfileSection } from './components/ChannelProfileSection';
import { CommunitySection } from './components/CommunitySection';
import { CreatorDrawer } from './components/CreatorDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PlaylistsSection } from './components/PlaylistsSection';
import { ShortsSection } from './components/ShortsSection';
import { VideoCatalog } from './components/VideoCatalog';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import {
  CHANNEL_PLAYLISTS,
  DEFAULT_CHANNEL_PROFILE,
  INITIAL_POLL_OPTIONS,
  INITIAL_SHORTS,
  INITIAL_VIDEOS,
} from './data/channelData';
import type {
  ChannelProfile,
  CommunityProposal,
  PollOption,
  VideoItem,
} from './types/channel';

const STORAGE_KEYS = {
  profile: 'hym_yt_profile_v1',
  customVideos: 'hym_yt_custom_videos_v2',
  savedVideos: 'hym_yt_saved_videos_v2',
  likedShorts: 'hym_yt_liked_shorts_v2',
  pollVote: 'hym_yt_poll_vote_v2',
  proposals: 'hym_yt_proposals_v2',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [profile, setProfile] = useState<ChannelProfile>(() =>
    readStorage<ChannelProfile>(STORAGE_KEYS.profile, DEFAULT_CHANNEL_PROFILE)
  );
  const [customVideos, setCustomVideos] = useState<VideoItem[]>(() =>
    readStorage<VideoItem[]>(STORAGE_KEYS.customVideos, [])
  );
  const [syncedVideos, setSyncedVideos] = useState<VideoItem[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.savedVideos, [])
  );
  const [likedShortIds, setLikedShortIds] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.likedShorts, [])
  );
  const [votedOptionId, setVotedOptionId] = useState<string | null>(() =>
    readStorage<string | null>(STORAGE_KEYS.pollVote, null)
  );
  const [proposals, setProposals] = useState<CommunityProposal[]>(() =>
    readStorage<CommunityProposal[]>(STORAGE_KEYS.proposals, [])
  );

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [isCreatorDrawerOpen, setIsCreatorDrawerOpen] = useState(false);

  const allVideos = useMemo(() => {
    const seen = new Set<string>();
    const combined = [...customVideos, ...syncedVideos, ...INITIAL_VIDEOS];
    return combined.filter((item) => {
      const dedupeKey = item.youtubeId ? `yt:${item.youtubeId}` : item.id;
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    });
  }, [customVideos, syncedVideos]);

  const syncYouTubeFeed = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/youtube/feed?handle=${encodeURIComponent(profile.handle || '@hym_yt')}`
      );
      if (!response.ok) {
        return {
          synced: false,
          count: 0,
          message: 'No se pudo consultar el feed público de YouTube.',
        };
      }
      const data = (await response.json()) as {
        synced: boolean;
        message?: string;
        videos?: Array<{
          youtubeId: string;
          title: string;
          publishedAt: string;
          description: string;
          views: number;
          thumbnailUrl: string;
        }>;
      };

      const incoming = (data.videos ?? []).map<VideoItem>((item) => ({
        id: `rss-${item.youtubeId}`,
        youtubeId: item.youtubeId,
        title: item.title,
        category: 'Gameplays',
        duration: 'YouTube',
        durationSeconds: 600,
        views: item.views || 0,
        publishedLabel: new Date(item.publishedAt).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short',
        }),
        publishedIso: item.publishedAt,
        thumbnail: item.thumbnailUrl,
        coverTheme: 'controller',
        description:
          item.description || 'Vídeo publicado en el canal oficial HYM_YT (@hym_yt).',
        seriesTag: `Canal ${profile.handle}`,
        chapters: [{ time: '00:00', label: 'Reproducción completa en YouTube' }],
      }));

      if (incoming.length > 0) {
        setSyncedVideos(incoming);
      }

      return {
        synced: Boolean(data.synced),
        count: incoming.length,
        message:
          data.message ||
          (incoming.length > 0
            ? `Sincronizados ${incoming.length} vídeos desde ${profile.handle}.`
            : 'El canal no tiene vídeos públicos nuevos en RSS.'),
      };
    } catch {
      return {
        synced: false,
        count: 0,
        message: 'Modo catálogo editorial activo.',
      };
    }
  }, [profile.handle]);

  useEffect(() => {
    void syncYouTubeFeed();
  }, [syncYouTubeFeed]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
    } catch {
      // Ignore storage quota errors
    }
  }, [profile]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.customVideos, JSON.stringify(customVideos));
    } catch {
      // Ignore storage quota errors
    }
  }, [customVideos]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.savedVideos, JSON.stringify(savedIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [savedIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.likedShorts, JSON.stringify(likedShortIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [likedShortIds]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.pollVote, JSON.stringify(votedOptionId));
    } catch {
      // Ignore storage quota errors
    }
  }, [votedOptionId]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.proposals, JSON.stringify(proposals));
    } catch {
      // Ignore storage quota errors
    }
  }, [proposals]);

  const pollOptions: PollOption[] = useMemo(() => {
    return INITIAL_POLL_OPTIONS.map((opt) => ({
      ...opt,
      votes: opt.votes + (votedOptionId === opt.id ? 1 : 0),
    }));
  }, [votedOptionId]);

  const handleToggleSave = (videoId: string) => {
    setSavedIds((prev) =>
      prev.includes(videoId) ? prev.filter((id) => id !== videoId) : [...prev, videoId]
    );
  };

  const handleToggleLikeShort = (shortId: string) => {
    setLikedShortIds((prev) =>
      prev.includes(shortId) ? prev.filter((id) => id !== shortId) : [...prev, shortId]
    );
  };

  const handleVote = (optionId: string) => {
    setVotedOptionId((prev) => (prev === optionId ? prev : optionId));
  };

  const handleSubmitProposal = (
    input: Omit<CommunityProposal, 'id' | 'createdAt'>
  ) => {
    const entry: CommunityProposal = {
      ...input,
      id: `prop-${Date.now()}`,
      createdAt: 'Ahora',
    };
    setProposals((prev) => [entry, ...prev]);
  };

  const handleAddVideo = (video: VideoItem) => {
    setCustomVideos((prev) => [video, ...prev]);
  };

  const handleRemoveVideo = (videoId: string) => {
    setCustomVideos((prev) => prev.filter((v) => v.id !== videoId));
  };

  const handlePlayPlaylist = (playlistId: string) => {
    const playlistVideos = allVideos.filter((v) => v.playlistId === playlistId);
    const first = playlistVideos[0] ?? allVideos[0];
    if (first) {
      setActivePlaylistId(playlistId);
      setActiveVideo(first);
    }
  };

  const modalQueue = useMemo(() => {
    if (!activePlaylistId) return allVideos;
    const filtered = allVideos.filter((v) => v.playlistId === activePlaylistId);
    return filtered.length > 0 ? filtered : allVideos;
  }, [allVideos, activePlaylistId]);

  const featuredVideo = allVideos[0];

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F4F5F7]">
      <Header />

      <main>
        <HeroSection
          profile={profile}
          featuredVideo={featuredVideo}
          totalVideos={allVideos.length}
          totalShorts={INITIAL_SHORTS.length}
          onPlayFeatured={(video) => {
            setActivePlaylistId(null);
            setActiveVideo(video);
          }}
        />

        <ChannelProfileSection
          profile={profile}
          totalVideos={allVideos.length}
          totalShorts={INITIAL_SHORTS.length}
          savedCount={savedIds.length}
          onSaveProfile={setProfile}
          onResetProfile={() => setProfile(DEFAULT_CHANNEL_PROFILE)}
        />

        <VideoCatalog
          videos={allVideos}
          savedIds={savedIds}
          onToggleSave={handleToggleSave}
          onSelectVideo={(video) => {
            setActivePlaylistId(null);
            setActiveVideo(video);
          }}
          onOpenCreatorDrawer={() => setIsCreatorDrawerOpen(true)}
        />

        <ShortsSection
          shorts={INITIAL_SHORTS}
          likedShortIds={likedShortIds}
          onToggleLike={handleToggleLikeShort}
        />

        <PlaylistsSection
          playlists={CHANNEL_PLAYLISTS}
          onPlayPlaylist={handlePlayPlaylist}
        />

        <CommunitySection
          pollOptions={pollOptions}
          votedOptionId={votedOptionId}
          onVote={handleVote}
          proposals={proposals}
          onSubmitProposal={handleSubmitProposal}
        />
      </main>

      <Footer />

      <VideoPlayerModal
        video={activeVideo}
        queue={modalQueue}
        isSaved={activeVideo ? savedIds.includes(activeVideo.id) : false}
        onToggleSave={handleToggleSave}
        onSelectVideo={(video) => setActiveVideo(video)}
        onClose={() => {
          setActiveVideo(null);
          setActivePlaylistId(null);
        }}
      />

      <CreatorDrawer
        isOpen={isCreatorDrawerOpen}
        onClose={() => setIsCreatorDrawerOpen(false)}
        videos={allVideos}
        onAddVideo={handleAddVideo}
        onRemoveVideo={handleRemoveVideo}
        onSyncYouTubeFeed={syncYouTubeFeed}
      />
    </div>
  );
}
