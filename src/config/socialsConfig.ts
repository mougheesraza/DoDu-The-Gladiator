import { SocialPlatformConfig } from '../types/social.js';

/**
 * Centralized Social Media Platform Configuration
 * Central point for editing platform links, handles, follower counters, and visual theme configurations.
 */
export const socialsConfig: SocialPlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    handle: '@doduthegladiator',
    url: 'https://www.youtube.com/@doduthegladiator',
    followers: '485K Subscribers',
    rawFollowersCount: 485000,
    description: 'Long-form tech deep dives, workspace setups, gear reviews, and full video essays.',
    brandColor: '#FF0000',
    gradient: 'from-red-600/20 via-red-900/10 to-transparent',
    badgeText: 'Long-form & Shorts',
    iconName: 'Youtube',
    isActive: true,
    category: 'Video'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@doduthegladiator',
    url: 'https://www.tiktok.com/@doduthegladiator',
    followers: '320K Followers',
    rawFollowersCount: 320000,
    description: 'Quick tech hacks, bite-sized software tricks, desk aesthetics, and daily creative logs.',
    brandColor: '#00F2FE',
    gradient: 'from-cyan-500/20 via-fuchsia-600/10 to-transparent',
    badgeText: 'Viral Shorts',
    iconName: 'Video',
    isActive: true,
    category: 'Shorts'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@doduthegladdiator',
    url: 'https://www.instagram.com/doduthegladdiator/',
    followers: '210K Followers',
    rawFollowersCount: 210000,
    description: 'Behind-the-scenes stories, aesthetic desk photos, creative reels, and daily updates.',
    brandColor: '#E1306C',
    gradient: 'from-fuchsia-600/20 via-rose-500/10 to-transparent',
    badgeText: 'Photos & Reels',
    iconName: 'Instagram',
    isActive: true,
    category: 'Photos & Reels'
  },
  {
    id: 'facebook_page',
    name: 'Facebook Page',
    handle: '@doduthegladdiatorOfficial',
    url: 'https://www.facebook.com/profile.php?id=61592539675124',
    followers: '115K Followers',
    rawFollowersCount: 115000,
    description: 'Official creator page for community discussions, video uploads, live Q&As, and announcements.',
    brandColor: '#1877F2',
    gradient: 'from-blue-600/20 via-indigo-900/10 to-transparent',
    badgeText: 'Official Creator Page',
    iconName: 'Facebook',
    isActive: true,
    category: 'Community'
  },
  {
    id: 'facebook_profile',
    name: 'Facebook Profile',
    handle: '@doduthegladiator',
    url: 'https://www.facebook.com/profile.php?id=61586773150521',
    followers: 'Personal Profile',
    rawFollowersCount: 0,
    description: 'Personal timeline & creator account. Meta Graph API policies restrict fetching personal posts via automated endpoints.',
    brandColor: '#4267B2',
    gradient: 'from-sky-600/20 via-blue-900/10 to-transparent',
    badgeText: 'Personal Account',
    iconName: 'Facebook',
    isActive: true,
    category: 'Social'
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    handle: '@doduthegladdiator_x',
    url: 'https://x.com/RoboNexus0',
    followers: '82K Followers',
    rawFollowersCount: 82000,
    description: 'Real-time thoughts, AI tech commentary, build-in-public updates, and community threads.',
    brandColor: '#1DA1F2',
    gradient: 'from-zinc-600/20 via-slate-800/10 to-transparent',
    badgeText: 'Microblog & Tech News',
    iconName: 'Twitter',
    isActive: true,
    category: 'Microblog'
  }
];
