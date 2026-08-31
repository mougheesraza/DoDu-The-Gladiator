/**
 * Types & Data Models for Creator Social Hub
 */

export type PlatformId = 
  | 'youtube' 
  | 'tiktok' 
  | 'instagram' 
  | 'facebook_page' 
  | 'facebook_profile' 
  | 'twitter';

export type ContentType = 'video' | 'short' | 'reel' | 'post' | 'tweet';

export interface ContentItem {
  id: string;
  platform: PlatformId;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  publishedAt: string; // ISO date string
  type: ContentType;
  views?: string;
  likes?: string;
  comments?: string;
  duration?: string; // e.g. "12:45" for video, "0:59" for short
  featured?: boolean;
  mediaUrl?: string; // Optional embedded media or direct video/image source
  tags?: string[];
  author?: {
    name: string;
    handle?: string;
    avatar?: string;
  };
  isFallback?: boolean;
  fallbackReason?: string;
}

export interface SocialPlatformConfig {
  id: PlatformId;
  name: string;
  handle: string;
  url: string;
  followers: string;
  rawFollowersCount: number;
  description: string;
  brandColor: string; // Tailored color code or hex
  gradient: string;
  badgeText: string;
  iconName: string; // Lucide icon identifier or fallback key
  isActive: boolean;
  category: 'Video' | 'Shorts' | 'Photos & Reels' | 'Community' | 'Social' | 'Microblog';
}

export interface CreatorMetric {
  label: string;
  value: string;
  subtext: string;
  trend?: string;
  icon?: string;
}

export interface CreatorProfile {
  name: string;
  handle: string;
  title: string;
  tagline: string;
  shortBio: string;
  fullBio: string[];
  avatarUrl: string;
  coverImageUrl: string;
  location: string;
  email: string;
  niches: string[];
  metrics: CreatorMetric[];
}

export interface ProviderStatusDetails {
  configured: boolean;
  connected?: boolean;
  status?: string;
  mode: string;
  channelInfo?: {
    title?: string;
    handle?: string;
    avatar?: string;
    subscriberCount?: string;
    videoCount?: string;
  } | null;
  lastSyncAt?: string | null;
  itemCount?: number;
  errorDetails?: string | null;
}

export interface Phase2Status {
  phase: number;
  apiIntegrationsReady: boolean;
  providers: {
    youtube: ProviderStatusDetails;
    tiktok: ProviderStatusDetails;
    instagram: ProviderStatusDetails;
    facebook_page: ProviderStatusDetails;
    facebook_profile: ProviderStatusDetails;
    twitter: ProviderStatusDetails;
    supabase: ProviderStatusDetails;
  };
}
