import { useState, useMemo } from 'react';
import StatusBadge from '../components/StatusBadge';
import Icon from '../components/Icons';
import { STATS, RECENT_ORDERS } from '../data/mockData';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie,
} from 'recharts';

// ── Generate fake time-series data ────────────────────────────────────────────
function generateSeries(days: number) {
  const data = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label =
      days <= 7
        ? d.toLocaleDateString('en', { weekday: 'short' })
        : days <= 30
        ? d.toLocaleDateString('en', { month: 'short', day: 'numeric' })
        : d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
    data.push({
      label,
      revenue: Math.floor(800 + Math.random() * 2400 + Math.sin(i / 3) * 600),
      orders: Math.floor(10 + Math.random() * 60 + Math.sin(i / 4) * 15),
      visitors: Math.floor(200 + Math.random() * 800 + Math.cos(i / 5) * 200),
    });
  }
  return data;
}

const RANGE_OPTIONS = [
  { label: '7D',  days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 42, color: '#6366f1' },
  { name: 'Fashion',     value: 23, color: '#f59e0b' },
  { name: 'Home',        value: 18, color: '#10b981' },
  { name: 'Beauty',      value: 10, color: '#f43f5e' },
  { name: 'Sports',      value: 7,  color: '#3b82f6' },
];

