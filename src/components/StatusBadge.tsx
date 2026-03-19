import type { OrderStatus, StockStatus } from '../types';

type BadgeStatus = StockStatus | OrderStatus;

interface StatusBadgeProps {
  status: BadgeStatus ;
}

const statusStyles: Record<BadgeStatus, string> = {
  'In Stock':     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Out of Stock': 'bg-rose-50 text-rose-700 border border-rose-200',
  'Low Stock':    'bg-amber-50 text-amber-700 border border-amber-200',
  'Delivered':    'bg-emerald-50 text-emerald-700 border border-emerald-200',
  'Processing':   'bg-blue-50 text-blue-700 border border-blue-200',
  'Pending':      'bg-amber-50 text-amber-700 border border-amber-200',
  'Shipped':      'bg-indigo-50 text-indigo-700 border border-indigo-200',
  'Cancelled':    'bg-rose-50 text-rose-700 border border-rose-200',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}