import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';

interface CompanyConfig {
  name: string;
  address: string;
  rfc: string;
  phone: string;
  email: string;
  taxRate: number;
  currency: string;
}

interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantity: number;
  reason: string;
  user: string;
  date: string;
}

interface CashRegister {
  id: string;
  openDate: string;
  closeDate?: string;
  initialAmount: number;
  finalAmount?: number;
  status: string;
  cashier: string;
}

interface ConfigContextType {
  company: CompanyConfig;
  updateCompany: (config: Partial<CompanyConfig>) => Promise<void>;
  adjustments: InventoryAdjustment[];
  addAdjustment: (adj: Omit<InventoryAdjustment, 'id' | 'date'>) => Promise<void>;
  cashRegister: CashRegister | null;
  openCashRegister: (initialAmount: number, cashier: string) => Promise<void>;
  closeCashRegister: (finalAmount: number) => Promise<void>;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (type: 'scan' | 'sale' | 'error') => void;
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
  const [company, setCompany] = useState<CompanyConfig>(defaultCompany);
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [cashRegister, setCashRegister] = useState<CashRegister | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const docRef = doc(db, 'config', 'company');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCompany(docSnap.data() as CompanyConfig);
        } else {
          await setDoc(docRef, defaultCompany);
        }
      } catch (error) {
        console.error('Error cargando configuración:', error);
      } finally {
        setLoading(false);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const unsubAdj = onSnapshot(collection(db, 'adjustments'), (snapshot) => {
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as InventoryAdjustment));
      setAdjustments(data);
    });
    
    const unsubCash = onSnapshot(collection(db, 'cashRegister'), (snapshot) => {
      const registers = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CashRegister));
      const openRegister = registers.find(r => r.status === 'open');
      setCashRegister(openRegister || null);
    });

    return () => { unsubAdj(); unsubCash(); };
  }, []);

  const updateCompany = async (config: Partial<CompanyConfig>) => {
    try {
      const docRef = doc(db, 'config', 'company');
      await setDoc(docRef, { ...company, ...config }, { merge: true });
      setCompany(prev => ({ ...prev, ...config }));
    } catch (error) {
      console.error('Error actualizando configuración:', error);
    }
  };

  const addAdjustment = async (adj: Omit<InventoryAdjustment, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, 'adjustments'), {
        ...adj,
        date: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error agregando ajuste:', error);
    }
  };

  const openCashRegister = async (initialAmount: number, cashier: string) => {
    try {
      await addDoc(collection(db, 'cashRegister'), {
        openDate: new Date().toISOString(),
        initialAmount,
        status: 'open',
        cashier,
      });
    } catch (error) {
      console.error('Error abriendo caja:', error);
    }
  };

  const closeCashRegister = async (finalAmount: number) => {
    if (!cashRegister) return;
    try {
      await updateDoc(doc(db, 'cashRegister', cashRegister.id), {
        closeDate: new Date().toISOString(),
        finalAmount,
        status: 'closed',
      });
    } catch (error) {
      console.error('Error cerrando caja:', error);
    }
  };

  const playSound = (type: 'scan' | 'sale' | 'error') => {
    if (!soundEnabled) return;
    const audio = new Audio();
    switch (type) {
      case 'scan':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWS57OihUA0PVKzn7bBhHAU2jNXzzn0pBSl+zPDajzsKElyx6OyrWBUIQ5zd8sFvJgUufMvt3pI9Bw==';
        break;
      case 'sale':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXbTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWS57OihUA0PVKzn7bBhHAU2jNXzzn0pBSl+zPDajzsKElyx6OyrWBUIQ5zd8sFvJgUufMvt3pI9Bw==';
        break;
      case 'error':
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXbTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWS57OihUA0PVKzn7bBhHAU2jNXzzn0pBSl+zPDajzsKElyx6OyrWBUIQ5zd8sFvJgUufMvt3pI9Bw==';
        break;
    }
    audio.play().catch(() => {});
  };

  return (
    <ConfigContext.Provider value={{
      company,
      updateCompany,
      adjustments,
      addAdjustment,
      cashRegister,
      openCashRegister,
      closeCashRegister,
      soundEnabled,
      setSoundEnabled,
      playSound,
      loading,
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) throw new Error('useConfig must be used within ConfigProvider');
  return ctx;
}
