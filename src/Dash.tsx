'use client';
import { useState } from 'react';

// ─── ICONS (inline SVG) ───────────────────────────────────────────────────────
const Icon = {
  logo: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#6366f1"/>
      <path d="M8 22L13 10L16 17L19 13L24 22H8Z" fill="white" opacity="0.9"/>
    </svg>
  ),
  dashboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  products: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>,
  categories: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>,
  orders: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
  slides: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8M12 3v4"/></svg>,
  users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  logout: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  menu: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trend_up: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  edit: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash: () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
  plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  search: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const STATS = [
  { label: 'Total Revenue', value: '$48,295', change: '+12.5%', up: true, color: 'bg-indigo-50 text-indigo-600', dot: 'bg-indigo-500' },
  { label: 'Total Orders', value: '1,284', change: '+8.2%', up: true, color: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  { label: 'Total Products', value: '342', change: '+3.1%', up: true, color: 'bg-amber-50 text-amber-600', dot: 'bg-amber-500' },
  { label: 'Total Users', value: '8,741', change: '-1.4%', up: false, color: 'bg-rose-50 text-rose-600', dot: 'bg-rose-500' },
];

const PRODUCTS = [
  { id: 1, name: 'Nothing Phone 1', category: 'Electronics', price: '$800', stock: 24, status: 'In Stock', img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=60&h=60&fit=crop' },
  { id: 2, name: 'Samsung Galaxy S24', category: 'Electronics', price: '$900', stock: 12, status: 'In Stock', img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=60&h=60&fit=crop' },
  { id: 3, name: 'Nike Air Max 270', category: 'Fashion', price: '$120', stock: 0, status: 'Out of Stock', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop' },
  { id: 4, name: 'Apple MacBook Air M2', category: 'Electronics', price: '$1100', stock: 8, status: 'In Stock', img: 'https://images.unsplash.com/photo-1611186871525-a3c8a7a8f5c1?w=60&h=60&fit=crop' },
  { id: 5, name: 'Sony WH-1000XM5', category: 'Electronics', price: '$280', stock: 3, status: 'Low Stock', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop' },
  { id: 6, name: 'Dyson Airwrap', category: 'Beauty', price: '$500', stock: 15, status: 'In Stock', img: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=60&h=60&fit=crop' },
];

const ORDERS = [
  { id: '#ORD-001', customer: 'Rahim Ahmed', date: 'Mar 12, 2025', total: '$1,280', status: 'Delivered', items: 3 },
  { id: '#ORD-002', customer: 'Karim Hassan', date: 'Mar 13, 2025', total: '$450', status: 'Processing', items: 2 },
  { id: '#ORD-003', customer: 'Nadia Islam', date: 'Mar 14, 2025', total: '$89', status: 'Pending', items: 1 },
  { id: '#ORD-004', customer: 'Sumon Roy', date: 'Mar 14, 2025', total: '$2,100', status: 'Shipped', items: 4 },
  { id: '#ORD-005', customer: 'Fatema Begum', date: 'Mar 15, 2025', total: '$320', status: 'Cancelled', items: 2 },
];

const CATEGORIES = [
  { id: 1, name: 'Electronics', products: 120, img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=60&h=60&fit=crop' },
  { id: 2, name: 'Fashion', products: 85, img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=60&h=60&fit=crop' },
  { id: 3, name: 'Home & Kitchen', products: 64, img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=60&h=60&fit=crop' },
  { id: 4, name: 'Beauty', products: 43, img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=60&h=60&fit=crop' },
  { id: 5, name: 'Sports', products: 30, img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=60&h=60&fit=crop' },
];

const SLIDES = [
  { id: 1, badge: '🚀 New Arrivals', title: 'Innovation at Your Fingertips', subtitle: 'Premium Electronics', link: '/products', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=120&h=60&fit=crop' },
  { id: 2, badge: '🔥 Best Sellers', title: 'Next-Gen Smart Home', subtitle: 'Automation & AI', link: '/smart-home', img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=120&h=60&fit=crop' },
];

const RECENT_ORDERS = ORDERS.slice(0, 4);

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    'In Stock':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Out of Stock': 'bg-rose-50 text-rose-700 border border-rose-200',
    'Low Stock':    'bg-amber-50 text-amber-700 border border-amber-200',
    'Delivered':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    'Processing':   'bg-blue-50 text-blue-700 border border-blue-200',
    'Pending':      'bg-amber-50 text-amber-700 border border-amber-200',
    'Shipped':      'bg-indigo-50 text-indigo-700 border border-indigo-200',
    'Cancelled':    'bg-rose-50 text-rose-700 border border-rose-200',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@sellify.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Icon.logo />
          <span className="text-2xl font-bold text-white tracking-tight">Sellify</span>
          <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-medium">Admin</span>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-xl font-semibold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to your admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="admin@sellify.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-slate-500 text-center mt-6">
            Demo: admin@sellify.com / password
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{s.label}</span>
              <span className={`w-2 h-2 rounded-full ${s.dot}`}/>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{s.value}</p>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.color}`}>
              <Icon.trend_up />
              {s.change} this month
            </span>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <button className="text-xs text-indigo-600 font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {RECENT_ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-600">{o.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{o.customer}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{o.total}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCTS PAGE ────────────────────────────────────────────────────────────
function ProductsPage() {
  const [search, setSearch] = useState('');
  const filtered = PRODUCTS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{PRODUCTS.length} total products</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <Icon.plus /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-50">
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon.search /></span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Category</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100"/>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500">{p.category}</td>
                  <td className="px-5 py-4 font-semibold text-gray-900">{p.price}</td>
                  <td className="px-5 py-4 text-gray-600">{p.stock}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status}/></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Icon.edit /></button>
                      <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Icon.trash /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORIES PAGE ──────────────────────────────────────────────────────────
function CategoriesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">{CATEGORIES.length} categories</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <Icon.plus /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map(c => (
          <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between group hover:border-indigo-200 transition">
            <div className="flex items-center gap-4">
              <img src={c.img} alt={c.name} className="w-14 h-14 rounded-xl object-cover bg-gray-100"/>
              <div>
                <p className="font-semibold text-gray-900">{c.name}</p>
                <p className="text-sm text-gray-500">{c.products} products</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Icon.edit /></button>
              <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Icon.trash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
function OrdersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{ORDERS.length} total orders</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Items</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ORDERS.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-indigo-600">{o.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{o.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{o.date}</td>
                  <td className="px-6 py-4 text-gray-600">{o.items} items</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{o.total}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status}/></td>
                  <td className="px-6 py-4">
                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Icon.eye /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SLIDES PAGE ──────────────────────────────────────────────────────────────
function SlidesPage() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Hero Slides</h1>
          <p className="text-sm text-gray-500">{SLIDES.length} slides</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <Icon.plus /> Add Slide
        </button>
      </div>

      <div className="space-y-3">
        {SLIDES.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 group hover:border-indigo-200 transition">
            <div className="flex items-center gap-4 min-w-0">
              <img src={s.img} alt={s.title} className="w-24 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0"/>
              <div className="min-w-0">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{s.badge}</span>
                <p className="font-semibold text-gray-900 mt-1 truncate">{s.title}</p>
                <p className="text-sm text-gray-500 truncate">{s.subtitle} · <span className="text-indigo-500">{s.link}</span></p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"><Icon.edit /></button>
              <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Icon.trash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: 'dashboard',  label: 'Dashboard',  icon: 'dashboard' },
  { key: 'products',   label: 'Products',   icon: 'products' },
  { key: 'categories', label: 'Categories', icon: 'categories' },
  { key: 'orders',     label: 'Orders',     icon: 'orders' },
  { key: 'slides',     label: 'Hero Slides',icon: 'slides' },
  { key: 'users',      label: 'Users',      icon: 'users' },
];

function Sidebar({ active, setActive, onLogout, open, setOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={() => setOpen(false)}/>
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-100 z-30 flex flex-col
        transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-50">
          <Icon.logo />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Sellify</span>
          <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-md font-semibold ml-auto">Admin</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const Ic = Icon[item.icon];
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { setActive(item.key); setOpen(false); }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}><Ic /></span>
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600"/>}
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-gray-50">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">SA</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Super Admin</p>
              <p className="text-xs text-gray-400 truncate">admin@sellify.com</p>
            </div>
            <button onClick={onLogout} className="text-gray-400 hover:text-rose-500 transition" title="Logout">
              <Icon.logout />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SellifyAdmin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const pages = {
    dashboard:  <DashboardPage />,
    products:   <ProductsPage />,
    categories: <CategoriesPage />,
    orders:     <OrdersPage />,
    slides:     <SlidesPage />,
    users:      <div className="text-gray-500 text-sm pt-4">Users page — coming soon</div>,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar
        active={activePage}
        setActive={setActivePage}
        onLogout={() => setLoggedIn(false)}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-900 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon.menu />
          </button>
          <div className="flex-1"/>
          <button className="relative text-gray-400 hover:text-gray-600 transition p-1.5">
            <Icon.bell />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"/>
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">SA</div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-6">
          {pages[activePage]}
        </main>
      </div>
    </div>
  );
}