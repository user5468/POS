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

import { Product } from '../types';

interface KitsContextType {
  kits: Kit[];
  addKit: (kit: Omit<Kit, 'id' | 'createdAt'>) => void;
  updateKit: (id: string, updateData: Partial<Kit>) => void;
  deleteKit: (id: string) => void;
  canAssembleKit: (kit: Kit, quantity: number, products: Product[]) => boolean;
  getKitAvailability: (kit: Kit, products: Product[]) => number;
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

  const canAssembleKit = (kit: Kit, quantity: number, products: Product[]): boolean => {
    return kit.items.every((item: any) => {
      const product = products.find(p => p.id === item.productId);
      return product && product.stock >= item.quantity * quantity;
    });
  };

  const getKitAvailability = (kit: Kit, products: Product[]): number => {
    let maxQuantity = Infinity;
    kit.items.forEach((item: any) => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const available = Math.floor(product.stock / item.quantity);
        maxQuantity = Math.min(maxQuantity, available);
      } else {
        maxQuantity = 0;
      }
    });
    return maxQuantity === Infinity ? 0 : maxQuantity;
  };

  return (
    <KitsContext.Provider value={{ kits, addKit, updateKit, deleteKit, canAssembleKit, getKitAvailability }}>
      {children}
    </KitsContext.Provider>
  );
}

export function useKits() {
  const ctx = useContext(KitsContext);
  if (!ctx) throw new Error('useKits must be used within KitsProvider');
  return ctx;
}
