import { z } from 'zod';

// ─── Platform ───────────────────────────────────────────────────────────────

export const platformSchema = z.enum([
  'instagram',
  'twitter',
  'linkedin',
  'facebook',
  'tiktok',
  'youtube',
]);

export type Platform = z.infer<typeof platformSchema>;

export const PLATFORM_LABELS: Record<Platform, string> = {
  instagram: 'Instagram',
  twitter: 'Twitter / X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

export const PLATFORM_COLORS: Record<Platform, string> = {
  instagram: 'bg-gradient-to-r from-purple-500 to-pink-500',
  twitter: 'bg-sky-500',
  linkedin: 'bg-blue-700',
  facebook: 'bg-blue-600',
  tiktok: 'bg-black',
  youtube: 'bg-red-600',
};

// ─── Social Network ─────────────────────────────────────────────────────────

export interface SocialNetwork {
  id: string;
  platform: Platform;
  handle: string;
  style: string;
  audience: string;
  postFrequency: string;
}

// ─── Company ────────────────────────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  description: string;
  industry: string;
  targetAudience: string;
  briefing: string;
  communicationStyle: string;
  socialNetworks: SocialNetwork[];
}

export const EMPTY_COMPANY: Omit<Company, 'id'> = {
  name: '',
  description: '',
  industry: '',
  targetAudience: '',
  briefing: '',
  communicationStyle: '',
  socialNetworks: [],
};

// ─── Publication ────────────────────────────────────────────────────────────

export type PublicationStatus = 'draft' | 'approved' | 'exported';

export interface Publication {
  id: string;
  platform: Platform;
  scheduledDate: string;
  copy: string;
  imagePrompt: string;
  imageUrl?: string;
  videoPrompt: string;
  videoUrl?: string;
  hashtags: string[];
  order: number;
  status: PublicationStatus;
}

// ─── Campaign ───────────────────────────────────────────────────────────────

export type CampaignStatus = 'draft' | 'generating' | 'generated' | 'exported';

export interface Campaign {
  id: string;
  name: string;
  summary: string;
  sourceContent: string;
  createdAt: string;
  status: CampaignStatus;
  publications: Publication[];
  companyId?: string | null;
}
