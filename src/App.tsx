import { useState, useRef, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { AlertProvider, useAlert } from './context/AlertContext';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { ExtendedProvider, useExtended } from './context/ExtendedContext';
import { KitsProvider, useKits } from './context/KitsContext';
import { PromotionsProvider, usePromotions } from './context/PromotionsContext';
import { Product, Kit } from './types';

// ============ LAYOUT ============
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

// ============ LOGIN ============
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

// ============ DASHBOARD ============
function Dashboard() {
  const { products, sales } = useData();
  const { user } = useAuth();
  const { creditAccounts, layaways } = useExtended();

  const totalProducts = products.length;
  const lowStockProducts = products.filter((p: Product) => p.stock <= p.minStock);
  const totalSales = sales.length;
  const todaySales = sales.filter((s: any) => new Date(s.date).toDateString() === new Date().toDateString());
  const todayRevenue = todaySales.reduce((acc: number, s: any) => acc + s.total, 0);
  const totalRevenue = sales.reduce((acc: number, s: any) => acc + s.total, 0);

  const overdueAccounts = creditAccounts.filter((a: any) => a.status === 'overdue' || (a.status !== 'paid' && new Date(a.dueDate) < new Date()));
  const expiringLayaways = layaways.filter((l: any) => {
    const dueDate = new Date(l.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return l.status === 'active' && diffDays <= 7 && diffDays >= 0;
  });

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
            {lowStockProducts.slice(0, 6).map((product: Product) => (
              <div key={product.id} className="text-xs">
                <p className="font-medium">{product.name}</p>
                <p className="text-gray-500">{product.stock} / {product.minStock}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {overdueAccounts.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Cuentas vencidas</h3>
          <p className="text-xs text-gray-600 mb-2">{overdueAccounts.length} cuentas han vencido</p>
          <div className="grid grid-cols-2 gap-2">
            {overdueAccounts.slice(0, 4).map((account: any) => (
              <div key={account.id} className="text-xs">
                <p className="font-medium">{account.customerName}</p>
                <p className="text-gray-500">${account.remainingAmount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {expiringLayaways.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium mb-2">Apartados por vencer</h3>
          <p className="text-xs text-gray-600 mb-2">{expiringLayaways.length} apartados vencen pronto</p>
          <div className="grid grid-cols-2 gap-2">
            {expiringLayaways.slice(0, 4).map((layaway: any) => {
              const dueDate = new Date(layaway.dueDate);
              const today = new Date();
              const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              return (
                <div key={layaway.id} className="text-xs">
                  <p className="font-medium">{layaway.customerName}</p>
                  <p className="text-gray-500">${layaway.remainingAmount.toFixed(2)} • {diffDays}d</p>
                </div>
              );
            })}
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

// ============ POS COMPLETO ============
function POS() {
  const { products, addSale, updateProduct } = useData();
  const { user, users } = useAuth();
  const { success, error: showError } = useAlert();
  const { kits, canAssembleKit, getKitAvailability } = useKits();
  const { validateCoupon, useCoupon } = usePromotions();
  const [cart, setCart] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('efectivo');
  const [amountReceived, setAmountReceived] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [saleType, setSaleType] = useState<'unit' | 'case'>('unit');
  const [showKits, setShowKits] = useState(false);
  const [consumoPropio, setConsumoPropio] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [lastSale, setLastSale] = useState<any>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const scanBuffer = useRef('');
  const scanTimer = useRef<any>(null);

  const filteredProducts = products.filter((p: Product) => {
    const searchLower = search.toLowerCase().trim();
    const matchesSearch = !searchLower || p.name.toLowerCase().includes(searchLower) || p.barcode.toLowerCase().includes(searchLower);
    const hasStock = saleType === 'case' ? (p.stockCases && p.stockCases > 0) || (p.stock >= (p.unitsPerCase || 1)) : p.stock > 0;
    const hasPrice = saleType === 'case' ? (p.priceCase && p.unitsPerCase) : true;
    return matchesSearch && hasStock && hasPrice;
  });

  const subtotal = cart.reduce((acc, item) => {
    if (item.isKit) return acc + item.product.price * item.quantity;
    const price = consumoPropio ? (item.saleType === 'case' ? (item.product.costCase || item.product.cost * (item.product.unitsPerCase || 1)) : item.product.cost) : (item.saleType === 'case' ? (item.product.priceCase || item.product.price) : item.product.price);
    return acc + price * item.quantity;
  }, 0);

  const couponDiscount = appliedCoupon ? appliedCoupon.discount : 0;
  const total = Math.max(0, subtotal - couponDiscount);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (showCheckout || showTicketModal || showAuthModal || showCouponModal) return;
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) return;
      
      if (e.key === 'Enter' && scanBuffer.current.length >= 3) {
        e.preventDefault();
        const barcode = scanBuffer.current;
        scanBuffer.current = '';
        const product = products.find((p: Product) => p.barcode === barcode);
        if (product) addToCart(product);
        return;
      }
      
      if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
        if (scanTimer.current) clearTimeout(scanTimer.current);
        scanBuffer.current += e.key;
        scanTimer.current = setTimeout(() => { scanBuffer.current = ''; }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showCheckout, showTicketModal, showAuthModal, showCouponModal, products]);

  const addToCart = (product: Product) => {
    if (saleType === 'case' && (!product.priceCase || !product.unitsPerCase)) {
      showError('Este producto no tiene precio por caja');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.saleType === saleType && !item.isKit);
      if (existing) {
        return prev.map(item => item.product.id === product.id && item.saleType === saleType && !item.isKit ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, saleType }];
    });
    setSearch('');
    searchRef.current?.focus();
  };

  const addKitToCart = (kit: Kit) => {
    if (!canAssembleKit(kit, 1, products)) {
      showError('No hay suficiente inventario');
      return;
    }
    const kitProduct: Product = {
      id: `kit-${kit.id}`,
      name: kit.name,
      barcode: '',
      category: 'Kits',
      price: kit.kitPrice,
      cost: 0,
      stock: getKitAvailability(kit, products),
      minStock: 0,
      description: kit.description,
      createdAt: new Date().toISOString(),
    };
    setCart(prev => [...prev, { product: kitProduct, quantity: 1, saleType: 'unit', isKit: true, kitId: kit.id }]);
  };

  const updateQuantity = (productId: string, delta: number, saleType: 'unit' | 'case') => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.saleType === saleType) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (productId: string, saleType: 'unit' | 'case') => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.saleType === saleType)));
  };

  const clearCart = () => {
    if (confirm('¿Vaciar carrito?')) setCart([]);
  };

  const handleConsumoPropioToggle = () => {
    if (user?.role === 'admin') {
      setConsumoPropio(!consumoPropio);
    } else {
      setShowAuthModal(true);
    }
  };

  const verifyAdminPassword = () => {
    const admin = users.find(u => u.role === 'admin');
    if (admin && admin.password === adminPassword) {
      setConsumoPropio(true);
      setShowAuthModal(false);
      setAdminPassword('');
    } else {
      showError('Contraseña incorrecta');
      setAdminPassword('');
    }
  };

  const openCashDrawer = () => {
    const cmd = '\x1B\x70\x00\x19\xFA';
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    if (iframe.contentDocument) {
      iframe.contentDocument.open();
      iframe.contentDocument.write(`<html><body>${cmd}</body></html>`);
      iframe.contentDocument.close();
      setTimeout(() => { iframe.contentWindow?.print(); document.body.removeChild(iframe); }, 100);
    }
  };

  const completeSale = () => {
    if (paymentMethod === 'efectivo' && parseFloat(amountReceived || '0') < total) return;
    const saleItems = cart.map(item => {
      const price = item.isKit ? item.product.price : consumoPropio ? (item.saleType === 'case' ? (item.product.costCase || item.product.cost * (item.product.unitsPerCase || 1)) : item.product.cost) : (item.saleType === 'case' ? (item.product.priceCase || item.product.price) : item.product.price);
      return { productId: item.product.id, productName: item.product.name, quantity: item.quantity, price, subtotal: price * item.quantity, saleType: item.saleType };
    });
    const newSale = { items: saleItems, total, subtotal, tax: 0, discount: couponDiscount, paymentMethod, cashier: user?.name || 'Desconocido' };
    addSale(newSale);
    cart.forEach(item => {
      if (item.isKit && item.kitId) {
        const kit = kits.find(k => k.id === item.kitId);
        if (kit) {
          kit.items.forEach((kitItem: any) => {
            const product = products.find(p => p.id === kitItem.productId);
            if (product) updateProduct(product.id, { stock: Math.max(0, product.stock - (kitItem.quantity * item.quantity)) });
          });
        }
      }
    });
    setLastSale({ ...newSale, id: Date.now().toString(), date: new Date().toISOString() });
    success(`Venta completada: $${total.toFixed(2)}`);
    setCart([]);
    setAmountReceived('');
    setAppliedCoupon(null);
    setShowCheckout(false);
    setShowTicketModal(true);
    if (paymentMethod === 'efectivo') openCashDrawer();
  };

  const printTicket = () => {
    if (!lastSale) return;
    const ticketWindow = window.open('', '_blank', 'width=300,height=600');
    if (!ticketWindow) return;
    const html = `<!DOCTYPE html><html><head><title>Ticket</title><style>@page{size:58mm auto;margin:0}*{margin:0;padding:0;box-sizing:border-box;color:#000!important}body{font-family:'Courier New',monospace;width:58mm;padding:4mm;font-size:12px;font-weight:600}.header{text-align:center;margin-bottom:3mm}.header h1{font-size:16px;font-weight:900}.divider{border-top:2px dashed #000;margin:3mm 0}.item{margin:2mm 0}.item-name{font-weight:900;font-size:11px}.item-detail{display:flex;justify-content:space-between;font-size:10px;padding-left:2mm}.total-row{display:flex;justify-content:space-between;margin:1.5mm 0}.total-row.grand{font-size:16px;font-weight:900;border-top:2px solid #000;padding-top:2mm;margin-top:2mm}.footer{text-align:center;margin-top:3mm;font-size:10px}</style></head><body><div class="header"><h1>DEPÓSITO SAN JUDITAS</h1><p>Ticket de Venta</p></div><div class="divider"></div><p><strong>Ticket:</strong> #${lastSale.id.slice(-6)}</p><p><strong>Fecha:</strong> ${new Date(lastSale.date).toLocaleString('es-MX')}</p><p><strong>Cajero:</strong> ${lastSale.cashier}</p><div class="divider"></div>${lastSale.items.map((item: any) => `<div class="item"><div class="item-name">${item.productName} ${item.saleType === 'case' ? '(Caja)' : ''}</div><div class="item-detail"><span>${item.quantity} x $${item.price.toFixed(2)}</span><span>$${item.subtotal.toFixed(2)}</span></div></div>`).join('')}<div class="divider"></div><div class="total-row"><span>Subtotal:</span><span>$${lastSale.subtotal.toFixed(2)}</span></div>${lastSale.discount > 0 ? `<div class="total-row"><span>Descuento:</span><span>-$${lastSale.discount.toFixed(2)}</span></div>` : ''}<div class="total-row grand"><span>TOTAL:</span><span>$${lastSale.total.toFixed(2)}</span></div>${lastSale.paymentMethod === 'efectivo' ? `<div class="total-row"><span>Recibido:</span><span>$${parseFloat(amountReceived || '0').toFixed(2)}</span></div><div class="total-row"><span>Cambio:</span><span>$${(parseFloat(amountReceived || '0') - lastSale.total).toFixed(2)}</span></div>` : ''}<div class="divider"></div><div class="footer"><p>¡Gracias por su compra!</p><p>--- FIN DEL TICKET ---</p></div></body></html>`;
    ticketWindow.document.write(html);
    ticketWindow.document.close();
    setTimeout(() => { ticketWindow.print(); ticketWindow.close(); }, 250);
  };

  const applyCoupon = () => {
    const validation = validateCoupon(couponCode, subtotal);
    if (!validation.valid) {
      showError(validation.message);
      return;
    }
    const coupon = validation.coupon!;
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = subtotal * (coupon.value / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    } else {
      discount = coupon.value;
    }
    setAppliedCoupon({ code: coupon.code, discount });
    useCoupon(coupon.code);
    setShowCouponModal(false);
    setCouponCode('');
    success(`Cupón aplicado: -$${discount.toFixed(2)}`);
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-120px)]">
      <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input ref={searchRef} type="text" placeholder="Buscar o escanear..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-3 pr-3 py-2 bg-white border border-gray-200 rounded-md text-sm" autoFocus />
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-md">
              <div className="text-xs text-gray-500">Productos</div>
              <div className="text-sm font-semibold">{filteredProducts.length}</div>
            </div>
            <button onClick={handleConsumoPropioToggle} className={`px-3 py-2 rounded-md text-xs font-medium ${consumoPropio ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>Consumo Propio</button>
          </div>
          {consumoPropio && <div className="mt-2 p-2 bg-gray-100 border border-gray-200 rounded-md"><p className="text-xs text-gray-700">Modo Consumo Propio - Precios de Costo</p></div>}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-600">Tipo:</span>
            <button onClick={() => setSaleType('unit')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${saleType === 'unit' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>Unidad</button>
            <button onClick={() => setSaleType('case')} className={`px-3 py-1.5 rounded-md text-xs font-medium ${saleType === 'case' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>Caja</button>
            <button onClick={() => setShowKits(!showKits)} className={`px-3 py-1.5 rounded-md text-xs font-medium ${showKits ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'}`}>Kits</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {showKits ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {kits.filter(k => k.active).map(kit => (
                <button key={kit.id} onClick={() => addKitToCart(kit)} className="p-4 border-2 border-gray-300 rounded-md hover:border-gray-500 text-left">
                  <p className="font-bold text-sm">{kit.name}</p>
                  <p className="text-xs text-gray-500">{kit.items.length} productos</p>
                  <p className="text-lg font-bold text-gray-900 mt-2">${kit.kitPrice.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 line-through">${kit.originalPrice.toFixed(2)}</p>
                </button>
              ))}
              {kits.length === 0 && <div className="col-span-full text-center py-12 text-gray-400"><p>No hay kits disponibles</p></div>}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {filteredProducts.map((product: Product) => (
                <button key={product.id} onClick={() => addToCart(product)} className={`p-3 border rounded-md hover:border-gray-400 transition text-left ${consumoPropio ? 'border-gray-300 bg-gray-50' : 'border-gray-200 bg-white'}`}>
                  {product.image ? <img src={product.image} alt={product.name} className="w-full h-16 object-cover rounded mb-2" /> : <div className={`w-full h-16 rounded flex items-center justify-center mb-2 ${consumoPropio ? 'bg-gray-200' : 'bg-gray-900'}`}><span className="text-white text-xs">IMG</span></div>}
                  <p className="font-medium text-xs truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.category}</p>
                  {saleType === 'case' && product.priceCase ? (<><p className="text-sm font-semibold mt-1">${product.priceCase.toFixed(2)}</p><p className="text-xs text-gray-500">caja ({product.unitsPerCase})</p></>) : consumoPropio ? (<><p className="text-sm font-semibold mt-1">${product.cost.toFixed(2)}</p><p className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</p></>) : (<p className="text-sm font-semibold mt-1">${product.price.toFixed(2)}</p>)}
                  <span className="text-xs text-gray-500 mt-1">×{saleType === 'case' ? (product.stockCases || Math.floor(product.stock / (product.unitsPerCase || 1))) : product.stock}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="w-96 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm">Carrito</h3>
              <p className="text-xs text-gray-300">{totalItems} productos</p>
            </div>
            {cart.length > 0 && <button onClick={clearCart} className="px-2 py-1 bg-white/20 rounded text-xs">Vaciar</button>}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {cart.length === 0 ? (<div className="text-center py-16 text-gray-400"><p className="text-xs">Carrito vacío</p></div>) : (
            <div className="space-y-2">
              {cart.map(item => {
                const price = consumoPropio ? (item.saleType === 'case' ? (item.product.costCase || item.product.cost * (item.product.unitsPerCase || 1)) : item.product.cost) : (item.saleType === 'case' ? (item.product.priceCase || item.product.price) : item.product.price);
                return (
                  <div key={`${item.product.id}-${item.saleType}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                    {item.product.image ? <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded" /> : <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center"><span className="text-xs text-gray-400">IMG</span></div>}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs truncate">{item.product.name}<span className={`ml-1 text-xs px-1 rounded ${item.saleType === 'case' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200'}`}>{item.saleType === 'case' ? 'Caja' : 'Und'}</span></p>
                      <p className="text-xs text-gray-500">${price.toFixed(2)} {item.saleType === 'case' ? 'caja' : 'c/u'}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.product.id, -1, item.saleType)} className="w-6 h-6 bg-white border rounded text-xs">-</button>
                      <span className="w-8 text-center font-bold text-xs">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1, item.saleType)} className="w-6 h-6 bg-white border rounded text-xs">+</button>
                    </div>
                    <p className="font-bold text-xs w-16 text-right">${(price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeFromCart(item.product.id, item.saleType)} className="p-1 text-red-500 text-xs">×</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="border-t border-gray-200 p-3 space-y-2">
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">Método de pago</p>
            <div className="grid grid-cols-3 gap-1">
              <button onClick={() => setPaymentMethod('efectivo')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'efectivo' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Efectivo</button>
              <button onClick={() => setPaymentMethod('tarjeta')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'tarjeta' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Tarjeta</button>
              <button onClick={() => setPaymentMethod('transferencia')} className={`p-2 rounded-md border text-xs ${paymentMethod === 'transferencia' ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-200'}`}>Transf</button>
            </div>
          </div>
          {!consumoPropio && cart.length > 0 && (
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{appliedCoupon.code}</span>
                    <span className="text-xs text-gray-600">-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                  <button onClick={() => setAppliedCoupon(null)} className="text-red-500 text-xs">×</button>
                </div>
              ) : (
                <button onClick={() => setShowCouponModal(true)} className="w-full p-2 border border-dashed border-gray-300 rounded-md text-xs text-gray-600 hover:border-gray-400">Aplicar cupón</button>
              )}
            </div>
          )}
          <div className="space-y-1 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({totalItems} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Descuento</span>
                <span>-${couponDiscount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-900 text-white rounded-md p-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">TOTAL</span>
              <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={() => setShowCheckout(true)} disabled={cart.length === 0} className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:bg-gray-300">Cobrar</button>
        </div>
      </div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white rounded-t-lg">
              <p className="text-xs text-gray-300">Total a cobrar</p>
              <p className="text-3xl font-bold">${total.toFixed(2)}</p>
            </div>
            <div className="p-4 space-y-3">
              {paymentMethod === 'efectivo' ? (
                <>
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <p className="text-xs text-gray-600 mb-1">¿Con cuánto paga?</p>
                    <input type="text" value={amountReceived} onChange={e => setAmountReceived(e.target.value)} className="w-full text-2xl font-bold bg-transparent outline-none" placeholder="$0.00" autoFocus />
                  </div>
                  {amountReceived && parseFloat(amountReceived) >= total && (
                    <div className="bg-gray-50 border border-gray-200 rounded-md p-3 text-center">
                      <p className="text-xs text-gray-600">Cambio</p>
                      <p className="text-3xl font-bold">${(parseFloat(amountReceived) - total).toFixed(2)}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xl font-bold">Pago con {paymentMethod}</p>
                </div>
              )}
              <div className="flex gap-2">
                <button onClick={() => setShowCheckout(false)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button onClick={completeSale} disabled={paymentMethod === 'efectivo' && parseFloat(amountReceived || '0') < total} className="flex-1 py-2 bg-gray-900 text-white rounded-md text-sm font-medium disabled:bg-gray-300">Confirmar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTicketModal && lastSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white text-center rounded-t-lg">
              <h3 className="text-lg font-bold">Venta Exitosa</h3>
              <p className="text-xs text-green-100">Ticket #{lastSale.id.slice(-6)}</p>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={printTicket} className="w-full py-2 bg-gray-900 text-white rounded-md text-sm font-bold flex items-center justify-center gap-2">Imprimir Ticket</button>
              <button onClick={() => setShowTicketModal(false)} className="w-full py-2 bg-gray-200 rounded-md text-sm font-semibold">Continuar Vendiendo</button>
            </div>
          </div>
        </div>
      )}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 text-white rounded-t-lg">
              <h3 className="text-sm font-bold">Aplicar Cupón</h3>
            </div>
            <div className="p-4 space-y-3">
              <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value.toUpperCase())} onKeyDown={e => e.key === 'Enter' && applyCoupon()} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm font-mono uppercase" placeholder="CÓDIGO" autoFocus />
              <div className="flex gap-2">
                <button onClick={() => setShowCouponModal(false)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button onClick={applyCoupon} disabled={!couponCode} className="flex-1 py-2 bg-gray-900 text-white rounded-md text-sm font-bold disabled:bg-gray-300">Aplicar</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 text-white rounded-t-lg">
              <h3 className="text-sm font-bold">Autorización</h3>
              <p className="text-xs text-orange-100">Contraseña del administrador</p>
            </div>
            <div className="p-4 space-y-3">
              <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && verifyAdminPassword()} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" placeholder="Contraseña" autoFocus />
              <div className="flex gap-2">
                <button onClick={() => setShowAuthModal(false)} className="flex-1 py-2 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button onClick={verifyAdminPassword} className="flex-1 py-2 bg-orange-600 text-white rounded-md text-sm font-bold">Autorizar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ INVENTORY ============
function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const { success, showError } = useAlert();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const categories = [...new Set(products.map((p: Product) => p.category))];
  const lowStockProducts = products.filter((p: Product) => p.stock <= p.minStock);
  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

  const filtered = products.filter((p: Product) => {
    const searchLower = search.toLowerCase().trim();
    const matchSearch = !searchLower || p.name.toLowerCase().includes(searchLower) || p.barcode.toLowerCase().includes(searchLower) || p.category.toLowerCase().includes(searchLower);
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const [form, setForm] = useState({ name: '', barcode: '', category: '', price: 0, priceCase: 0, unitsPerCase: 0, cost: 0, costCase: 0, stock: 0, stockCases: 0, minStock: 5, description: '', image: '' });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) { showError('Archivo de imagen inválido'); return; }
      if (file.size > 2 * 1024 * 1024) { showError('La imagen no debe superar los 2MB'); return; }
      const reader = new FileReader();
      reader.onloadend = () => { setForm({ ...form, image: reader.result as string }); };
      reader.readAsDataURL(file);
    }
  };

  const openAdd = () => {
    setEditingProduct(null);
    setForm({ name: '', barcode: '', category: '', price: 0, priceCase: 0, unitsPerCase: 0, cost: 0, costCase: 0, stock: 0, stockCases: 0, minStock: 5, description: '', image: '' });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, barcode: product.barcode, category: product.category, price: product.price, priceCase: product.priceCase || 0, unitsPerCase: product.unitsPerCase || 0, cost: product.cost, costCase: product.costCase || 0, stock: product.stock, stockCases: product.stockCases || 0, minStock: product.minStock, description: product.description, image: product.image || '' });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, form);
      success('Producto actualizado');
    } else {
      addProduct(form);
      success('Producto creado');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este producto?')) {
      deleteProduct(id);
      success('Producto eliminado');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">Productos</p>
          <p className="text-2xl font-semibold">{products.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">Valor</p>
          <p className="text-2xl font-semibold">${totalValue.toFixed(0)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">Categorías</p>
          <p className="text-2xl font-semibold">{categories.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <p className="text-xs text-gray-500">Stock bajo</p>
          <p className="text-2xl font-semibold text-red-600">{lowStockProducts.length}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-2">
        <div className="flex gap-2 flex-1">
          <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md" />
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-md">
            <option value="">Todas</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">Imagen</th>
              <th className="text-left px-3 py-2">Producto</th>
              <th className="text-left px-3 py-2">Código</th>
              <th className="text-left px-3 py-2">Categoría</th>
              <th className="text-right px-3 py-2">Precio</th>
              <th className="text-right px-3 py-2">Caja</th>
              <th className="text-right px-3 py-2">Stock</th>
              <th className="text-center px-3 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(product => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2">
                  {product.image ? <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded border border-gray-200" /> : <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center"><span className="text-xs text-gray-400">IMG</span></div>}
                </td>
                <td className="px-3 py-2">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.description}</p>
                </td>
                <td className="px-3 py-2 text-gray-600 font-mono">{product.barcode}</td>
                <td className="px-3 py-2"><span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">{product.category}</span></td>
                <td className="px-3 py-2 text-right font-medium">${product.price.toFixed(2)}</td>
                <td className="px-3 py-2 text-right">{product.priceCase ? (<div><p className="font-medium text-blue-600">${product.priceCase.toFixed(2)}</p><p className="text-xs text-gray-500">{product.unitsPerCase} pzas</p></div>) : <span className="text-gray-400">-</span>}</td>
                <td className="px-3 py-2 text-right">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${product.stock === 0 ? 'bg-red-500 text-white' : product.stock <= product.minStock ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}`}>
                    {product.stock}{product.stock === 0 && ' AGOTADO'}{product.stock > 0 && product.stock <= product.minStock && ' BAJO'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => openEdit(product)} className="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Editar">✎</button>
                    <button onClick={() => handleDelete(product.id)} className="p-1 text-red-600 hover:bg-red-50 rounded" title="Eliminar">×</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-sm font-semibold">{editingProduct ? 'Editar' : 'Nuevo'} Producto</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Nombre</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Código de barras</label>
                  <input type="text" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Categoría</label>
                  <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Precio unidad</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Costo unidad</label>
                  <input type="number" step="0.01" min="0" value={form.cost} onChange={e => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Precio caja</label>
                  <input type="number" step="0.01" min="0" value={form.priceCase} onChange={e => setForm({ ...form, priceCase: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Unidades por caja</label>
                  <input type="number" min="0" value={form.unitsPerCase} onChange={e => setForm({ ...form, unitsPerCase: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stock unidades</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Stock mínimo</label>
                  <input type="number" min="0" value={form.minStock} onChange={e => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Descripción</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Imagen</label>
                  <div className="flex gap-3 items-start">
                    <div className="flex-1">
                      <input type="file" ref={imageInputRef} accept="image/*" onChange={handleImageUpload} className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-md" />
                      <p className="text-xs text-gray-500 mt-1">Máx 2MB. JPG, PNG, GIF</p>
                    </div>
                    {form.image && (
                      <div className="relative">
                        <img src={form.image} alt="Vista previa" className="w-20 h-20 object-cover rounded-md border-2" />
                        <button type="button" onClick={() => setForm({ ...form, image: '' })} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">×</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-3 py-2 border border-gray-200 rounded-md text-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">{editingProduct ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ SALES ============
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
              <th className="text-left px-3 py-2">Método</th>
              <th className="text-right px-3 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-mono">#{sale.id.slice(-6)}</td>
                <td className="px-3 py-2">{new Date(sale.date).toLocaleString()}</td>
                <td className="px-3 py-2">{sale.cashier}</td>
                <td className="px-3 py-2 capitalize">{sale.paymentMethod}</td>
                <td className="px-3 py-2 text-right font-semibold text-green-600">${sale.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ USERS ============
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
    setForm({ username: '', password: '', name: '', role: 'vendedor' });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Usuarios</h2>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(u => (
          <div key={u.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-xl ${u.role === 'admin' ? 'bg-gradient-to-br from-gray-700 to-black' : 'bg-gradient-to-br from-gray-400 to-gray-600'}`}>{u.name.charAt(0)}</div>
                <div>
                  <p className="font-bold text-sm">{u.name}</p>
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

// ============ SETTINGS ============
function Settings() {
  const { company, updateCompany } = useConfig();
  const { success } = useAlert();
  const [form, setForm] = useState(company);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateCompany(form);
    success('Configuración guardada');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-3">Datos de la Empresa</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Nombre</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">RFC</label>
              <input type="text" value={form.rfc} onChange={e => setForm({ ...form, rfc: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-gray-600 mb-1">Dirección</label>
              <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Teléfono</label>
              <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
            </div>
          </div>
          <button type="submit" className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-900 text-white rounded-md hover:bg-gray-800 font-medium">Guardar</button>
          {saved && <span className="ml-2 text-xs text-green-600">✓ Guardado</span>}
        </form>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold mb-3">Impuestos</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">IVA (%)</label>
            <input type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Moneda</label>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
              <option value="MXN">MXN</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ CUSTOMERS ============
function Customers() {
  const { customers, addCustomer, deleteCustomer } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', discount: 0, notes: '' });

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(form);
    success('Cliente creado');
    setShowModal(false);
    setForm({ name: '', phone: '', email: '', address: '', discount: 0, notes: '' });
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Eliminar este cliente?')) {
      deleteCustomer(id);
      success('Cliente eliminado');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Clientes</p>
          <p className="text-2xl font-semibold">{customers.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Con Descuento</p>
          <p className="text-2xl font-semibold text-green-600">{customers.filter(c => c.discount > 0).length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Puntos Totales</p>
          <p className="text-2xl font-semibold">{customers.reduce((acc, c) => acc + c.points, 0)}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md" />
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCustomers.map(customer => (
          <div key={customer.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-black rounded-full flex items-center justify-center text-white font-bold">{customer.name.charAt(0)}</div>
                <div>
                  <p className="font-bold text-sm">{customer.name}</p>
                  {customer.discount > 0 && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{customer.discount}% desc.</span>}
                </div>
              </div>
              <button onClick={() => handleDelete(customer.id)} className="text-red-600 hover:bg-red-50 rounded p-1 text-xs">×</button>
            </div>
            <div className="space-y-1 text-xs text-gray-600">
              {customer.phone && <p>{customer.phone}</p>}
              {customer.email && <p>{customer.email}</p>}
              {customer.address && <p>{customer.address}</p>}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">Compras</p>
                <p className="font-bold">${customer.totalPurchases.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Puntos</p>
                <p className="font-bold">{customer.points}</p>
              </div>
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
              <input type="number" placeholder="Descuento %" value={form.discount} onChange={e => setForm({...form, discount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
              <textarea placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
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

// ============ CREDIT ACCOUNTS ============
function CreditAccounts() {
  const { creditAccounts, customers, addCreditAccount } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });

  const totalPending = creditAccounts.reduce((acc, a) => acc + a.remainingAmount, 0);
  const overdueAccounts = creditAccounts.filter(a => a.status === 'overdue' || (a.status !== 'paid' && new Date(a.dueDate) < new Date()));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === form.customerId);
    if (customer) {
      addCreditAccount({ customerId: form.customerId, customerName: customer.name, totalAmount: form.totalAmount, dueDate: form.dueDate, status: 'pending' });
      success('Cuenta creada');
      setShowModal(false);
      setForm({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'partial': return 'bg-blue-100 text-blue-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Pagada';
      case 'partial': return 'Parcial';
      case 'overdue': return 'Vencida';
      default: return 'Pendiente';
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Cuentas Activas</p>
          <p className="text-2xl font-semibold">{creditAccounts.filter(a => a.status !== 'paid').length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total por Cobrar</p>
          <p className="text-2xl font-semibold text-red-600">${totalPending.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Vencidas</p>
          <p className="text-2xl font-semibold text-orange-600">{overdueAccounts.length}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600">{creditAccounts.length} cuentas registradas</p>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nueva Cuenta</button>
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
            {creditAccounts.map(account => (
              <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{account.customerName}</td>
                <td className="px-3 py-2 text-right font-bold">${account.totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-green-600">${account.paidAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${account.remainingAmount.toFixed(2)}</td>
                <td className="px-3 py-2">{new Date(account.dueDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(account.status)}`}>{getStatusLabel(account.status)}</span>
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
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Monto" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <textarea placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
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

// ============ LAYAWAYS ============
function Layaways() {
  const { layaways, customers, addLayaway } = useExtended();
  const { success } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });

  const totalActive = layaways.filter(l => l.status === 'active').length;
  const totalPending = layaways.reduce((acc, l) => acc + l.remainingAmount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === form.customerId);
    if (customer) {
      addLayaway({ customerId: form.customerId, customerName: customer.name, totalAmount: form.totalAmount, dueDate: form.dueDate, status: 'active' });
      success('Apartado creado');
      setShowModal(false);
      setForm({ customerId: '', totalAmount: 0, dueDate: '', notes: '' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'cancelled': return 'bg-gray-100 text-gray-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Completado';
      case 'active': return 'Activo';
      case 'cancelled': return 'Cancelado';
      case 'expired': return 'Vencido';
      default: return status;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Apartados Activos</p>
          <p className="text-2xl font-semibold">{totalActive}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Pendiente</p>
          <p className="text-2xl font-semibold text-red-600">${totalPending.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Apartados</p>
          <p className="text-2xl font-semibold">{layaways.length}</p>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600">{layaways.length} apartados registrados</p>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo Apartado</button>
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
            {layaways.map(layaway => (
              <tr key={layaway.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-medium">{layaway.customerName}</td>
                <td className="px-3 py-2 text-right font-bold">${layaway.totalAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right text-green-600">${layaway.paidAmount.toFixed(2)}</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${layaway.remainingAmount.toFixed(2)}</td>
                <td className="px-3 py-2">{new Date(layaway.dueDate).toLocaleDateString()}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${getStatusColor(layaway.status)}`}>{getStatusLabel(layaway.status)}</span>
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
                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="number" placeholder="Monto" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: parseFloat(e.target.value) || 0})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <textarea placeholder="Notas" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
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

// ============ RETURNS ============
function Returns() {
  const { returns } = useExtended();
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Devoluciones</p>
          <p className="text-2xl font-semibold">{returns.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Reembolsado</p>
          <p className="text-2xl font-semibold text-red-600">${returns.reduce((acc, r) => acc + r.totalRefund, 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Este Mes</p>
          <p className="text-2xl font-semibold">{returns.filter(r => new Date(r.date).getMonth() === new Date().getMonth()).length}</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-2">ID</th>
              <th className="text-left px-3 py-2">Fecha</th>
              <th className="text-left px-3 py-2">Venta Original</th>
              <th className="text-left px-3 py-2">Productos</th>
              <th className="text-right px-3 py-2">Total</th>
              <th className="text-left px-3 py-2">Razón</th>
              <th className="text-left px-3 py-2">Método</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(ret => (
              <tr key={ret.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-3 py-2 font-mono">#{ret.id.slice(-6)}</td>
                <td className="px-3 py-2">{new Date(ret.date).toLocaleDateString()}</td>
                <td className="px-3 py-2 font-mono">#{ret.originalSaleId.slice(-6)}</td>
                <td className="px-3 py-2">{ret.items.length} items</td>
                <td className="px-3 py-2 text-right font-bold text-red-600">${ret.totalRefund.toFixed(2)}</td>
                <td className="px-3 py-2">{ret.reason}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">{ret.method === 'cash' ? 'Efectivo' : ret.method === 'credit' ? 'Crédito' : 'Nota'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ ADVANCED REPORTS ============
function AdvancedReports() {
  const { sales, products } = useData();
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredSales = sales.filter(s => {
    const saleDate = new Date(s.date);
    return saleDate >= new Date(startDate) && saleDate <= new Date(endDate + 'T23:59:59');
  });

  const totalSales = filteredSales.reduce((acc, s) => acc + s.total, 0);
  const totalCost = filteredSales.reduce((acc, s) => {
    return acc + s.items.reduce((itemAcc, item) => {
      const product = products.find(p => p.id === item.productId);
      return itemAcc + (product?.cost || 0) * item.quantity;
    }, 0);
  }, 0);
  const profit = totalSales - totalCost;
  const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Total Ventas</p>
          <p className="text-2xl font-semibold">${totalSales.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Transacciones</p>
          <p className="text-2xl font-semibold">{filteredSales.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Ganancia</p>
          <p className="text-2xl font-semibold text-green-600">${profit.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500">Margen</p>
          <p className="text-2xl font-semibold">{profitMargin.toFixed(1)}%</p>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex gap-3 items-end">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Fecha Inicio</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Fecha Fin</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="px-2 py-1.5 text-sm border border-gray-200 rounded-md" />
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-3">Resumen de Ganancias</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-600">Total Ventas</span>
            <span className="text-lg font-bold">${totalSales.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
            <span className="text-xs text-gray-600">Total Costos</span>
            <span className="text-lg font-bold text-red-600">${totalCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-md border-2 border-green-200">
            <span className="text-xs font-medium">Ganancia Neta</span>
            <span className="text-xl font-bold text-green-600">${profit.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-900 text-white rounded-md">
            <span className="text-xs">Margen de Ganancia</span>
            <span className="text-xl font-bold">{profitMargin.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ KITS ============
function Kits() {
  const { kits, addKit, updateKit, deleteKit } = useKits();
  const { products } = useData();
  const { success, showError } = useAlert();
  const [showModal, setShowModal] = useState(false);
  const [editingKit, setEditingKit] = useState<Kit | null>(null);
  const [form, setForm] = useState({ name: '', description: '', items: [] as any[], kitPrice: 0, active: true });

  const openAdd = () => {
    setEditingKit(null);
    setForm({ name: '', description: '', items: [], kitPrice: 0, active: true });
    setShowModal(true);
  };

  const openEdit = (kit: Kit) => {
    setEditingKit(kit);
    setForm({ name: kit.name, description: kit.description, items: kit.items, kitPrice: kit.kitPrice, active: kit.active });
    setShowModal(true);
  };

  const addItem = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const existingItem = form.items.find(item => item.productId === productId);
    if (existingItem) {
      setForm({ ...form, items: form.items.map(item => item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item) });
    } else {
      setForm({ ...form, items: [...form.items, { productId, productName: product.name, quantity, unitPrice: product.price }] });
    }
  };

  const removeItem = (productId: string) => {
    setForm({ ...form, items: form.items.filter(item => item.productId !== productId) });
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    setForm({ ...form, items: form.items.map(item => item.productId === productId ? { ...item, quantity } : item) });
  };

  const originalPrice = form.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discount = originalPrice - form.kitPrice;
  const discountPercentage = originalPrice > 0 ? (discount / originalPrice) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.items.length === 0) { showError('Agrega al menos un producto'); return; }
    if (form.kitPrice <= 0) { showError('El precio debe ser mayor a 0'); return; }
    const kitData = { ...form, originalPrice, discount, discountPercentage };
    if (editingKit) {
      updateKit(editingKit.id, kitData);
      success('Kit actualizado');
    } else {
      addKit(kitData);
      success('Kit creado');
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Eliminar este kit?')) {
      deleteKit(id);
      success('Kit eliminado');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-gray-600">{kits.length} kits registrados</p>
        <button onClick={openAdd} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo Kit</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {kits.map(kit => (
          <div key={kit.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${!kit.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center text-white font-bold text-sm">K</div>
                <div>
                  <p className="font-bold text-sm">{kit.name}</p>
                  <p className="text-xs text-gray-500">{kit.items.length} productos</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${kit.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{kit.active ? 'Activo' : 'Inactivo'}</span>
            </div>
            <p className="text-xs text-gray-600 mb-2">{kit.description}</p>
            <div className="bg-gray-50 rounded-md p-2 mb-2 space-y-1">
              {kit.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>{item.quantity}x {item.productName}</span>
                  <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Precio original:</span>
                <span className="text-gray-700 line-through">${kit.originalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Descuento:</span>
                <span className="text-green-600 font-semibold">-{kit.discountPercentage.toFixed(0)}% (${kit.discount.toFixed(2)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Precio del kit:</span>
                <span className="text-lg font-bold">${kit.kitPrice.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 pt-2 mt-2 border-t border-gray-100">
              <button onClick={() => openEdit(kit)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-md text-xs font-medium">Editar</button>
              <button onClick={() => updateKit(kit.id, { active: !kit.active })} className={`flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${kit.active ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>{kit.active ? 'Desactivar' : 'Activar'}</button>
              <button onClick={() => handleDelete(kit.id)} className="p-1 text-red-600 hover:bg-red-50 rounded-md text-xs">×</button>
            </div>
          </div>
        ))}
      </div>
      {kits.length === 0 && <div className="text-center py-12 text-gray-400"><p className="text-xs">No hay kits registrados</p></div>}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
              <h3 className="text-sm font-semibold">{editingKit ? 'Editar' : 'Nuevo'} Kit</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Nombre</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" placeholder="Ej: Paquete Fiesta" required />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Descripción</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} placeholder="Describe el kit..." />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2">Productos del Kit</label>
                <div className="border border-gray-200 rounded-md p-2 space-y-1">
                  {form.items.length === 0 ? (<p className="text-xs text-gray-400 text-center py-3">Agrega productos al kit</p>) : (
                    form.items.map(item => (
                      <div key={item.productId} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md">
                        <div className="flex-1">
                          <p className="font-medium text-xs">{item.productName}</p>
                          <p className="text-xs text-gray-500">${item.unitPrice.toFixed(2)} c/u</p>
                        </div>
                        <input type="number" min="1" value={item.quantity} onChange={e => updateItemQuantity(item.productId, parseInt(e.target.value) || 1)} className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center" />
                        <p className="font-bold text-xs w-16 text-right">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                        <button type="button" onClick={() => removeItem(item.productId)} className="p-1 text-red-500 hover:bg-red-50 rounded text-xs">×</button>
                      </div>
                    ))
                  )}
                </div>
                <div className="mt-2">
                  <label className="block text-xs font-medium mb-1">Agregar Producto</label>
                  <select onChange={e => { if (e.target.value) { addItem(e.target.value, 1); e.target.value = ''; } }} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                    <option value="">Seleccionar producto...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} - ${p.price.toFixed(2)} (Stock: {p.stock})</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Precio Original</label>
                  <div className="px-2 py-1.5 bg-gray-100 rounded-md font-bold text-sm">${originalPrice.toFixed(2)}</div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Descuento</label>
                  <div className="px-2 py-1.5 bg-green-50 rounded-md font-bold text-sm text-green-700">{discountPercentage.toFixed(0)}% (${discount.toFixed(2)})</div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Precio del Kit</label>
                <input type="number" step="0.01" min="0" value={form.kitPrice} onChange={e => setForm({ ...form, kitPrice: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md font-bold" required />
                <p className="text-xs text-gray-500 mt-1">El cliente pagará este precio por el kit completo</p>
              </div>
              <div className="flex gap-2 pt-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-3 py-1.5 border border-gray-200 rounded-md text-sm hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 px-3 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800">{editingKit ? 'Guardar' : 'Crear'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ CASH REGISTER ============
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

// ============ ADJUSTMENTS ============
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

// ============ PROMOTIONS ============
function Promotions() {
  const { promotions, coupons, addPromotion, addCoupon, deletePromotion, deleteCoupon } = usePromotions();
  const { success } = useAlert();
  const [activeTab, setActiveTab] = useState<'promotions' | 'coupons'>('promotions');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [promoForm, setPromoForm] = useState({ name: '', type: 'percentage', value: 0, applyTo: 'all', categoryId: '', startDate: '', endDate: '', active: true, description: '' });
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percentage', value: 0, minPurchase: 0, maxDiscount: 0, maxUses: 100, perUserLimit: 1, startDate: '', endDate: '', active: true, description: '' });

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPromotion({ ...promoForm, startDate: new Date(promoForm.startDate).toISOString(), endDate: new Date(promoForm.endDate).toISOString() });
    success('Promoción creada');
    setShowPromoModal(false);
    setPromoForm({ name: '', type: 'percentage', value: 0, applyTo: 'all', categoryId: '', startDate: '', endDate: '', active: true, description: '' });
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({ ...couponForm, code: couponForm.code.toUpperCase(), startDate: new Date(couponForm.startDate).toISOString(), endDate: new Date(couponForm.endDate).toISOString(), usedCount: 0 });
    success('Cupón creado');
    setShowCouponModal(false);
    setCouponForm({ code: '', type: 'percentage', value: 0, minPurchase: 0, maxDiscount: 0, maxUses: 100, perUserLimit: 1, startDate: '', endDate: '', active: true, description: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200">
        <button onClick={() => setActiveTab('promotions')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'promotions' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>Promociones ({promotions.length})</button>
        <button onClick={() => setActiveTab('coupons')} className={`px-4 py-2 text-sm font-medium ${activeTab === 'coupons' ? 'text-black border-b-2 border-black' : 'text-gray-500'}`}>Cupones ({coupons.length})</button>
      </div>
      {activeTab === 'promotions' && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">{promotions.length} promociones registradas</p>
            <button onClick={() => setShowPromoModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nueva Promoción</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {promotions.map(promo => (
              <div key={promo.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${!promo.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center bg-black text-white text-xs font-bold">P</div>
                    <div>
                      <p className="font-bold text-sm">{promo.name}</p>
                      <p className="text-xs text-gray-500">{promo.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${promo.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{promo.active ? 'Activa' : 'Inactiva'}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{promo.description}</p>
                <div className="bg-gray-50 rounded-md p-2 mb-2">
                  <p className="text-sm font-bold">{promo.type === 'percentage' ? `${promo.value}% de descuento` : `$${promo.value} de descuento`}</p>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button onClick={() => deletePromotion(promo.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === 'coupons' && (
        <>
          <div className="flex justify-between items-center">
            <p className="text-xs text-gray-600">{coupons.length} cupones registrados</p>
            <button onClick={() => setShowCouponModal(true)} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium">Nuevo Cupón</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {coupons.map(coupon => (
              <div key={coupon.id} className={`bg-white border border-gray-200 rounded-lg p-4 ${!coupon.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-900 rounded-md flex items-center justify-center text-white font-mono font-bold text-xs">{coupon.code.charAt(0)}</div>
                    <div>
                      <p className="font-mono font-bold text-sm">{coupon.code}</p>
                      <p className="text-xs text-gray-500">{coupon.type === 'percentage' ? 'Porcentaje' : 'Monto Fijo'}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{coupon.active ? 'Activo' : 'Inactivo'}</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">{coupon.description}</p>
                <div className="bg-gray-50 rounded-md p-2 mb-2">
                  <p className="text-sm font-bold">{coupon.type === 'percentage' ? `${coupon.value}% de descuento` : `$${coupon.value} de descuento`}</p>
                  <div className="grid grid-cols-2 gap-1 mt-1 text-xs text-gray-600">
                    <p>Compra mín: <span className="font-semibold">${coupon.minPurchase}</span></p>
                    <p>Usos: <span className="font-semibold">{coupon.usedCount}/{coupon.maxUses}</span></p>
                  </div>
                </div>
                <div className="flex items-center gap-1 pt-2 border-t border-gray-100">
                  <button onClick={() => deleteCoupon(coupon.id)} className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-red-600 hover:bg-red-50 rounded-md text-xs font-medium">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nueva Promoción</h3>
            <form onSubmit={handlePromoSubmit} className="space-y-2">
              <input type="text" placeholder="Nombre" value={promoForm.name} onChange={e => setPromoForm({ ...promoForm, name: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <select value={promoForm.type} onChange={e => setPromoForm({ ...promoForm, type: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
                <option value="2x1">2x1</option>
              </select>
              <input type="number" placeholder="Valor" value={promoForm.value} onChange={e => setPromoForm({ ...promoForm, value: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <select value={promoForm.applyTo} onChange={e => setPromoForm({ ...promoForm, applyTo: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                <option value="all">Todos los productos</option>
                <option value="category">Categoría específica</option>
              </select>
              <textarea placeholder="Descripción" value={promoForm.description} onChange={e => setPromoForm({ ...promoForm, description: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowPromoModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-4">
            <h3 className="text-sm font-semibold mb-3">Nuevo Cupón</h3>
            <form onSubmit={handleCouponSubmit} className="space-y-2">
              <input type="text" placeholder="Código (ej: DESCUENTO20)" value={couponForm.code} onChange={e => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md font-mono uppercase" required />
              <select value={couponForm.type} onChange={e => setCouponForm({ ...couponForm, type: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md">
                <option value="percentage">Porcentaje (%)</option>
                <option value="fixed">Monto Fijo ($)</option>
              </select>
              <input type="number" placeholder="Valor" value={couponForm.value} onChange={e => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="number" placeholder="Compra mínima" value={couponForm.minPurchase} onChange={e => setCouponForm({ ...couponForm, minPurchase: parseFloat(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <input type="number" placeholder="Usos máximos" value={couponForm.maxUses} onChange={e => setCouponForm({ ...couponForm, maxUses: parseInt(e.target.value) || 0 })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" required />
              <textarea placeholder="Descripción" value={couponForm.description} onChange={e => setCouponForm({ ...couponForm, description: e.target.value })} className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md" rows={2} />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCouponModal(false)} className="flex-1 py-1.5 border border-gray-200 rounded-md text-sm">Cancelar</button>
                <button type="submit" className="flex-1 py-1.5 bg-gray-900 text-white rounded-md text-sm font-medium">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ APP CONTENT ============
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

