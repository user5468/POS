import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { ExtendedProvider, useExtended } from './context/ExtendedContext';
import { KitsProvider, useKits } from './context/KitsContext';
import { PromotionsProvider, usePromotions } from './context/PromotionsContext';

// Layout Component
function Layout({ children, currentPage, onNavigate }: any) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', roles: ['admin'] },
    { id: 'pos', label: 'Punto de Venta', roles: ['admin', 'vendedor'] },
    { id: 'inventory', label: 'Inventario', roles: ['admin'] },
    { id: 'kits', label: 'Kits', roles: ['admin'] },
    { id: 'customers', label: 'Clientes', roles: ['admin', 'vendedor'] },
    { id: 'credit-accounts', label: 'Cuentas', roles: ['admin'] },
    { id: 'layaways', label: 'Apartados', roles: ['admin'] },
    { id: 'returns', label: 'Devoluciones', roles: ['admin', 'vendedor'] },
    { id: 'advanced-reports', label: 'Reportes', roles: ['admin'] },
    { id: 'adjustments', label: 'Ajustes', roles: ['admin'] },
    { id: 'promotions', label: 'Promociones', roles: ['admin'] },
    { id: 'sales', label: 'Ventas', roles: ['admin'] },
    { id: 'cash-register', label: 'Caja', roles: ['admin'] },
    { id: 'users', label: 'Usuarios', roles: ['admin'] },
    { id: 'settings', label: 'Config', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(item => user && item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-200 transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center text-white text-xs font-bold">SJ</div>
            <div>
              <h1 className="font-semibold text-sm">San Juditas</h1>
              <p className="text-xs text-gray-500">POS</p>
            </div>
          </div>
          <button className="lg:hidden absolute top-4 right-4 text-gray-400" onClick={() => setSidebarOpen(false)}>×</button>
        </div>
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {filteredItems.map(item => (
            <button key={item.id} onClick={() => { onNavigate(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs ${currentPage === item.id ? 'bg-gray-100 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2 p-2 mb-2">
            <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium">{user?.name.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs text-gray-600 hover:bg-gray-100">Salir</button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>☰</button>
          <h1 className="text-sm font-semibold">{currentPage === 'pos' ? 'Punto de Venta' : currentPage}</h1>
          <div className="ml-auto text-xs text-gray-500">{new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}</div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// Login Component
function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!login(username, password)) setError('Credenciales incorrectas');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-3">SJ</div>
          <h1 className="text-lg font-semibold">Depósito San Juditas</h1>
          <p className="text-xs text-gray-500 mt-1">Sistema POS</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-sm font-semibold mb-4">Iniciar sesión</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md" placeholder="Usuario" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md" placeholder="Contraseña" required />
            {error && <div className="text-xs text-red-600">{error}</div>}
            <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800">Ingresar</button>
          </form>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">admin / admin123</p>
            <p className="text-xs text-gray-500">vendedor / vendedor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Component
function Dashboard() {
  const { products, sales } = useData();
  const { user } = useAuth();
  const { creditAccounts, layaways } = useExtended();

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p: any) => p.stock <= p.minStock);
  const totalSales = sales.length;
  const todaySales = sales.filter((s: any) => new Date(s.date).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((acc: number, s: any) => acc + s.total, 0);
  const totalRevenue = sales.reduce((acc: number, s: any) => acc + s.total, 0);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Hola, {user?.name}</h2>
        <p className="text-xs text-gray-500">Resumen de tu negocio</p>
      </div>
      {lowStockProducts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Stock bajo</h3>
          <p className="text-xs text-gray-600 mb-2">{lowStockProducts.length} productos requieren atención</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {lowStockProducts.slice(0, 6).map((product: any) => (
              <div key={product.id} className="text-xs">
                <p className="font-medium">{product.name}</p>
                <p className="text-gray-500">{product.stock} / {product.minStock}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Productos</p>
          <p className="text-2xl font-semibold">{totalProducts}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Ventas hoy</p>
          <p className="text-2xl font-semibold text-green-600">${todayRevenue.toFixed(0)}</p>
          <p className="text-xs text-gray-500">{todaySales.length} trans.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total ventas</p>
          <p className="text-2xl font-semibold">{totalSales}</p>
          <p className="text-xs text-gray-500">${totalRevenue.toFixed(0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Stock bajo</p>
          <p className="text-2xl font-semibold text-red-600">{lowStockProducts.length}</p>
        </div>
      </div>
    </div>
  );
}

// POS Component
function POS() {
  const { products, addSale } = useData();
  const { user } = useAuth();
  const { success, error: showError } = useAlert();
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);

  const filteredProducts = products.filter((p: any) => p.stock > 0 && (p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search)));
  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const completeSale = () => {
    if (paymentMethod === 'efectivo' && parseFloat(amountReceived || '0') < total) return;
    addSale({
      items: cart.map(item => ({ productId: item.product.id, productName: item.product.name, quantity: item.quantity, price: item.product.price, subtotal: item.product.price * item.quantity })),
      total,
      subtotal: total,
      tax: 0,
      discount: 0,
      paymentMethod,
      cashier: user?.name || 'Desconocido',
    });
    success(`Venta completada: $${total.toFixed(2)}`);
    setCart([]);
    setAmountReceived('');
    setShowCheckout(false);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      <div className="flex-1 bg-white border border-gray-200 rounded-lg flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input type="text" placeholder="Buscar producto..." value={search} onChange={e => setSearch(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md" autoFocus />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredProducts.map((product: any) => (
              <button key={product.id} onClick={() => addToCart(product)} className="p-3 border border-gray-200 rounded-md hover:border-gray-400 text-left">
                <p className="font-medium text-xs truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>
                <p className="text-sm font-semibold mt-1">${product.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500">×{product.stock}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-96 bg-white border border-gray-200 rounded-lg flex flex-col">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-semibold text-sm">Carrito</h3>
          <p className="text-xs text-gray-500">{totalItems} productos</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xs">Carrito vacío</p>
            </div>
          ) : (
            <div className="space-y-1">
              {cart.map(item => (
                <div key={item.product.id} className="flex items-center gap-2 p-2 bg-white rounded-md border border-gray-200">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-500">${item.product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">-</button>
                    <span className="w-8 text-center text-xs font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-xs">+</button>
                  </div>
                  <p className="font-semibold text-xs w-16 text-right">${(item.product.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.product.id)} className="p-1 text-gray-400 hover:text-red-500 text-xs">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-3 space-y-2">
          <div className="grid grid-cols-3 gap-1">
            <button onClick={() => setPaymentMethod('efectivo')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'efectivo' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Efectivo</button>
            <button onClick={() => setPaymentMethod('tarjeta')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'tarjeta' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Tarjeta</button>
            <button onClick={() => setPaymentMethod('transferencia')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'transferencia' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Transf.</button>
          </div>
          <div className="bg-gray-900 text-white rounded-md p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">TOTAL</span>
              <span className="text-xl font-semibold">${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300">Cobrar</button>
        </div>
      </div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-gray-200">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-semibold">${total.toFixed(2)}</p>
            </div>
            <div className="p-4 space-y-3">
              {paymentMethod === 'efectivo' && (
                <>
                  <input type="number" value={amountReceived} onChange={e => setAmountReceived(e.target.value)} className="w-full text-2xl font-semibold border-b border-gray-200 pb-1 outline-none" placeholder="$0.00" autoFocus />
                  {parseFloat(amountReceived) >= total && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                      <p className="text-xs text-gray-500">Cambio</p>
                      <p className="text-2xl font-semibold">${(parseFloat(amountReceived) - total).toFixed(2)}</p>
                    </div>
                  )}
                </>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowCheckout(false)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button onClick={completeSale} disabled={paymentMethod === 'efectivo' && parseFloat(amountReceived || '0') < total} className="flex-1 py-2 bg-gray-900 text-white rounded-md text-sm font-medium disabled:bg-gray-300">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inventory Component
function Inventory() {
  const { products, addProduct, deleteProduct } = useData();
  const { success } = useAlert();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', barcode: '', category: '', price: 0, cost: 0, stock: 0, minStock: 5, description: '' });

  const filtered = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct(form);
    success('Producto creado');
    setShowModal(false);
    setForm({ name: '', barcode: '', category: '', price: 0, cost: 0, stock: 0, minStock: 5, description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md" />
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Producto</th>
              <th className="text-left px-3 py-2 font-medium text-gray-600">Código</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">Precio</th>
              <th className="text-right px-3 py-2 font-medium text-gray-600">Stock</th>
              <th className="text-center px-3 py-2 font-medium text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product: any) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{product.name}</td>
                <td className="px-3 py-2 text-gray-600 font-mono">{product.barcode}</td>
                <td className="px-3 py-2 text-right">${product.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs ${product.stock <= product.minStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{product.stock}</span>
                </td>
                <td className="px-3 py-2 text-center">
                  <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:bg-red-50 rounded p-1">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Producto</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="text" placeholder="Código" value={form.barcode} onChange={e => setForm({...form, barcode: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="text" placeholder="Categoría" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Precio" value={form.price} onChange={e => setForm({...form, price: parseFloat(e.target.value) || 0})} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                <input type="number" placeholder="Costo" value={form.cost} onChange={e => setForm({...form, cost: parseFloat(e.target.value) || 0})} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                <input type="number" placeholder="Stock" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value) || 0})} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                <input type="number" placeholder="Mínimo" value={form.minStock} onChange={e => setForm({...form, minStock: parseInt(e.target.value) || 0})} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Sales Component
function Sales() {
  const { sales } = useData();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Ventas</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">ID</th>
              <th className="text-left px-3 py-2">Fecha</th>
              <th className="text-left px-3 py-2">Cajero</th>
              <th className="text-right px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale: any) => (
              <tr key={sale.id} className="border-b border-gray-100">
                <td className="px-3 py-2 font-mono">#{sale.id.slice(-6)}</td>
                <td className="px-3 py-2">{new Date(sale.date).toLocaleString()}</td>
                <td className="px-3 py-2">{sale.cashier}</td>
                <td className="px-3 py-2 text-right font-semibold text-green-600">${sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users Component
function UsersPage() {
  const { users, addUser, deleteUser } = useAuth();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '', role: 'vendedor' as 'admin' | 'vendedor' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...form, active: true });
    success('Usuario creado');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u: any) => (
          <div key={u.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">{u.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm">{u.name}</p>
                  <p className="text-xs text-gray-500">@{u.username}</p>
                </div>
              </div>
              <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:bg-red-50 rounded p-1 text-xs">×</button>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-gray-900 text-white' : 'bg-gray-200'}`}>{u.role}</span>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Usuario</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="text" placeholder="Usuario" value={form.username} onChange={e => setForm({...form, username: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value as any})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                <option value="vendedor">Vendedor</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings Component
function Settings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Configuración</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Configuración del sistema</p>
      </div>
    </div>
  );
}

// Customers Component
function Customers() {
  const { customers, addCustomer, deleteCustomer } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', discount: 0, notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(form);
    success('Cliente creado');
    setShowModal(false);
    setForm({ name: '', phone: '', email: '', address: '', discount: 0, notes: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Clientes</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((customer: any) => (
          <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold">{customer.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm">{customer.name}</p>
                  <p className="text-xs text-gray-500">{customer.phone}</p>
                </div>
              </div>
              <button onClick={() => { deleteCustomer(customer.id); success('Cliente eliminado'); }} className="text-red-600 hover:bg-red-50 rounded p-1 text-xs">×</button>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {customer.email && <p>{customer.email}</p>}
              {customer.address && <p>{customer.address}</p>}
            </div>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="tel" placeholder="Teléfono" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
              <input type="text" placeholder="Dirección" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// CreditAccounts Component
function CreditAccounts() {
  const { creditAccounts, customers, addCreditAccount } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c: any) => c.id === form.customerId);
    if (customer) {
      addCreditAccount({ customerId: form.customerId, customerName: customer.name, totalAmount: form.totalAmount, dueDate: form.dueDate, status: 'pending' });
      success('Cuenta creada');
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Cuentas por Cobrar</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nueva</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">Cliente</th>
              <th className="text-right px-3 py-2">Total</th>
              <th className="text-right px-3 py-2">Pagado</th>
              <th className="text-right px-3 py-2">Restante</th>
              <th className="text-left px-3 py-2">Vencimiento</th>
              <th className="text-left px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {creditAccounts.map((account: any) => (
              <tr key={account.id} className="border-b border-gray-100">
                <td className="px-3 py-2 font-medium">{account.customerName}</td>
                <td className="px-3 py-2 text-right">${account.totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-green-600">${account.paidAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${account.remainingAmount.toFixed(2)}</td>
                <td className="px-3 py-2">{new Date(account.dueDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${account.status === 'paid' ? 'bg-green-100 text-green-700' : account.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>{account.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nueva Cuenta</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required>
                <option value="">Seleccionar cliente</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Monto" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Layaways Component
function Layaways() {
  const { layaways, customers, addLayaway } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c: any) => c.id === form.customerId);
    if (customer) {
      addLayaway({ customerId: form.customerId, customerName: customer.name, totalAmount: form.totalAmount, dueDate: form.dueDate, status: 'active' });
      success('Apartado creado');
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Apartados</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">Cliente</th>
              <th className="text-right px-3 py-2">Total</th>
              <th className="text-right px-3 py-2">Pagado</th>
              <th className="text-right px-3 py-2">Restante</th>
              <th className="text-left px-3 py-2">Vencimiento</th>
              <th className="text-left px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {layaways.map((layaway: any) => (
              <tr key={layaway.id} className="border-b border-gray-100">
                <td className="px-3 py-2 font-medium">{layaway.customerName}</td>
                <td className="px-3 py-2 text-right">${layaway.totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-green-600">${layaway.paidAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${layaway.remainingAmount.toFixed(2)}</td>
                <td className="px-3 py-2">{new Date(layaway.dueDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${layaway.status === 'completed' ? 'bg-green-100 text-green-700' : layaway.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100'}`}>{layaway.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Apartado</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <select value={form.customerId} onChange={e => setForm({...form, customerId: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required>
                <option value="">Seleccionar cliente</option>
                {customers.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Monto" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Returns Component
function Returns() {
  const { returns } = useExtended();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Devoluciones</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">ID</th>
              <th className="text-left px-3 py-2">Fecha</th>
              <th className="text-left px-3 py-2">Venta Original</th>
              <th className="text-right px-3 py-2">Total</th>
              <th className="text-left px-3 py-2">Razón</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((ret: any) => (
              <tr key={ret.id} className="border-b border-gray-100">
                <td className="px-3 py-2 font-mono">#{ret.id.slice(-6)}</td>
                <td className="px-3 py-2">{new Date(ret.date).toLocaleDateString()}</td>
                <td className="px-3 py-2 font-mono">#{ret.originalSaleId.slice(-6)}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${ret.totalRefund.toFixed(2)}</td>
                <td className="px-3 py-2">{ret.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// AdvancedReports Component
function AdvancedReports() {
  const { sales, products } = useData();
  const totalRevenue = sales.reduce((acc: number, s: any) => acc + s.total, 0);
  const totalCost = sales.reduce((acc: number, s: any) => acc + s.items.reduce((itemAcc: number, item: any) => {
    const product = products.find((p: any) => p.id === item.productId);
    return itemAcc + (product?.cost || 0) * item.quantity;
  }, 0), 0);
  const profit = totalRevenue - totalCost;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Reportes Avanzados</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Ingresos Totales</p>
          <p className="text-2xl font-semibold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Costos Totales</p>
          <p className="text-2xl font-semibold text-red-600">${totalCost.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Ganancia</p>
          <p className="text-2xl font-semibold text-blue-600">${profit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

// Kits Component
function Kits() {
  const { kits, addKit, deleteKit } = useKits();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', items: [], kitPrice: 0, originalPrice: 0, discount: 0, discountPercentage: 0, active: true });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addKit(form);
    success('Kit creado');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Kits</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kits.map((kit: any) => (
          <div key={kit.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-sm">{kit.name}</p>
            <p className="text-xs text-gray-500">{kit.description}</p>
            <p className="text-lg font-semibold text-purple-600 mt-2">${kit.kitPrice.toFixed(2)}</p>
            <button onClick={() => { deleteKit(kit.id); success('Kit eliminado'); }} className="mt-2 text-red-600 text-xs hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Kit</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="text" placeholder="Descripción" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
              <input type="number" placeholder="Precio" value={form.kitPrice} onChange={e => setForm({...form, kitPrice: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// CashRegister Component
function CashRegister() {
  const { sales } = useData();
  const todaySales = sales.filter((s: any) => new Date(s.date).toDateString() === new Date().toDateString());
  const totalSales = todaySales.reduce((acc: number, s: any) => acc + s.total, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Corte de Caja</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Ventas hoy</p>
            <p className="text-2xl font-semibold">{todaySales.length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Total vendido</p>
            <p className="text-2xl font-semibold text-green-600">${totalSales.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Efectivo</p>
            <p className="text-2xl font-semibold">${todaySales.filter((s: any) => s.paymentMethod === 'efectivo').reduce((acc: number, s: any) => acc + s.total, 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Adjustments Component
function Adjustments() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Ajustes de Inventario</h2>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">Registro de movimientos de inventario</p>
      </div>
    </div>
  );
}

// Promotions Component
function Promotions() {
  const { promotions, addPromotion, deletePromotion } = usePromotions();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'percentage', value: 0, active: true, startDate: '', endDate: '', description: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion({ ...form, startDate: new Date(form.startDate).toISOString(), endDate: new Date(form.endDate).toISOString() });
    success('Promoción creada');
    setShowModal(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Promociones</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nueva</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo: any) => (
          <div key={promo.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-semibold text-sm">{promo.name}</p>
            <p className="text-xs text-gray-500">{promo.type}</p>
            <p className="text-lg font-semibold mt-2">{promo.type === 'percentage' ? `${promo.value}%` : `$${promo.value}`}</p>
            <button onClick={() => { deletePromotion(promo.id); success('Promoción eliminada'); }} className="mt-2 text-red-600 text-xs hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nueva Promoción</h3>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                <option value="percentage">Porcentaje</option>
                <option value="fixed">Monto Fijo</option>
              </select>
              <input type="number" placeholder="Valor" value={form.value} onChange={e => setForm({...form, value: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// App Content Component
function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('pos');

  if (!user) return <Login />;

  const effectivePage = user.role === 'vendedor' ? 'pos' : currentPage;

  const renderPage = () => {
    switch (effectivePage) {
      case 'dashboard': return <Dashboard />;
      case 'inventory': return <Inventory />;
      case 'pos': return <POS />;
      case 'sales': return <Sales />;
      case 'users': return <UsersPage />;
      case 'cash-register': return <CashRegister />;
      case 'adjustments': return <Adjustments />;
      case 'settings': return <Settings />;
      case 'promotions': return <Promotions />;
      case 'customers': return <Customers />;
      case 'credit-accounts': return <CreditAccounts />;
      case 'layaways': return <Layaways />;
      case 'returns': return <Returns />;
      case 'advanced-reports': return <AdvancedReports />;
      case 'kits': return <Kits />;
      default: return <POS />;
    }
  };

  return (
    <Layout currentPage={effectivePage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

// Main App Component
export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AlertProvider>
          <ConfigProvider>
            <ExtendedProvider>
              <KitsProvider>
                <PromotionsProvider>
                  <AppContent />
                </PromotionsProvider>
              </KitsProvider>
            </ExtendedProvider>
          </ConfigProvider>
        </AlertProvider>
      </DataProvider>
    </AuthProvider>
  );
}
