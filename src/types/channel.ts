export type VideoCategory = 'Todos' | 'Gameplays' | 'Música y Beats' | 'Retos' | 'Directos';

export type CoverTheme =
  | 'controller'
  | 'waveform'
  | 'arena'
  | 'studio'
  | 'remix'
  | 'arcade';

export interface VideoChapter {
  time: string;
  label: string;
}

export interface VideoItem {
  id: string;
  youtubeId?: string;
  title: string;
  category: Exclude<VideoCategory, 'Todos'>;
  duration: string;
  durationSeconds: number;
  views: number;
  publishedLabel: string;
  publishedIso: string;
  thumbnail: string;
  coverTheme?: CoverTheme;
  description: string;
  playlistId?: string;
  seriesTag?: string;
  chapters: VideoChapter[];
  isCustom?: boolean;
}

export interface ShortItem {
  id: string;
  youtubeId?: string;
  title: string;
  duration: string;
  views: number;
  likes: number;
  thumbnail: string;
  coverTheme?: CoverTheme;
  caption: string;
  publishedLabel: string;
}

export interface PlaylistItem {
  id: string;
  indexLabel: string;
  title: string;
  subtitle: string;
  episodeCount: number;
  totalDuration: string;
  coverImage: string;
  coverTheme: CoverTheme;
}

export interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export interface CommunityProposal {
  id: string;
  author: string;
  topic: string;
  referenceUrl?: string;
  createdAt: string;
}

export interface ChannelProfile {
  name: string;
  handle: string;
  creatorName: string;
  tagline: string;
  bio: string;
  schedule: string;
  language: string;
  avatarUrl: string;
  youtubeUrl: string;
  discordUrl: string;
  tiktokUrl: string;
  twitchUrl: string;
}

