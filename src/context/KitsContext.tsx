import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface KitItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

interface Kit {
  id: string;
  name: string;
  description: string;
  items: KitItem[];
  kitPrice: number;
  originalPrice: number;
  discount: number;
  discountPercentage: number;
  active: boolean;
  createdAt: string;
}

interface KitsContextType {
  kits: Kit[];
  addKit: (kit: Omit<Kit, 'id' | 'createdAt'>) => void;
  updateKit: (id: string, updateData: Partial<Kit>) => void;
  deleteKit: (id: string) => void;
}

const KitsContext = createContext<KitsContextType | null>(null);

export function KitsProvider({ children }: { children: ReactNode }) {
  const [kits, setKits] = useState<Kit[]>(() => {
    const saved = localStorage.getItem('kits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('kits', JSON.stringify(kits));
  }, [kits]);

  const addKit = (kit: Omit<Kit, 'id' | 'createdAt'>) => {
    const newKit: Kit = {
      ...kit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setKits(prev => [...prev, newKit]);
  };

  const updateKit = (id: string, updateData: Partial<Kit>) => {
    setKits(prev => prev.map(k => k.id === id ? { ...k, ...updateData } : k));
  };

  const deleteKit = (id: string) => {
    setKits(prev => prev.filter(k => k.id !== id));
  };

  return (
    <KitsContext.Provider value={{ kits, addKit, updateKit, deleteKit }}>
      {children}
    </KitsContext.Provider>
  );
}

export function useKits() {
  const ctx = useContext(KitsContext);
  if (!ctx) throw new Error('useKits must be used within KitsProvider');
  return ctx;
}
