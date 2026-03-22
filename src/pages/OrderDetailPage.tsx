import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, UserOutlined, EnvironmentOutlined, CreditCardOutlined } from '@ant-design/icons';
import { useGetOrderById, type OrderStatus } from '../hooks/Usegetorderbyid';

// ── Constants ──────────────────────────────────────────────────
const STATUS_STYLE: Record<OrderStatus, string> = {
    PENDING:    'bg-amber-50 text-amber-600 border-amber-200',
    PROCESSING: 'bg-blue-50 text-blue-600 border-blue-200',
    SHIPPED:    'bg-indigo-50 text-indigo-600 border-indigo-200',
    DELIVERED:  'bg-emerald-50 text-emerald-600 border-emerald-200',
    CANCELLED:  'bg-rose-50 text-rose-600 border-rose-200',
};



// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

function PageSkeleton() {
    return (
        <div className="space-y-6 w-full animate-pulse">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-48" />
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-40" />
                    <Skeleton className="h-40" />
                    <Skeleton className="h-56" />
                </div>
            </div>
        </div>
    );
}

// ── Section card ───────────────────────────────────────────────
function Card({ title, icon, children }: {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-50">
                <span className="text-gray-400">{icon}</span>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────
export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading } = useGetOrderById(id ?? '');


    if (isLoading) return <PageSkeleton />;
    if (!order) return (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
            <span className="text-4xl">🔍</span>
            <p className="text-sm font-medium text-gray-500">Order not found</p>
            <button onClick={() => navigate('/orders')} className="text-xs text-indigo-600 font-semibold hover:text-indigo-500">
                ← Back to orders
            </button>
        </div>
    );


    const hasAddress = Object.values(order.address).some(Boolean);

    return (
        <div className="space-y-6 w-full pb-10">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/orders')}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition shadow-sm shrink-0"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">{order.id}</h1>
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[order.status]}`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en', {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                            })}
                        </p>
                    </div>
                </div>

  
            </div>

            {/* ── 2-column layout ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ── Left — order items + payment ── */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Order items */}
                    <Card title="Order Items" icon={<span>🛍️</span>}>
                        <div className="space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-4">
                                    {/* Product image */}
                                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-100">
                                        {item.productImage ? (
                                            <img
                                                src={item.productImage}
                                                alt={item.productName}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">📦</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{item.productName}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            ${item.price.toFixed(2)} × {item.quantity}
                                        </p>
                                    </div>

                                    <p className="font-bold text-gray-900 shrink-0">
                                        ${item.subtotal.toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Divider + total */}
                        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                            </span>
                            <div className="text-right">
                                <p className="text-xs text-gray-400">Order Total</p>
                                <p className="text-xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Payment info */}
                    <Card title="Payment Information" icon={<CreditCardOutlined />}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Amount</p>
                                <p className="font-bold text-gray-900">${order.totalPrice.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Payment Status</p>
                                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                                    order.status === 'CANCELLED'
                                        ? 'bg-rose-50 text-rose-600 border-rose-200'
                                        : order.status === 'DELIVERED'
                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                                        : 'bg-amber-50 text-amber-600 border-amber-200'
                                }`}>
                                    {order.status === 'CANCELLED' ? 'Refunded' :
                                     order.status === 'DELIVERED' ? 'Paid' : 'Processing'}
                                </span>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Order Date</p>
                                <p className="text-sm text-gray-700">
                                    {new Date(order.createdAt).toLocaleDateString('en', {
                                        month: 'short', day: 'numeric', year: 'numeric',
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Order ID</p>
                                <p className="font-mono text-xs text-indigo-600">{order.id}</p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* ── Right — customer, address, timeline ── */}
                <div className="space-y-6">

                    {/* Customer info */}
                    <Card title="Customer" icon={<UserOutlined />}>
                        <div className="flex items-center gap-3 mb-4">
                            {order.customer.picture ? (
                                <img
                                    src={order.customer.picture}
                                    alt={order.customer.name}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                    {order.customer.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div>
                                <p className="font-semibold text-gray-900">{order.customer.name}</p>
                                <p className="text-xs text-gray-400">{order.customer.email}</p>
                            </div>
                        </div>
                    </Card>

                    {/* Delivery address */}
                    <Card title="Delivery Address" icon={<EnvironmentOutlined />}>
                        {hasAddress ? (
                            <div className="space-y-1 text-sm text-gray-700">
                                {order.address.line    && <p>{order.address.line}</p>}
                                {order.address.city    && <p>{order.address.city}{order.address.state ? `, ${order.address.state}` : ''}</p>}
                                {order.address.zipCode && <p>{order.address.zipCode}</p>}
                                {order.address.country && <p className="font-medium text-gray-900">{order.address.country}</p>}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No address provided</p>
                        )}
                    </Card>

                </div>
            </div>
        </div>
    );
}