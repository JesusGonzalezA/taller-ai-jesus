import { z } from 'zod';

// ─── Social Network ─────────────────────────────────────────────────────────

export const platformSchema = z.enum([
  'instagram',
  'twitter',
  'linkedin',
  'facebook',
  'tiktok',
  'youtube',
]);

export type Platform = z.infer<typeof platformSchema>;

export const socialNetworkSchema = z.object({
  id: z.string(),
  platform: platformSchema,
  handle: z.string(),
  style: z.string().describe('Tone and voice specific to this network'),
  audience: z.string().describe('Target audience description for this network'),
  postFrequency: z.string().describe('E.g. "3 posts/week"'),
});

export type SocialNetwork = z.infer<typeof socialNetworkSchema>;

// ─── Company ────────────────────────────────────────────────────────────────

export const companySchema = z.object({
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  targetAudience: z.string(),
  briefing: z.string().describe('General company briefing and context'),
  communicationStyle: z.string().describe('Overall brand voice – formal, casual, technical, etc.'),
  socialNetworks: z.array(socialNetworkSchema),
});

export type Company = z.infer<typeof companySchema>;

// ─── Publication ────────────────────────────────────────────────────────────

export const publicationStatusSchema = z.enum(['draft', 'approved', 'exported']);

export const publicationSchema = z.object({
  id: z.string(),
  platform: platformSchema,
  scheduledDate: z.string().describe('ISO date string'),
  copy: z.string().describe('Publication text / caption'),
  imagePrompt: z.string().describe('Detailed prompt for image generation'),
  imageUrl: z.string().optional(),
  hashtags: z.array(z.string()),
  order: z.number(),
  status: publicationStatusSchema,
});

export type Publication = z.infer<typeof publicationSchema>;

// ─── Campaign ───────────────────────────────────────────────────────────────

export const campaignStatusSchema = z.enum(['draft', 'generating', 'generated', 'exported']);

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  sourceContent: z.string(),
  createdAt: z.string(),
  status: campaignStatusSchema,
  publications: z.array(publicationSchema),
});

export type Campaign = z.infer<typeof campaignSchema>;

// ─── AI Generation schemas (what the model returns) ─────────────────────────

export const generatedPublicationSchema = z.object({
  platform: platformSchema,
  scheduledDate: z.string().describe('ISO date string YYYY-MM-DD'),
  copy: z.string().describe('Full publication text adapted to the platform'),
  imagePrompt: z
    .string()
    .describe('Detailed visual description for AI image generation, in English'),
  hashtags: z.array(z.string()),
});

export const generatedCampaignSchema = z.object({
  name: z.string().describe('Short, catchy campaign name'),
  summary: z.string().describe('2-3 sentence executive summary of the campaign strategy'),
  publications: z
    .array(generatedPublicationSchema)
    .describe('All publications across all requested social networks'),
});

export type GeneratedCampaign = z.infer<typeof generatedCampaignSchema>;

// ─── Request / Response DTOs ────────────────────────────────────────────────

export interface GenerateCampaignRequest {
  company: Company;
  sourceContent: string;
  dateRange?: { start: string; end: string };
}

export interface RegeneratePublicationRequest {
  company: Company;
  publication: Publication;
  feedback: string;
}
