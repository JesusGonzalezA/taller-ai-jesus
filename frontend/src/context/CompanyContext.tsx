import { type ReactNode, createContext, useContext } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { type Company, EMPTY_COMPANY, type SocialNetwork } from '../types';

interface CompanyContextValue {
  company: Company;
  setCompany: (company: Company) => void;
  updateField: <K extends keyof Company>(key: K, value: Company[K]) => void;
  addNetwork: (network: SocialNetwork) => void;
  updateNetwork: (id: string, network: Partial<SocialNetwork>) => void;
  removeNetwork: (id: string) => void;
  isConfigured: boolean;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useLocalStorage<Company>('marketing-company', EMPTY_COMPANY);

  const updateField = <K extends keyof Company>(key: K, value: Company[K]) => {
    setCompany({ ...company, [key]: value });
  };

  const addNetwork = (network: SocialNetwork) => {
    setCompany({ ...company, socialNetworks: [...company.socialNetworks, network] });
  };

  const updateNetwork = (id: string, updates: Partial<SocialNetwork>) => {
    setCompany({
      ...company,
      socialNetworks: company.socialNetworks.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    });
  };

  const removeNetwork = (id: string) => {
    setCompany({
      ...company,
      socialNetworks: company.socialNetworks.filter((n) => n.id !== id),
    });
  };

  const isConfigured = company.name.trim().length > 0 && company.socialNetworks.length > 0;

  return (
    <CompanyContext.Provider
      value={{
        company,
        setCompany,
        updateField,
        addNetwork,
        updateNetwork,
        removeNetwork,
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
