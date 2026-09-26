import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  description: string;
  createdAt: string;
}

interface Sale {
  id: string;
  items: any[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: string;
  cashier: string;
  date: string;
}

interface DataContextType {
  products: Product[];
  sales: Sale[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, updateData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const defaultProducts: Product[] = [
  { id: '1', name: 'Coca Cola 600ml', barcode: '7501055098762', category: 'Bebidas', price: 18, cost: 12, stock: 48, minStock: 10, description: 'Refresco de cola 600ml', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sabritas Original', barcode: '7501087298342', category: 'Botanas', price: 22, cost: 15, stock: 30, minStock: 8, description: 'Papas fritas sabor original', createdAt: new Date().toISOString() },
  { id: '3', name: 'Pan Bimbo Grande', barcode: '7501057530209', category: 'Pan', price: 52, cost: 38, stock: 15, minStock: 5, description: 'Pan de caja blanco grande', createdAt: new Date().toISOString() },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading] = useState(false);

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updateData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updateData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addSale = (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setSales(prev => [...prev, newSale]);
    
    sale.items.forEach(item => {
      setProducts(prev => prev.map(p => 
        p.id === item.productId ? { ...p, stock: Math.max(0, p.stock - item.quantity) } : p
      ));
    });
  };

  return (
    <DataContext.Provider value={{ products, sales, addProduct, updateProduct, deleteProduct, addSale, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