const TOP_PRODUCTS = [
  { name: 'MacBook Air M2',  sales: 142, revenue: '$156,200', pct: 92 },
  { name: 'Samsung Galaxy S24', sales: 118, revenue: '$106,200', pct: 76 },
  { name: 'Sony WH-1000XM5', sales: 94,  revenue: '$26,320',  pct: 61 },
  { name: 'Dyson Airwrap',   sales: 76,  revenue: '$38,000',  pct: 49 },
  { name: 'Nike Air Max 270', sales: 63, revenue: '$7,560',   pct: 41 },
];

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl border border-white/10">
      <p className="font-semibold mb-1.5 text-gray-300">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="capitalize text-gray-400">{p.dataKey}:</span>
          <span className="font-bold">
            {p.dataKey === 'revenue' ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ s }: { s: typeof STATS[0] }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{s.label}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${s.dot} shadow-sm`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">{s.value}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
        <Icon.trend_up />
        {s.change} this month
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [rangeDays, setRangeDays] = useState(30);
  const [activeMetric, setActiveMetric] = useState<'revenue' | 'orders' | 'visitors'>('revenue');

  const series = useMemo(() => generateSeries(rangeDays), [rangeDays]);

  // Summarise for header pills
  const totals = useMemo(() => ({
    revenue: series.reduce((a, d) => a + d.revenue, 0),
    orders:  series.reduce((a, d) => a + d.orders, 0),
    visitors:series.reduce((a, d) => a + d.visitors, 0),
  }), [series]);

  const METRIC_CONFIG = {
    revenue:  { label: 'Revenue',  color: '#6366f1', fmt: (v: number) => `$${(v/1000).toFixed(1)}k` },
    orders:   { label: 'Orders',   color: '#f59e0b', fmt: (v: number) => v.toLocaleString() },
    visitors: { label: 'Visitors', color: '#10b981', fmt: (v: number) => v.toLocaleString() },
  };

  const cfg = METRIC_CONFIG[activeMetric];

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s, i) => <StatCard key={i} s={s} />)}
      </div>

      {/* ── Analytics Chart ────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Chart header */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900">Analytics Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Performance trends across selected period</p>
            </div>

            {/* Range filter */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setRangeDays(opt.days)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    rangeDays === opt.days
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric selector + totals */}
          <div className="flex flex-wrap gap-3 mt-4">
            {(Object.entries(METRIC_CONFIG) as [keyof typeof METRIC_CONFIG, typeof METRIC_CONFIG[keyof typeof METRIC_CONFIG]][]).map(([key, c]) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all text-sm font-medium ${
                  activeMetric === key
                    ? 'border-transparent text-white shadow-sm'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'
                }`}
                style={activeMetric === key ? { background: c.color } : {}}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: activeMetric === key ? 'rgba(255,255,255,0.7)' : c.color }}
                />
                <span>{c.label}</span>
                <span className={`font-bold ${activeMetric === key ? 'text-white' : 'text-gray-900'}`}>
                  {key === 'revenue'
                    ? `$${(totals[key] / 1000).toFixed(1)}k`
                    : totals[key].toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="px-2 pt-4 pb-2">
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={series} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={cfg.color} stopOpacity={0.18} />
                  <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                interval={rangeDays <= 14 ? 1 : rangeDays <= 30 ? 4 : 9}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) =>
                  activeMetric === 'revenue' ? `$${(v / 1000).toFixed(0)}k` : v
                }
                width={activeMetric === 'revenue' ? 50 : 36}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: cfg.color, strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={cfg.color}
                strokeWidth={2.5}
                fill="url(#chartGrad)"
                dot={false}
                activeDot={{ r: 5, fill: cfg.color, stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Bottom row: Category pie + Orders bar + Top products ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Sales by Category</h3>
          <p className="text-xs text-gray-400 mb-4">Revenue distribution</p>
          <ResponsiveContainer width="100%" height={190}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                shape={(props: any) => {
                  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, index } = props;
                  const fill = CATEGORY_DATA[index]?.color ?? '#ccc';
                  // Use recharts' built-in Sector helper via SVG path
                  const r2d = Math.PI / 180;
                  const sa = -startAngle * r2d;
                  const ea = -endAngle * r2d;
                  const x1 = cx + outerRadius * Math.cos(sa);
                  const y1 = cy + outerRadius * Math.sin(sa);
                  const x2 = cx + outerRadius * Math.cos(ea);
                  const y2 = cy + outerRadius * Math.sin(ea);
                  const x3 = cx + innerRadius * Math.cos(ea);
                  const y3 = cy + innerRadius * Math.sin(ea);
                  const x4 = cx + innerRadius * Math.cos(sa);
                  const y4 = cy + innerRadius * Math.sin(sa);
                  const large = Math.abs(endAngle - startAngle) > 180 ? 1 : 0;
                  return (
                    <path
                      d={`M${x1} ${y1} A${outerRadius} ${outerRadius} 0 ${large} 0 ${x2} ${y2} L${x3} ${y3} A${innerRadius} ${innerRadius} 0 ${large} 1 ${x4} ${y4} Z`}
                      fill={fill}
                    />
                  );
                }}
              />
              <Tooltip
                // formatter={(v: number) => [`${v}%`, 'Share']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-1">
            {CATEGORY_DATA.map((c) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className="text-gray-600 font-medium">{c.name}</span>
                </div>
                <span className="font-bold text-gray-900">{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily orders bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Daily Orders</h3>
          <p className="text-xs text-gray-400 mb-4">Last {Math.min(rangeDays, 90)} days</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={series.slice(-14)}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              barSize={rangeDays <= 14 ? 18 : 12}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.12)', fontSize: 12 }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Top Products</h3>
          <p className="text-xs text-gray-400 mb-4">By sales volume</p>
          <div className="space-y-4">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      i === 0 ? 'bg-amber-100 text-amber-600' :
                      i === 1 ? 'bg-gray-100 text-gray-500' :
                      'bg-gray-50 text-gray-400'
                    }`}>{i + 1}</span>
                    <span className="font-semibold text-gray-800 truncate">{p.name}</span>
                  </div>
                  <span className="font-bold text-gray-900 ml-2 shrink-0">{p.sales}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${p.pct}%`,
                      background: i === 0 ? '#6366f1' : i === 1 ? '#f59e0b' : '#94a3b8',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Orders ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <button className="text-xs text-indigo-600 font-semibold hover:underline">View all</button>
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
              {RECENT_ORDERS.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{o.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{o.customer}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{o.total}</td>
                  <td className="px-6 py-4"><StatusBadge status={o.status as any} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}