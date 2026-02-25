import { type ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Company, SocialNetwork } from '../types';
import { useAuth } from './AuthContext';

interface CompanyContextValue {
  companies: Company[];
  activeCompany: Company | null;
  activeCompanyId: string | null;
  setActiveCompanyId: (id: string | null) => void;
  createCompany: (data: Omit<Company, 'id' | 'socialNetworks'>) => Promise<Company>;
  updateCompany: (
    id: string,
    data: Partial<Omit<Company, 'id' | 'socialNetworks'>>,
  ) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addNetwork: (companyId: string, network: Omit<SocialNetwork, 'id'>) => Promise<void>;
  updateNetwork: (
    companyId: string,
    networkId: string,
    updates: Partial<Omit<SocialNetwork, 'id'>>,
  ) => Promise<void>;
  removeNetwork: (companyId: string, networkId: string) => Promise<void>;
  loading: boolean;
  isConfigured: boolean;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

function dbRowToCompany(
  row: {
    id: string;
    name: string;
    description: string;
    industry: string;
    target_audience: string;
    briefing: string;
    communication_style: string;
  },
  networks: {
    id: string;
    platform: string;
    handle: string;
    style: string;
    audience: string;
    post_frequency: number;
  }[],
): Company {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    industry: row.industry,
    targetAudience: row.target_audience,
    briefing: row.briefing,
    communicationStyle: row.communication_style,
    socialNetworks: networks.map((n) => ({
      id: n.id,
      platform: n.platform as SocialNetwork['platform'],
      handle: n.handle,
      style: n.style,
      audience: n.audience,
      postFrequency: String(n.post_frequency),
    })),
  };
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCompanies = useCallback(async () => {
    if (!user) {
      setCompanies([]);
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: companyRows, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (companiesError || !companyRows) {
      setLoading(false);
      return;
    }

    const { data: networkRows } = await supabase
      .from('social_networks')
      .select('*')
      .in(
        'company_id',
        companyRows.map((c) => c.id),
      );

    const loaded = companyRows.map((row) =>
      dbRowToCompany(
        row,
        (networkRows ?? []).filter((n) => n.company_id === row.id),
      ),
    );

    setCompanies(loaded);
    // Persist active company in localStorage as a simple preference
    const stored = localStorage.getItem('active-company-id');
    if (stored && loaded.find((c) => c.id === stored)) {
      setActiveCompanyId(stored);
    } else if (loaded.length > 0) {
      setActiveCompanyId(loaded[0].id);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSetActiveCompanyId = useCallback((id: string | null) => {
    setActiveCompanyId(id);
    if (id) localStorage.setItem('active-company-id', id);
    else localStorage.removeItem('active-company-id');
  }, []);

  const createCompany = useCallback(
    async (data: Omit<Company, 'id' | 'socialNetworks'>): Promise<Company> => {
      if (!user) throw new Error('Not authenticated');
      const { data: row, error } = await supabase
        .from('companies')
        .insert({
          user_id: user.id,
          name: data.name,
          description: data.description,
          industry: data.industry,
          target_audience: data.targetAudience,
          briefing: data.briefing,
          communication_style: data.communicationStyle,
        })
        .select()
        .single();
      if (error || !row) throw error ?? new Error('Failed to create company');
      const newCompany = dbRowToCompany(row, []);
      setCompanies((prev) => [newCompany, ...prev]);
      setActiveCompanyId(newCompany.id);
      localStorage.setItem('active-company-id', newCompany.id);
      return newCompany;
    },
    [user],
  );

  const updateCompany = useCallback(
    async (id: string, data: Partial<Omit<Company, 'id' | 'socialNetworks'>>) => {
      const { error } = await supabase
        .from('companies')
        .update({
          ...(data.name !== undefined && { name: data.name }),
          ...(data.description !== undefined && { description: data.description }),
          ...(data.industry !== undefined && { industry: data.industry }),
          ...(data.targetAudience !== undefined && { target_audience: data.targetAudience }),
          ...(data.briefing !== undefined && { briefing: data.briefing }),
          ...(data.communicationStyle !== undefined && {
            communication_style: data.communicationStyle,
          }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) throw error;
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    },
    [],
  );

  const deleteCompany = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('companies').delete().eq('id', id);
      if (error) throw error;
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      if (activeCompanyId === id) {
        const remaining = companies.filter((c) => c.id !== id);
        const next = remaining[0]?.id ?? null;
        setActiveCompanyId(next);
        if (next) localStorage.setItem('active-company-id', next);
        else localStorage.removeItem('active-company-id');
      }
    },
    [activeCompanyId, companies],
  );

  const addNetwork = useCallback(async (companyId: string, network: Omit<SocialNetwork, 'id'>) => {
    const { data: row, error } = await supabase
      .from('social_networks')
      .insert({
        company_id: companyId,
        platform: network.platform,
        handle: network.handle,
        style: network.style,
        audience: network.audience,
        post_frequency: Number(network.postFrequency) || 3,
      })
      .select()
      .single();
    if (error || !row) throw error ?? new Error('Failed to add network');
    const newNetwork: SocialNetwork = {
      id: row.id,
      platform: row.platform as SocialNetwork['platform'],
      handle: row.handle,
      style: row.style,
      audience: row.audience,
      postFrequency: String(row.post_frequency),
    };
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId ? { ...c, socialNetworks: [...c.socialNetworks, newNetwork] } : c,
      ),
    );
  }, []);

  const updateNetwork = useCallback(
    async (companyId: string, networkId: string, updates: Partial<Omit<SocialNetwork, 'id'>>) => {
      const { error } = await supabase
        .from('social_networks')
        .update({
          ...(updates.platform !== undefined && { platform: updates.platform }),
          ...(updates.handle !== undefined && { handle: updates.handle }),
          ...(updates.style !== undefined && { style: updates.style }),
          ...(updates.audience !== undefined && { audience: updates.audience }),
          ...(updates.postFrequency !== undefined && {
            post_frequency: Number(updates.postFrequency) || 3,
          }),
        })
        .eq('id', networkId);
      if (error) throw error;
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? {
                ...c,
                socialNetworks: c.socialNetworks.map((n) =>
                  n.id === networkId ? { ...n, ...updates } : n,
                ),
              }
            : c,
        ),
      );
    },
    [],
  );

  const removeNetwork = useCallback(async (companyId: string, networkId: string) => {
    const { error } = await supabase.from('social_networks').delete().eq('id', networkId);
    if (error) throw error;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? { ...c, socialNetworks: c.socialNetworks.filter((n) => n.id !== networkId) }
          : c,
      ),
    );
  }, []);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) ?? null;
  const isConfigured =
    !!activeCompany &&
    activeCompany.name.trim().length > 0 &&
    activeCompany.socialNetworks.length > 0;

  return (
    <CompanyContext.Provider
      value={{
        companies,
        activeCompany,
        activeCompanyId,
        setActiveCompanyId: handleSetActiveCompanyId,
        createCompany,
        updateCompany,
        deleteCompany,
        addNetwork,
        updateNetwork,
        removeNetwork,
        loading,
        isConfigured,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany(): CompanyContextValue {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
  return ctx;
}
