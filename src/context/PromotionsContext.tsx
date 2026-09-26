import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Promotion {
  id: string;
  name: string;
  type: string;
  value: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  maxDiscount: number;
  maxUses: number;
  usedCount: number;
  active: boolean;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
}

interface PromotionsContextType {
  promotions: Promotion[];
  coupons: Coupon[];
  addPromotion: (promotion: Omit<Promotion, 'id' | 'createdAt'>) => void;
  updatePromotion: (id: string, updateData: Partial<Promotion>) => void;
  deletePromotion: (id: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => void;
  updateCoupon: (id: string, updateData: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;
  validateCoupon: (code: string, purchaseTotal: number) => { valid: boolean; coupon?: Coupon; message: string };
  useCoupon: (code: string) => void;
}

const PromotionsContext = createContext<PromotionsContextType | null>(null);

export function PromotionsProvider({ children }: { children: ReactNode }) {
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('promotions');
    return saved ? JSON.parse(saved) : [];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('coupons');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addPromotion = (promotion: Omit<Promotion, 'id' | 'createdAt'>) => {
    const newPromotion: Promotion = {
      ...promotion,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setPromotions(prev => [...prev, newPromotion]);
  };

  const updatePromotion = (id: string, updateData: Partial<Promotion>) => {
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
  };

  const deletePromotion = (id: string) => {
    setPromotions(prev => prev.filter(p => p.id !== id));
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'createdAt' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      usedCount: 0,
    };
    setCoupons(prev => [...prev, newCoupon]);
  };

  const updateCoupon = (id: string, updateData: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
  };

  const deleteCoupon = (id: string) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };

  const validateCoupon = (code: string, purchaseTotal: number) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, message: 'Cupón no encontrado' };
    if (!coupon.active) return { valid: false, coupon, message: 'Cupón desactivado' };
    const now = new Date();
    if (now < new Date(coupon.startDate)) return { valid: false, coupon, message: 'Cupón aún no disponible' };
    if (now > new Date(coupon.endDate)) return { valid: false, coupon, message: 'Cupón expirado' };
    if (coupon.usedCount >= coupon.maxUses) return { valid: false, coupon, message: 'Cupón sin usos disponibles' };
    if (purchaseTotal < coupon.minPurchase) return { valid: false, coupon, message: `Compra mínima: $${coupon.minPurchase}` };
    return { valid: true, coupon, message: 'Cupón válido' };
  };

  const useCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (coupon) {
      updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
    }
  };

  return (
    <PromotionsContext.Provider value={{
      promotions,
      coupons,
      addPromotion,
      updatePromotion,
      deletePromotion,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      validateCoupon,
      useCoupon,
    }}>
      {children}
    </PromotionsContext.Provider>
  );
}

export function usePromotions() {
  const ctx = useContext(PromotionsContext);
  if (!ctx) throw new Error('usePromotions must be used within PromotionsProvider');
  return ctx;
}
