import { createOpenAI } from '@ai-sdk/openai';
import { generateObject, generateText } from 'ai';
import {
  type Company,
  type GeneratedCampaign,
  type Publication,
  generatedCampaignSchema,
} from '../types';

const openai = createOpenAI({
  baseURL: 'https://gateway.ai.vercel.com/v1/openai',
});

const MODEL = process.env.AI_MODEL ?? 'gpt-4o';

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
`;
}

export async function generateCampaign(
  company: Company,
  sourceContent: string,
  dateRange?: { start: string; end: string },
): Promise<GeneratedCampaign> {
  const range = dateRange ? `from ${dateRange.start} to ${dateRange.end}` : undefined;

  const { object } = await generateObject({
    model: openai(MODEL),
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
): Promise<{ copy: string; imagePrompt: string; hashtags: string[] }> {
  const { object } = await generateObject({
    model: openai(MODEL),
    schema: generatedCampaignSchema.shape.publications.element.pick({
      copy: true,
      imagePrompt: true,
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

## User feedback
${feedback}

Rewrite the copy, hashtags, and image prompt incorporating the feedback. Keep the same platform conventions.`,
    temperature: 0.7,
  });

  return object;
}

export async function generateImagePromptRefinement(
  description: string,
  style: string,
): Promise<string> {
  const { text } = await generateText({
    model: openai(MODEL),
    prompt: `You are an expert at writing prompts for AI image generation tools like DALL-E and Midjourney.

Given this description: "${description}"
And this brand style: "${style}"

Write a single, detailed image generation prompt (1-3 sentences) that would produce a professional marketing-quality image. Output ONLY the prompt, nothing else.`,
    temperature: 0.7,
  });

  return text;
}
