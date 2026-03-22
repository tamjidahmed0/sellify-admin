import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Select, DatePicker, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { Order, OrdersQuery, OrderStatus } from '../types';
import { useUpdateOrderStatus } from '../hooks/useUpdateOrderStatus';
import { useGetOrders } from '../hooks/useGetOrders';

const STATUS_OPTIONS: { label: string; value: OrderStatus | '' }[] = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-600 border-amber-200',
  PROCESSING: 'bg-blue-50 text-blue-600 border-blue-200',
  SHIPPED: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  DELIVERED: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  CANCELLED: 'bg-rose-50 text-rose-600 border-rose-200',
};

const LIMIT = 10;

function SkeletonRow() {
  return (
    <tr>
      {[60, 120, 80, 40, 60, 90, 40].map((w, i) => (
        <td key={i} className="px-6 py-4">
          <div className="h-4 bg-gray-100 rounded-lg animate-pulse" style={{ width: w }} />
        </td>
      ))}
    </tr>
  );
}

function StatusCell({ order }: { order: Order }) {
  const { mutate, isPending } = useUpdateOrderStatus();
  const allowed = STATUS_TRANSITIONS[order.status];
  const isTerminal = allowed.length === 0;

  if (isTerminal) {
    return (
      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[order.status]}`}>
        {order.status}
      </span>
    );
  }

  return (
    <Select
      value={order.status}
      size="small"
      loading={isPending}
      className="w-36"
      // Prevent row click from triggering when using the dropdown
      onClick={(e) => e.stopPropagation()}
      onChange={(newStatus: OrderStatus) => {
        mutate(
          { id: order.rawId, status: newStatus },
          {
            onSuccess: () => message.success(`Order ${order.id} → ${newStatus}`),
            onError: () => message.error('Failed to update status'),
          }
        );
      }}
      options={[
        {
          label: (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[order.status]}`}>
              {order.status}
            </span>
          ),
          value: order.status,
          disabled: true,
        },
        ...allowed.map((s) => ({
          label: (
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${STATUS_STYLE[s]}`}>
              {s}
            </span>
          ),
          value: s,
        })),
      ]}
    />
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState<OrdersQuery>({
    page: 1, limit: LIMIT, search: '', status: '', dateFrom: '', dateTo: '',
  });
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isFetching } = useGetOrders(query);
  const orders = data?.data ?? [];
  const meta = data?.meta;

  const setFilter = (patch: Partial<OrdersQuery>) =>
    setQuery((prev) => ({ ...prev, page: 1, ...patch }));

  const handleSearch = () => setFilter({ search: searchInput });

  return (
    <div className="space-y-6 w-full">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? 'Loading…' : `${meta?.total ?? 0} total orders`}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Filter bar */}
        <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              onBlur={handleSearch}
              placeholder="Search customer…"
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition placeholder-gray-300"
            />
          </div>

          <Select
            value={query.status}
            onChange={(v) => setFilter({ status: v })}
            options={STATUS_OPTIONS}
            className="w-40"
            placeholder="All Status"
          />

          <DatePicker.RangePicker
            className="rounded-xl border-gray-200"
            onChange={(_, [from, to]) => setFilter({ dateFrom: from, dateTo: to })}
            placeholder={['From date', 'To date']}
            allowClear
          />

          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400 shrink-0 animate-pulse">Updating…</span>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50/80">
                {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', ''].map((h, i) => (
                  <th key={i} className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-gray-400">
                      <span className="text-4xl">🛒</span>
                      <p className="text-sm font-medium text-gray-500">No orders found</p>
                      {(query.search || query.status || query.dateFrom) && (
                        <button
                          onClick={() => {
                            setQuery({ page: 1, limit: LIMIT, search: '', status: '', dateFrom: '', dateTo: '' });
                            setSearchInput('');
                          }}
                          className="text-xs text-indigo-600 font-semibold hover:text-indigo-500 transition mt-1"
                        >
                          Clear filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.id}
                    className="hover:bg-indigo-50/30 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-semibold text-indigo-600 group-hover:underline">
                        {o.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 leading-tight">{o.customer}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{o.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs whitespace-nowrap">
                      {new Date(o.date).toLocaleDateString('en', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {o.items} {o.items === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">{o.total}</td>
                    <td className="px-6 py-4">
                      <StatusCell order={o} />
                    </td>
                    {/* View arrow — visible on row hover */}
                    <td className="px-6 py-4 text-right">
                      <span className="text-xs text-gray-300 group-hover:text-indigo-500 font-medium transition-colors" onClick={() => navigate(`/orders/${o.rawId}`)}>
                        View →
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Showing{' '}
              <span className="font-semibold text-gray-600">
                {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
              </span>{' '}
              of <span className="font-semibold text-gray-600">{meta.total}</span> orders
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); setQuery((p) => ({ ...p, page: p.page! - 1 })); }}
                disabled={meta.page <= 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>

              {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1)
                .reduce<(number | '...')[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`dot-${i}`} className="px-2 text-gray-400 text-xs">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={(e) => { e.stopPropagation(); setQuery((prev) => ({ ...prev, page: p as number })); }}
                      className={`w-8 h-8 text-xs font-semibold rounded-lg transition ${meta.page === p
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={(e) => { e.stopPropagation(); setQuery((p) => ({ ...p, page: p.page! + 1 })); }}
                disabled={meta.page >= meta.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}