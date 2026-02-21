import { type ReactNode, createContext, useCallback, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Campaign, Publication } from '../types';

interface CampaignContextValue {
  campaigns: Campaign[];
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  getCampaign: (id: string) => Campaign | undefined;
  updatePublication: (campaignId: string, pubId: string, updates: Partial<Publication>) => void;
  reorderPublications: (campaignId: string, publications: Publication[]) => void;
}

const CampaignContext = createContext<CampaignContextValue | null>(null);

export function CampaignProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>('marketing-campaigns', []);

  const addCampaign = useCallback(
    (campaign: Campaign) => {
      setCampaigns((prev) => [campaign, ...prev]);
    },
    [setCampaigns],
  );

  const updateCampaign = useCallback(
    (id: string, updates: Partial<Campaign>) => {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    },
    [setCampaigns],
  );

  const removeCampaign = useCallback(
    (id: string) => {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    },
    [setCampaigns],
  );

  const getCampaign = useCallback((id: string) => campaigns.find((c) => c.id === id), [campaigns]);

  const updatePublication = useCallback(
    (campaignId: string, pubId: string, updates: Partial<Publication>) => {
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
    [setCampaigns],
  );

  const reorderPublications = useCallback(
    (campaignId: string, publications: Publication[]) => {
      setCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaignId
            ? { ...c, publications: publications.map((p, i) => ({ ...p, order: i })) }
            : c,
        ),
      );
    },
    [setCampaigns],
  );

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
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
