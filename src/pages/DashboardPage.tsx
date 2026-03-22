import { useState, useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie,
} from 'recharts';
import { useGetStates } from '../hooks/useGetStates';
import { useGetTimeSeries } from '../hooks/useGetTimeSeries';
import { useGetCategoryBreakdown } from '../hooks/Usegetcategorybreakdown';
import { useGetTopProducts } from '../hooks/useGetTopProducts';
import { useGetRecentOrders } from '../hooks/useGetRecentOrders';

// ── Types ──────────────────────────────────────────────────────
interface StatItem {
  label: string;
  value: string;
  change: string;
  up: boolean;
  color: string;
  dot: string;
}

interface SeriesItem {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  visitors: number;
}

interface CategoryItem {
  name: string;
  revenue: number;
  value: number;
  color: string;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: string;
  pct: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  total: string;
  status: string;
  createdAt: string;
}

type MetricKey = 'revenue' | 'orders' | 'visitors';

// ── Constants ──────────────────────────────────────────────────
const RANGE_OPTIONS = [
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#f43f5e', '#3b82f6', '#8b5cf6', '#ec4899'];

const STATUS_CONFIG: Record<string, { label: string; cls: string }> = {
  PENDING: { label: 'Pending', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  PROCESSING: { label: 'Processing', cls: 'bg-blue-50 text-blue-600 border border-blue-200' },
  SHIPPED: { label: 'Shipped', cls: 'bg-indigo-50 text-indigo-600 border border-indigo-200' },
  DELIVERED: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200' },
  CANCELLED: { label: 'Cancelled', cls: 'bg-rose-50 text-rose-600 border border-rose-200' },
};

const METRIC_CONFIG: Record<MetricKey, { label: string; color: string }> = {
  revenue: { label: 'Revenue', color: '#6366f1' },
  orders: { label: 'Orders', color: '#f59e0b' },
  visitors: { label: 'Visitors', color: '#10b981' },
};

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} style={style} />;
}

