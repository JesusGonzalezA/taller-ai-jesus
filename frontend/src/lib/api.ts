import type { Campaign, Company, Publication } from '../types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const detail = body.message ? `: ${body.message}` : '';
    throw new Error(`${body.error ?? `Request failed: ${res.status}`}${detail}`);
  }

  return res.json() as Promise<T>;
}

export function healthCheck(): Promise<{ status: string; timestamp: string }> {
  return request('/health');
}

export function generateCampaign(
  company: Company,
  sourceContent: string,
  dateRange?: { start: string; end: string },
): Promise<Campaign> {
  return request('/campaigns/generate', {
    method: 'POST',
    body: JSON.stringify({ company, sourceContent, dateRange }),
  });
}

export function regeneratePublication(
  company: Company,
  publication: Publication,
  feedback: string,
): Promise<Publication> {
  return request('/campaigns/regenerate-publication', {
    method: 'POST',
    body: JSON.stringify({ company, publication, feedback }),
  });
}
