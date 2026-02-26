import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Campaign, Publication } from '../types';
import { useAuth } from './AuthContext';

interface CampaignContextValue {
  campaigns: Campaign[];
  loading: boolean;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  removeCampaign: (id: string) => Promise<void>;
  getCampaign: (id: string) => Campaign | undefined;
  updatePublication: (
    campaignId: string,
    pubId: string,
    updates: Partial<Publication>,
  ) => Promise<void>;
  reorderPublications: (campaignId: string, publications: Publication[]) => Promise<void>;
}

const CampaignContext = createContext<CampaignContextValue | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = useCallback(async () => {
    if (!user) {
      setCampaigns([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: campaignRows } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });

    if (!campaignRows || campaignRows.length === 0) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    const { data: pubRows } = await supabase
      .from('publications')
      .select('*')
      .in(
        'campaign_id',
        campaignRows.map((c) => c.id),
      )
      .order('order', { ascending: true });

    const loaded: Campaign[] = campaignRows.map((row) => ({
      id: row.id,
      name: row.name,
      summary: row.summary,
      sourceContent: row.source_content,
      createdAt: row.created_at,
      status: row.status as Campaign['status'],
      companyId: row.company_id,
      publications: (pubRows ?? [])
        .filter((p) => p.campaign_id === row.id)
        .map((p) => ({
          id: p.id,
          platform: p.platform as Publication['platform'],
          scheduledDate: p.scheduled_date ?? '',
          copy: p.copy,
          imagePrompt: p.image_prompt,
          imageUrl: p.image_url ?? undefined,
          videoPrompt: p.video_prompt ?? '',
          videoUrl: p.video_url ?? undefined,
          hashtags: (p.hashtags as string[]) ?? [],
          order: p.order,
          status: p.status as Publication['status'],
        })),
    }));

    setCampaigns(loaded);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  const addCampaign = useCallback(
    async (campaign: Campaign) => {
      if (!user) throw new Error('Not authenticated');

      const { error: campaignError } = await supabase.from('campaigns').insert({
        id: campaign.id,
        user_id: user.id,
        company_id: campaign.companyId ?? null,
        name: campaign.name,
        summary: campaign.summary,
        source_content: campaign.sourceContent,
        status: campaign.status,
        created_at: campaign.createdAt,
      });
      if (campaignError) throw campaignError;

      if (campaign.publications.length > 0) {
        const { error: pubError } = await supabase.from('publications').insert(
          campaign.publications.map((p) => ({
            id: p.id,
            campaign_id: campaign.id,
            platform: p.platform,
            scheduled_date: p.scheduledDate || null,
            copy: p.copy,
            image_prompt: p.imagePrompt,
            image_url: p.imageUrl ?? null,
            video_prompt: p.videoPrompt ?? '',
            video_url: p.videoUrl ?? null,
            hashtags: p.hashtags,
            order: p.order,
            status: p.status,
          })),
        );
        if (pubError) throw pubError;
      }

      setCampaigns((prev) => [campaign, ...prev]);
    },
    [user],
  );

  const updateCampaign = useCallback(async (id: string, updates: Partial<Campaign>) => {
    const { error } = await supabase
      .from('campaigns')
      .update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.summary !== undefined && { summary: updates.summary }),
        ...(updates.status !== undefined && { status: updates.status }),
        ...(updates.sourceContent !== undefined && { source_content: updates.sourceContent }),
      })
      .eq('id', id);
    if (error) throw error;
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }, []);

  const removeCampaign = useCallback(async (id: string) => {
    const { error } = await supabase.from('campaigns').delete().eq('id', id);
    if (error) throw error;
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const getCampaign = useCallback((id: string) => campaigns.find((c) => c.id === id), [campaigns]);

  const updatePublication = useCallback(
    async (campaignId: string, pubId: string, updates: Partial<Publication>) => {
      const { error } = await supabase
        .from('publications')
        .update({
          ...(updates.copy !== undefined && { copy: updates.copy }),
          ...(updates.imagePrompt !== undefined && { image_prompt: updates.imagePrompt }),
          ...(updates.imageUrl !== undefined && { image_url: updates.imageUrl }),
          ...(updates.videoPrompt !== undefined && { video_prompt: updates.videoPrompt }),
          ...(updates.videoUrl !== undefined && { video_url: updates.videoUrl }),
          ...(updates.hashtags !== undefined && { hashtags: updates.hashtags }),
          ...(updates.status !== undefined && { status: updates.status }),
          ...(updates.scheduledDate !== undefined && {
            scheduled_date: updates.scheduledDate || null,
          }),
        })
        .eq('id', pubId);
      if (error) throw error;
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? {
                ...c,
                publications: c.publications.map((p) =>
                  p.id === pubId ? { ...p, ...updates } : p,
                ),
              }
            : c,
        ),
      );
    },
    [],
  );

  const reorderPublications = useCallback(
    async (campaignId: string, publications: Publication[]) => {
      const ordered = publications.map((p, i) => ({ ...p, order: i }));
      // Batch update orders
      await Promise.all(
        ordered.map((p) => supabase.from('publications').update({ order: p.order }).eq('id', p.id)),
      );
      setCampaigns((prev) =>
        prev.map((c) => (c.id === campaignId ? { ...c, publications: ordered } : c)),
      );
    },
    [],
  );

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        loading,
        addCampaign,
        updateCampaign,
        removeCampaign,
        getCampaign,
        updatePublication,
        reorderPublications,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
}

export function useCampaigns(): CampaignContextValue {
  const ctx = useContext(CampaignContext);
  if (!ctx) throw new Error('useCampaigns must be used within CampaignProvider');
  return ctx;
}
