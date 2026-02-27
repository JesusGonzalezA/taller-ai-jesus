import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { app } from '../src/app';

describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok' });
  });

  it('returns a timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body.timestamp).toBeDefined();
    expect(new Date(res.body.timestamp).getTime()).not.toBeNaN();
  });
});

describe('POST /api/campaigns/generate', () => {
  it('returns 400 when company data is invalid', async () => {
    const res = await request(app)
      .post('/api/campaigns/generate')
      .send({ company: {}, sourceContent: 'test' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when sourceContent is missing', async () => {
    const res = await request(app)
      .post('/api/campaigns/generate')
      .send({
        company: {
          name: 'Test',
          description: 'A test company',
          industry: 'Tech',
          targetAudience: 'Devs',
          briefing: 'Test briefing',
          communicationStyle: 'Casual',
          socialNetworks: [
            {
              id: '1',
              platform: 'twitter',
              handle: 'test',
              style: 'casual',
              audience: 'devs',
              postFrequency: '3/week',
            },
          ],
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('sourceContent is required and must be a string');
  });
});

describe('POST /api/campaigns/regenerate-publication', () => {
  it('returns 400 when feedback is missing', async () => {
    const res = await request(app)
      .post('/api/campaigns/regenerate-publication')
      .send({
        company: {
          name: 'Test',
          description: 'A test company',
          industry: 'Tech',
          targetAudience: 'Devs',
          briefing: 'Test briefing',
          communicationStyle: 'Casual',
          socialNetworks: [],
        },
        publication: {
          id: '1',
          platform: 'twitter',
          scheduledDate: '2026-03-01',
          copy: 'Hello world',
          imagePrompt: 'A sunrise',
          hashtags: ['#test'],
          order: 0,
          status: 'draft',
        },
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('feedback is required');
  });
});
