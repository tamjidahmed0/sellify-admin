import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetAuthorProducts } from '../hooks/useGetAuthorProducts';
import { useDeleteProduct } from '../hooks/useDeleteProduct';

export default function ProductsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const { data, isLoading } = useGetAuthorProducts();
    const { mutate: deleteMutate } = useDeleteProduct();

    // Track which row is being deleted for fade-out feedback
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filtered = data?.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ) ?? [];

    const handleDeleteClick = (p: (typeof filtered)[0]) => {
        Modal.confirm({
            title: 'Delete Product?',
            icon: <ExclamationCircleOutlined className="text-rose-500!" />,
            content: (
                <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-gray-800">"{p.name}"</span>?{' '}
                    This action cannot be undone.
                </p>
            ),
            okText: 'Delete',
            okButtonProps: { danger: true, className: 'rounded-lg' },
            cancelButtonProps: { className: 'rounded-lg' },
            centered: true,
            // Returning a Promise makes antd show a spinner on the OK button automatically
            onOk() {
                return new Promise<void>((resolve, reject) => {
                    setDeletingId(p.id);
                    deleteMutate(p.id, {
                        onSuccess: () => { setDeletingId(null); resolve(); },
                        onError: () => { setDeletingId(null); reject(); },
                    });
                });
            },
        });
    };

    // Returns color classes based on stock level
    const stockBadge = (stock: number) => {
        if (stock === 0) return 'bg-rose-50 text-rose-600 border-rose-200';
        if (stock <= 5) return 'bg-amber-50 text-amber-600 border-amber-200';
        return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    };

    const stockLabel = (stock: number) => {
        if (stock === 0) return 'Out of stock';
        if (stock <= 5) return `Low · ${stock}`;
        return String(stock);
    };

    return (
        <div className="space-y-6 w-full">

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Products</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isLoading ? 'Loading…' : `${data?.length ?? 0} products total`}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/products/add')}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200 shrink-0"
                >
                    <PlusOutlined />
                    Add Product
                </button>
            </div>

            {/* ── Table card ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Search bar */}
                <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-4">
                    <div className="relative w-full max-w-sm">
                        <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name…"
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition placeholder-gray-300"
                        />
                    </div>
                    {search && (
                        <span className="text-xs text-gray-400 shrink-0">
                            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Product</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Price</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Original</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Stock</th>
                                <th className="text-right px-6 py-3.5 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">

                            {/* Skeleton loading rows */}
                            {isLoading && Array.from({ length: 6 }).map((_, i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-gray-100 animate-pulse shrink-0" />
                                            <div className="h-3.5 w-32 bg-gray-100 rounded-lg animate-pulse" />
                                        </div>
                                    </td>
                                    {[40, 24, 20, 28].map((w, j) => (
                                        <td key={j} className="px-6 py-4">
                                            <div className={`h-3.5 w-${w} bg-gray-100 rounded-lg animate-pulse`} />
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse" />
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty state */}
                            {!isLoading && filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-4xl">📦</span>
                                            <p className="text-sm font-medium text-gray-500 mt-1">
                                                {search ? 'No products match your search' : 'No products yet'}
                                            </p>
                                            {!search && (
                                                <button
                                                    onClick={() => navigate('/products/add')}
                                                    className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                                                >
                                                    + Add your first product
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}

                            {/* Data rows */}
                            {!isLoading && filtered.map((p) => {
                                const isDeleting = deletingId === p.id;
                                const stock = p.inventory?.stock ?? 0;

                                return (
                                    <tr
                                        key={p.id}
                                        className={`group hover:bg-gray-50/60 transition-colors ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                                    >
                                        {/* Product image + name */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={p.image}
                                                    alt={p.name}
                                                    className="w-11 h-11 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0"
                                                />
                                                <span className="font-semibold text-gray-900 line-clamp-1">{p.name}</span>
                                            </div>
                                        </td>

                                        {/* Categories as small pill tags */}
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {p.categories?.map((c: { name: string }, i: number) => (
                                                    <span
                                                        key={i}
                                                        className="text-[11px] font-medium capitalize bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md"
                                                    >
                                                        {c.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>

                                        {/* Selling price */}
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-gray-900">${p.price}</span>
                                        </td>

                                        {/* Original price with strikethrough */}
                                        <td className="px-6 py-4">
                                            {p.originalPrice
                                                ? <span className="text-xs text-gray-400 line-through">${p.originalPrice}</span>
                                                : <span className="text-gray-300">—</span>
                                            }
                                        </td>

                                        {/* Stock level badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-[11px] font-semibold border px-2.5 py-1 rounded-full ${stockBadge(stock)}`}>
                                                {stockLabel(stock)}
                                            </span>
                                        </td>

                                        {/* Edit + Delete buttons */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => navigate(`/products/edit/${p.id}`)}
                                                    title="Edit"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                                >
                                                    <EditOutlined className="text-sm" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(p)}
                                                    title="Delete"
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                                >
                                                    <DeleteOutlined className="text-sm" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer — row count summary */}
                {!isLoading && filtered.length > 0 && (
                    <div className="px-6 py-3.5 border-t border-gray-50 bg-gray-50/40">
                        <p className="text-xs text-gray-400">
                            Showing{' '}
                            <span className="font-semibold text-gray-600">{filtered.length}</span>
                            {' '}of{' '}
                            <span className="font-semibold text-gray-600">{data?.length ?? 0}</span>
                            {' '}products
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}