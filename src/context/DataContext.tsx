import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';

interface Product {
  id: string;
  name: string;
  barcode: string;
  category: string;
  price: number;
  priceCase?: number;
  unitsPerCase?: number;
  cost: number;
  costCase?: number;
  stock: number;
  stockCases?: number;
  minStock: number;
  description: string;
  image?: string;
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
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updateData: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  sales: Sale[];
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

const defaultProducts: Product[] = [
  { id: '1', name: 'Coca Cola 600ml', barcode: '7501055098762', category: 'Bebidas', price: 18, priceCase: 200, unitsPerCase: 12, cost: 12, costCase: 140, stock: 48, stockCases: 4, minStock: 10, description: 'Refresco de cola 600ml', createdAt: new Date().toISOString() },
  { id: '2', name: 'Sabritas Original', barcode: '7501087298342', category: 'Botanas', price: 22, cost: 15, stock: 30, minStock: 8, description: 'Papas fritas sabor original', createdAt: new Date().toISOString() },
  { id: '3', name: 'Pan Bimbo Grande', barcode: '7501057530209', category: 'Pan', price: 52, cost: 38, stock: 15, minStock: 5, description: 'Pan de caja blanco grande', createdAt: new Date().toISOString() },
  { id: '4', name: 'Leche Lala 1L', barcode: '7501055393010', category: 'Lácteos', price: 28, cost: 20, stock: 24, minStock: 10, description: 'Leche entera 1 litro', createdAt: new Date().toISOString() },
  { id: '5', name: 'Galletas Marías', barcode: '7501000654321', category: 'Galletas', price: 15, cost: 9, stock: 40, minStock: 12, description: 'Galletas Marías Gamesa', createdAt: new Date().toISOString() },
  { id: '6', name: 'Agua Bonafont 1L', barcode: '7501013400015', category: 'Bebidas', price: 12, priceCase: 130, unitsPerCase: 12, cost: 7, costCase: 75, stock: 60, stockCases: 5, minStock: 15, description: 'Agua purificada 1 litro', createdAt: new Date().toISOString() },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'products'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const firebaseProducts: Product[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
      
      if (firebaseProducts.length === 0) {
        for (const product of defaultProducts) {
          await addDoc(collection(db, 'products'), product);
        }
      } else {
        setProducts(firebaseProducts);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error cargando productos:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'sales'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firebaseSales: Sale[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Sale));
      setSales(firebaseSales);
    }, (error) => {
      console.error('Error cargando ventas:', error);
    });

    return () => unsubscribe();
  }, []);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct = { ...product, id: Date.now().toString(), createdAt: new Date().toISOString() };
    try {
      await addDoc(collection(db, 'products'), newProduct);
    } catch (error) {
      console.error('Error agregando producto:', error);
    }
  };

  const updateProduct = async (id: string, updateData: Partial<Product>) => {
    try {
      await updateDoc(doc(db, 'products', id), updateData as any);
    } catch (error) {
      console.error('Error actualizando producto:', error);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error eliminando producto:', error);
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'date'>) => {
    const newSale = { ...sale, id: Date.now().toString(), date: new Date().toISOString() };
    try {
      await addDoc(collection(db, 'sales'), newSale);
      
      sale.items.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (product) {
          const qty = item.saleType === 'case' ? item.quantity * (product.unitsPerCase || 1) : item.quantity;
          const newStock = Math.max(0, product.stock - qty);
          updateDoc(doc(db, 'products', item.productId), { stock: newStock });
        }
      });
    } catch (error) {
      console.error('Error agregando venta:', error);
    }
  };

  return (
    <DataContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, sales, addSale, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
