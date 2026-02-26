import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import {
  generateCampaign,
  generateImageFromPrompt,
  generateVideoFromPrompt,
  regeneratePublication,
} from '../services/ai';
import { companySchema, publicationSchema } from '../types';
import type { Campaign, Publication } from '../types';

const router = Router();

// POST /api/campaigns/generate – Generate a full campaign via AI
router.post('/generate', async (req, res) => {
  try {
    const { company, sourceContent, dateRange } = req.body;

    const parsed = companySchema.safeParse(company);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid company data', details: parsed.error.flatten() });
      return;
    }

    if (!sourceContent || typeof sourceContent !== 'string') {
      res.status(400).json({ error: 'sourceContent is required and must be a string' });
      return;
    }

    const generated = await generateCampaign(parsed.data, sourceContent, dateRange);

    const campaign: Campaign = {
      id: randomUUID(),
      name: generated.name,
      summary: generated.summary,
      sourceContent,
      createdAt: new Date().toISOString(),
      status: 'generated',
      publications: generated.publications.map((pub, index) => ({
        id: randomUUID(),
        platform: pub.platform,
        scheduledDate: pub.scheduledDate,
        copy: pub.copy,
        imagePrompt: pub.imagePrompt,
        videoPrompt: pub.videoPrompt,
        hashtags: pub.hashtags,
        order: index,
        status: 'draft' as const,
      })),
    };

    res.json(campaign);
  } catch (error) {
    console.error('Campaign generation failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Campaign generation failed', message });
  }
});

// POST /api/campaigns/regenerate-publication – Regenerate a single publication
router.post('/regenerate-publication', async (req, res) => {
  try {
    const { company, publication, feedback } = req.body;

    const parsedCompany = companySchema.safeParse(company);
    if (!parsedCompany.success) {
      res
        .status(400)
        .json({ error: 'Invalid company data', details: parsedCompany.error.flatten() });
      return;
    }

    const parsedPub = publicationSchema.safeParse(publication);
    if (!parsedPub.success) {
      res
        .status(400)
        .json({ error: 'Invalid publication data', details: parsedPub.error.flatten() });
      return;
    }

    if (!feedback || typeof feedback !== 'string') {
      res.status(400).json({ error: 'feedback is required' });
      return;
    }

    const result = await regeneratePublication(parsedCompany.data, parsedPub.data, feedback);

    const updated: Publication = {
      ...parsedPub.data,
      copy: result.copy,
      imagePrompt: result.imagePrompt,
      videoPrompt: result.videoPrompt,
      hashtags: result.hashtags,
    };

    res.json(updated);
  } catch (error) {
    console.error('Publication regeneration failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Regeneration failed', message });
  }
});

// POST /api/campaigns/generate-image – Generate an image from a prompt
router.post('/generate-image', async (req, res) => {
  try {
    const { imagePrompt } = req.body;

    if (!imagePrompt || typeof imagePrompt !== 'string') {
      res.status(400).json({ error: 'imagePrompt is required and must be a string' });
      return;
    }

    const result = await generateImageFromPrompt(imagePrompt);
    res.json(result);
  } catch (error) {
    console.error('Image generation failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Image generation failed', message });
  }
});

// POST /api/campaigns/generate-video – Generate a video using xai/grok-imagine-video
router.post('/generate-video', async (req, res) => {
  try {
    const { videoPrompt } = req.body;

    if (!videoPrompt || typeof videoPrompt !== 'string') {
      res.status(400).json({ error: 'videoPrompt is required and must be a string' });
      return;
    }

    const result = await generateVideoFromPrompt(videoPrompt);
    res.json(result);
  } catch (error) {
    console.error('Video generation failed:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: 'Video generation failed', message });
  }
});

export default router;