// ── Custom Tooltip ─────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { dataKey: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl px-3.5 py-2.5 shadow-xl border border-white/10">
      <p className="font-semibold mb-1.5 text-gray-300">{label}</p>
      {payload.map((p) => (
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
}

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({ s }: { s: StatItem }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-gray-500 font-medium">{s.label}</span>
        <span className={`w-2.5 h-2.5 rounded-full ${s.dot} shadow-sm`} />
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-2.5 tracking-tight">{s.value}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${s.color}`}>
        {s.up ? '↑' : '↓'} {s.change} this month
      </span>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-2.5 w-2.5 rounded-full" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-6 w-28 rounded-full" />
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const [rangeDays, setRangeDays] = useState<number>(30);
  const [activeMetric, setActiveMetric] = useState<MetricKey>('revenue');

  const { data: stats = [], isLoading: statsLoading } = useGetStates();
  const { data: series = [], isLoading: seriesLoading } = useGetTimeSeries(rangeDays);
  const { data: categoryRaw = [], isLoading: categoryLoading } = useGetCategoryBreakdown();
  const { data: topProducts = [], isLoading: topLoading } = useGetTopProducts();
  const { data: recentOrders = [], isLoading: ordersLoading } = useGetRecentOrders();

  // Attach colors to category items from API
  const categoryData: CategoryItem[] = (categoryRaw as Omit<CategoryItem, 'color'>[]).map((c, i) => ({
    ...c,
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  // Aggregate totals for metric pills
  const totals = useMemo(() => ({
    revenue: (series as SeriesItem[]).reduce((a, d) => a + d.revenue, 0),
    orders: (series as SeriesItem[]).reduce((a, d) => a + d.orders, 0),
    visitors: (series as SeriesItem[]).reduce((a, d) => a + d.visitors, 0),
  }), [series]);

  const cfg = METRIC_CONFIG[activeMetric];

  return (
    <div className="space-y-6 w-full">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Welcome back! Here's what's happening.</p>
        </div>
        <span className="hidden sm:inline-flex text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1.5 rounded-xl">
          {new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
          : (stats as StatItem[]).map((s, i) => <StatCard key={i} s={s} />)
        }
      </div>

      {/* Analytics chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 pt-5 pb-4 border-b border-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="font-bold text-gray-900">Analytics Overview</h2>
              <p className="text-xs text-gray-400 mt-0.5">Performance trends across selected period</p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl self-start sm:self-auto shrink-0">
              {RANGE_OPTIONS.map((opt) => (
                <button
                  key={opt.days}
                  onClick={() => setRangeDays(opt.days)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${rangeDays === opt.days
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric pills */}
          <div className="flex flex-wrap gap-3 mt-4">
            {(Object.entries(METRIC_CONFIG) as [MetricKey, { label: string; color: string }][]).map(([key, c]) => (
              <button
                key={key}
                onClick={() => setActiveMetric(key)}
                className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all text-sm font-medium ${activeMetric === key
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

        <div className="px-2 pt-4 pb-2">
          {seriesLoading ? (
            <Skeleton className="h-60 mx-4 mb-2" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={series as SeriesItem[]} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={cfg.color} stopOpacity={0.18} />
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
                  tickFormatter={(v: number) =>
                    activeMetric === 'revenue' ? `$${(v / 1000).toFixed(0)}k` : String(v)
                  }
                  width={activeMetric === 'revenue' ? 50 : 36}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ stroke: cfg.color, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
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
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Sales by Category</h3>
          <p className="text-xs text-gray-400 mb-4">Revenue distribution</p>
          {categoryLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-48" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="w-2.5 h-2.5 rounded-full" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3 w-8" />
                </div>
              ))}
            </div>
          ) : categoryData.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-gray-400">
              <span className="text-3xl">📊</span>
              <p className="text-sm">No sales data yet</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    strokeWidth={0}
                    shape={(props: {
                      cx: number; cy: number;
                      innerRadius: number; outerRadius: number;
                      startAngle: number; endAngle: number;
                      index: number;
                    }) => {
                      const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, index } = props;
                      const fill = categoryData[index]?.color ?? '#ccc';
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
                    contentStyle={{
                      borderRadius: 12,
                      border: 'none',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-1">
                {categoryData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                      <span className="text-gray-600 font-medium capitalize">{c.name}</span>
                    </div>
                    <span className="font-bold text-gray-900">{c.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Daily orders bar chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Daily Orders</h3>
          <p className="text-xs text-gray-400 mb-4">Last {Math.min(rangeDays, 14)} days</p>
          {seriesLoading ? (
            <Skeleton className="h-52" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={(series as SeriesItem[]).slice(-14)}
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
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-1">Top Products</h3>
          <p className="text-xs text-gray-400 mb-4">By sales volume</p>
          {topLoading ? (
            <div className="space-y-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3.5 w-8" />
                  </div>
                  <Skeleton className="h-1.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          ) : (topProducts as TopProduct[]).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2 text-gray-400">
              <span className="text-3xl">📦</span>
              <p className="text-sm">No sales yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {(topProducts as TopProduct[]).map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' :
                        i === 1 ? 'bg-gray-100 text-gray-500' :
                          'bg-gray-50 text-gray-400'
                        }`}>{i + 1}</span>
                      <span className="font-semibold text-gray-800 truncate">{p.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 ml-2 shrink-0">{p.sales}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{
                        width: `${p.pct}%`,
                        background: i === 0 ? '#6366f1' : i === 1 ? '#f59e0b' : '#94a3b8',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <div>
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5">Latest customer transactions</p>
          </div>
          <button className="text-xs text-indigo-600 font-semibold hover:text-indigo-500 transition">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Order</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Total</th>
                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {[80, 120, 60, 70].map((w, j) => (
                      <td key={j} className="px-6 py-4">
                        <Skeleton className="h-4" style={{ width: w }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (recentOrders as RecentOrder[]).length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-3xl">🛒</span>
                      <p className="text-sm font-medium text-gray-500">No orders yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (recentOrders as RecentOrder[]).map((o) => {
                  const st = STATUS_CONFIG[o.status] ?? { label: o.status, cls: 'bg-gray-100 text-gray-500' };
                  return (
                    <tr key={o.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-6 py-4 font-mono text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                        {o.id}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900">{o.customer}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{o.total}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}