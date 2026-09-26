import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompanyConfig {
  name: string;
  address: string;
  rfc: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
}

interface ConfigContextType {
  company: CompanyConfig;
  updateCompany: (config: Partial<CompanyConfig>) => void;
  loading: boolean;
}

const ConfigContext = createContext<ConfigContextType | null>(null);

const defaultCompany: CompanyConfig = {
  name: 'Depósito San Juditas',
  address: '',
  rfc: '',
  phone: '',
  email: '',
  taxRate: 16,
  currency: 'MXN',
};

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [company, setCompany] = useState<CompanyConfig>(() => {
    const saved = localStorage.getItem('companyConfig');
    return saved ? JSON.parse(saved) : defaultCompany;
  });

  const [loading] = useState(false);

  useEffect(() => {
    localStorage.setItem('companyConfig', JSON.stringify(company));
  }, [company]);

  const updateCompany = (config: Partial<CompanyConfig>) => {
    setCompany(prev => ({ ...prev, ...config }));
  };

  return (
    <ConfigContext.Provider value={{ company, updateCompany, loading }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
