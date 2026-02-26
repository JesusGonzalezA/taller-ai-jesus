import { gateway } from '@ai-sdk/gateway';
import { experimental_generateVideo, generateImage, generateObject } from 'ai';
import {
  type Company,
  type GeneratedCampaign,
  type Publication,
  generatedCampaignSchema,
} from '../types';

const MODEL = process.env.AI_MODEL ?? 'openai/gpt-4o';
const IMAGE_MODEL_ID = process.env.AI_IMAGE_MODEL ?? 'xai/grok-imagine-image';
const VIDEO_MODEL_ID = 'xai/grok-imagine-video';

function buildCampaignPrompt(company: Company, sourceContent: string, dateRange?: string): string {
  const networks = company.socialNetworks
    .map(
      (n) =>
        `- **${n.platform}** (@${n.handle}): style="${n.style}", audience="${n.audience}", frequency=${n.postFrequency}`,
    )
    .join('\n');

  return `You are an expert marketing strategist and social-media manager.

## Company
- Name: ${company.name}
- Industry: ${company.industry}
- Description: ${company.description}
- Target audience: ${company.targetAudience}
- Communication style: ${company.communicationStyle}

### Briefing
${company.briefing}

### Configured social networks
${networks}

## Source content (transcript / notes)
${sourceContent}

## Task
Based on the source content and the company context, generate a complete marketing campaign.

Rules:
1. Create publications for EVERY configured social network.
2. Respect each network's posting frequency – spread them across ${dateRange ?? 'the next 2 weeks starting from today'}.
3. Adapt the copy style to each platform and the company communication style.
4. Write copy in the same language as the source content.
5. Each publication must have a detailed image prompt in English describing the visual for AI image generation.
6. Include relevant hashtags per platform.
7. Make the campaign cohesive – all publications should support the same narrative.
8. Each publication must also have a detailed video prompt in English describing a short video concept (motion, transitions, camera angles, visual narrative) suitable for AI video generation.
`;
}

export async function generateCampaign(
  company: Company,
  sourceContent: string,
  dateRange?: { start: string; end: string },
): Promise<GeneratedCampaign> {
  const range = dateRange ? `from ${dateRange.start} to ${dateRange.end}` : undefined;

  const { object } = await generateObject({
    model: MODEL,
    schema: generatedCampaignSchema,
    prompt: buildCampaignPrompt(company, sourceContent, range),
    temperature: 0.7,
  });

  return object;
}

export async function regeneratePublication(
  company: Company,
  publication: Publication,
  feedback: string,
): Promise<{ copy: string; imagePrompt: string; videoPrompt: string; hashtags: string[] }> {
  const { object } = await generateObject({
    model: MODEL,
    schema: generatedCampaignSchema.shape.publications.element.pick({
      copy: true,
      imagePrompt: true,
      videoPrompt: true,
      hashtags: true,
    }),
    prompt: `You are an expert social-media copywriter.

## Company
- Name: ${company.name}
- Style: ${company.communicationStyle}
- Industry: ${company.industry}

## Current publication (${publication.platform})
Copy: ${publication.copy}
Hashtags: ${publication.hashtags.join(' ')}
Image Prompt: ${publication.imagePrompt}
Video Prompt: ${publication.videoPrompt}

## User feedback
${feedback}

Rewrite the copy, hashtags, image prompt, and video prompt incorporating the feedback. Keep the same platform conventions.`,
    temperature: 0.7,
  });

  return object;
}

export async function generateImageFromPrompt(
  imagePrompt: string,
): Promise<{ base64: string; mediaType: string }> {
  const { image } = await generateImage({
    model: gateway.imageModel(IMAGE_MODEL_ID),
    prompt: imagePrompt,
  });

  return { base64: image.base64, mediaType: image.mediaType };
}

export async function generateVideoFromPrompt(
  videoPrompt: string,
): Promise<{ base64: string; mediaType: string }> {
  const { video } = await experimental_generateVideo({
    model: gateway.videoModel(VIDEO_MODEL_ID),
    prompt: videoPrompt,
  });

  return { base64: video.base64, mediaType: video.mediaType };
}
