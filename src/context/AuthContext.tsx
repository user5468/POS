import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';

interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: 'admin' | 'vendedor';
  active: boolean;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (id: string, updateData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const defaultUsers: User[] = [
  { id: '1', username: 'admin', password: 'admin123', name: 'Administrador', role: 'admin', active: true, createdAt: new Date().toISOString() },
  { id: '2', username: 'vendedor', password: 'vendedor123', name: 'Juan Vendedor', role: 'vendedor', active: true, createdAt: new Date().toISOString() },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const firebaseUsers: User[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as User));
      
      if (firebaseUsers.length === 0) {
        for (const user of defaultUsers) {
          await addDoc(collection(db, 'users'), user);
        }
      } else {
        setUsers(firebaseUsers);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error cargando usuarios:', error);
      const saved = localStorage.getItem('users');
      setUsers(saved ? JSON.parse(saved) : defaultUsers);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (username: string, password: string): boolean => {
    const found = users.find(u => u.username === username && u.password === password && u.active);
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addUser = async (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser = { ...userData, id: Date.now().toString(), createdAt: new Date().toISOString() };
    try {
      await addDoc(collection(db, 'users'), newUser);
    } catch (error) {
      console.error('Error agregando usuario:', error);
    }
  };

  const updateUser = async (id: string, updateData: Partial<User>) => {
    try {
      await updateDoc(doc(db, 'users', id), updateData as any);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, users, addUser, updateUser, deleteUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
