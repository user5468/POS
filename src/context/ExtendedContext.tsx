import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  discount: number;
  totalPurchases: number;
  points: number;
  notes: string;
  createdAt: string;
}

interface CreditAccount {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface ReturnSale {
  id: string;
  originalSaleId: string;
  items: any[];
  totalRefund: number;
  reason: string;
  method: string;
  cashier: string;
  date: string;
  status: string;
}

interface Layaway {
  id: string;
  customerId: string;
  customerName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
}

interface ExtendedContextType {
  customers: Customer[];
  creditAccounts: CreditAccount[];
  returns: ReturnSale[];
  layaways: Layaway[];
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'points'>) => void;
  updateCustomer: (id: string, updateData: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addCreditAccount: (account: Omit<CreditAccount, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount'>) => void;
  addReturn: (returnSale: Omit<ReturnSale, 'id' | 'date' | 'status'>) => void;
  addLayaway: (layaway: Omit<Layaway, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount'>) => void;
}

const ExtendedContext = createContext<ExtendedContextType | null>(null);

export function ExtendedProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('customers');
    return saved ? JSON.parse(saved) : [];
  });

  const [creditAccounts, setCreditAccounts] = useState<CreditAccount[]>(() => {
    const saved = localStorage.getItem('creditAccounts');
    return saved ? JSON.parse(saved) : [];
  });

  const [returns, setReturns] = useState<ReturnSale[]>(() => {
    const saved = localStorage.getItem('returns');
    return saved ? JSON.parse(saved) : [];
  });

  const [layaways, setLayaways] = useState<Layaway[]>(() => {
    const saved = localStorage.getItem('layaways');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('creditAccounts', JSON.stringify(creditAccounts));
  }, [creditAccounts]);

  useEffect(() => {
    localStorage.setItem('returns', JSON.stringify(returns));
  }, [returns]);

  useEffect(() => {
    localStorage.setItem('layaways', JSON.stringify(layaways));
  }, [layaways]);

  const addCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'totalPurchases' | 'points'>) => {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      totalPurchases: 0,
      points: 0,
    };
    setCustomers(prev => [...prev, newCustomer]);
  };

  const updateCustomer = (id: string, updateData: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updateData } : c));
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const addCreditAccount = (account: Omit<CreditAccount, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount'>) => {
    const newAccount: CreditAccount = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paidAmount: 0,
      remainingAmount: account.totalAmount,
    };
    setCreditAccounts(prev => [...prev, newAccount]);
  };

  const addReturn = (returnSale: Omit<ReturnSale, 'id' | 'date' | 'status'>) => {
    const newReturn: ReturnSale = {
      ...returnSale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      status: 'completed',
    };
    setReturns(prev => [...prev, newReturn]);
  };

  const addLayaway = (layaway: Omit<Layaway, 'id' | 'createdAt' | 'paidAmount' | 'remainingAmount'>) => {
    const newLayaway: Layaway = {
      ...layaway,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      paidAmount: 0,
      remainingAmount: layaway.totalAmount,
    };
    setLayaways(prev => [...prev, newLayaway]);
  };

  return (
    <ExtendedContext.Provider value={{
      customers,
      creditAccounts,
      returns,
      layaways,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addCreditAccount,
      addReturn,
      addLayaway,
    }}>
      {children}
    </ExtendedContext.Provider>
  );
}

export function useExtended() {
  const ctx = useContext(ExtendedContext);
  if (!ctx) throw new Error('useExtended must be used within ExtendedProvider');
  return ctx;
}
