import { CreatorProfile } from '../types/social.js';

/**
 * Centralized Creator Profile Configuration
 * Replace placeholders with your own personal branding details.
 */
export const profileConfig: CreatorProfile = {
  name: 'DoDu TheGladiator',
  handle: '@doduthegladiator',
  title: 'Content Creator • Tech Innovator • Digital Storyteller',
  tagline: 'Exploring technology, design, and creative workflow across platforms.',
  shortBio: 'Digital creator building content around modern tech, creative tools, lifestyle, and visual storytelling.',
  fullBio: [
    'Welcome! I create videos, tutorials, and short-form insights on modern tech, creative software, workflow efficiency, and digital media.',
    'My mission is to break down complex topics into engaging, digestible content for curious creators, developers, and tech enthusiasts worldwide.',
    'Over the past 4 years, I have built an active community across YouTube, TikTok, Instagram, Facebook, and X (Twitter), sharing honest reviews, behind-the-scenes build logs, and creative experiments.'
  ],
  avatarUrl: '/image/dodu2.png',
  coverImageUrl: '/image/favicon2.png',
  location: 'Iqbal Town Lahore, Pakistan',
  email: 'info@doduthegladiator.com',
  niches: ['Tech & Gadgets', 'Creative AI & Design', 'Short-form Storytelling', 'Workflow & Productivity', 'Software & Web'],
  metrics: [
    {
      label: 'Total Audience',
      value: '1.25M+',
      subtext: 'Combined across 6 platforms',
      trend: '+12% this month',
      icon: 'Users'
    },
    {
      label: 'Monthly Views',
      value: '24.8M+',
      subtext: 'Shorts, Videos & Posts',
      trend: '+18% growth',
      icon: 'Eye'
    },
    {
      label: 'Engagement Rate',
      value: '8.4%',
      subtext: 'Active community interaction',
      trend: 'Top 5% category',
      icon: 'Activity'
    },
    {
      label: 'Connected Hubs',
      value: '6 Platforms',
      subtext: 'Real-time aggregated feed',
      trend: '100% synchronized',
      icon: 'Globe'
    }
  ]
};
