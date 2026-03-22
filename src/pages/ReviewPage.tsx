import { useState } from 'react';
import { Modal, Select, message } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined, DeleteOutlined, StarFilled } from '@ant-design/icons';
import { useGetReviews, useDeleteReview, type Review, type ReviewsQuery } from '../hooks/useReviewHooks';

const LIMIT = 10;

// ── Star rating display 
function Stars({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ color: i <= rating ? 'orange' : 'lightgray' }}>★</span>
            ))}
        </div>
    );
}

// ── Rating bar for distribution ────────────────────────────────
function RatingBar({ label, count, total }: { label: number; count: number; total: number }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1 w-10 shrink-0">
                <span className="text-gray-600 font-medium">{label}</span>
                <StarFilled className="text-amber-400 text-[10px]" />
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-gray-400 w-6 text-right">{count}</span>
        </div>
    );
}

// ── Skeleton row ───────────────────────────────────────────────
function SkeletonRow() {
    return (
        <div className="p-5 flex gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                    <div className="h-3.5 w-24 bg-gray-100 rounded-lg" />
                    <div className="h-3.5 w-20 bg-gray-100 rounded-lg" />
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-lg" />
                <div className="h-3 w-2/3 bg-gray-100 rounded-lg" />
            </div>
        </div>
    );
}

// ── Main page ──────────────────────────────────────────────────
export default function ReviewsPage() {
    const [query, setQuery] = useState<ReviewsQuery>({
        page: 1, limit: LIMIT, rating: '',
    });
    const [search, setSearch] = useState('');

    const { data, isLoading, isFetching } = useGetReviews(query);
    const { mutate: deleteMutate } = useDeleteReview();

    const reviews = data?.data ?? [];
    const meta = data?.meta;
    const stats = data?.stats;

    const setFilter = (patch: Partial<ReviewsQuery>) =>
        setQuery((prev) => ({ ...prev, page: 1, ...patch }));

    // Filter reviews by search (client-side for name/comment)
    const filtered = search
        ? reviews.filter((r) =>
            r.user.name.toLowerCase().includes(search.toLowerCase()) ||
            r.product.name.toLowerCase().includes(search.toLowerCase()) ||
            r.comment?.toLowerCase().includes(search.toLowerCase())
        )
        : reviews;

    const handleDelete = (review: Review) => {
        Modal.confirm({
            title: 'Delete Review?',
            icon: <ExclamationCircleOutlined className="text-rose-500!" />,
            content: (
                <p className="text-sm text-gray-500 mt-1">
                    Delete review by{' '}
                    <span className="font-semibold text-gray-800">{review.user.name}</span>?
                    This cannot be undone.
                </p>
            ),
            okText: 'Delete',
            okButtonProps: { danger: true, className: 'rounded-lg' },
            cancelButtonProps: { className: 'rounded-lg' },
            centered: true,
            onOk() {
                return new Promise<void>((resolve, reject) => {
                    deleteMutate(review.id, {
                        onSuccess: () => { message.success('Review deleted'); resolve(); },
                        onError: () => { message.error('Something went wrong!'); reject(); },
                    });
                });
            },
        });
    };

    return (
        <div className="space-y-6 w-full">

            {/* Page header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Reviews</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                    {isLoading ? 'Loading…' : `${meta?.total ?? 0} total reviews`}
                </p>
            </div>

            {/* Stats row */}
            {!isLoading && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {/* Average rating card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                        <div className="text-center">
                            <p className="text-5xl font-black text-gray-900 tracking-tight">{stats.average}</p>
                            <Stars rating={Math.round(stats.average)} />
                            <p className="text-xs text-gray-400 mt-1">{stats.total} reviews</p>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            {[5, 4, 3, 2, 1].map((r) => {
                                const d = stats.distribution.find((x) => x.rating === r);
                                return <RatingBar key={r} label={r} count={d?.count ?? 0} total={stats.total} />;
                            })}
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Breakdown</p>
                        {[
                            {
                                label: 'Positive (4-5★)',
                                count: stats.distribution.filter((d) => d.rating >= 4).reduce((a, d) => a + d.count, 0),
                                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                            },
                            {
                                label: 'Neutral (3★)',
                                count: stats.distribution.find((d) => d.rating === 3)?.count ?? 0,
                                color: 'text-amber-600 bg-amber-50 border-amber-200',
                            },
                            {
                                label: 'Negative (1-2★)',
                                count: stats.distribution.filter((d) => d.rating <= 2).reduce((a, d) => a + d.count, 0),
                                color: 'text-rose-600 bg-rose-50 border-rose-200',
                            },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${item.color}`}>
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Review list */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Filter bar */}
                <div className="px-6 py-4 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <SearchOutlined className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name, product, comment…"
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition placeholder-gray-300"
                        />
                    </div>

                    {/* Rating filter */}
                    <Select
                        value={query.rating}
                        onChange={(v) => setFilter({ rating: v })}
                        className="w-36"
                        options={[
                            { label: 'All Ratings', value: '' },
                            { label: '⭐⭐⭐⭐⭐ 5 Star', value: 5 },
                            { label: '⭐⭐⭐⭐ 4 Star', value: 4 },
                            { label: '⭐⭐⭐ 3 Star', value: 3 },
                            { label: '⭐⭐ 2 Star', value: 2 },
                            { label: '⭐ 1 Star', value: 1 },
                        ]}
                    />

                    {isFetching && !isLoading && (
                        <span className="text-xs text-gray-400 animate-pulse shrink-0">Updating…</span>
                    )}
                </div>

                {/* Review cards */}
                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        Array.from({ length: LIMIT }).map((_, i) => <SkeletonRow key={i} />)
                    ) : filtered.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-2 text-gray-400">
                            <span className="text-4xl">⭐</span>
                            <p className="text-sm font-medium text-gray-500">No reviews found</p>
                        </div>
                    ) : (
                        filtered.map((review) => (
                            <div key={review.id} className="p-5 flex gap-4 group hover:bg-gray-50/60 transition-colors">

                                {/* User avatar */}
                                <div className="shrink-0">
                                    {review.user.picture ? (
                                        <img
                                            src={review.user.picture}
                                            alt={review.user.name}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-100"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                                            {review.user.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Review content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="font-semibold text-gray-900 text-sm">{review.user.name}</p>
                                                <Stars rating={review.rating} />
                                                <span className="text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                                                   {Number(review.rating)}.0
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">{review.user.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                            <span className="text-xs text-gray-400">
                                                {new Date(review.createdAt).toLocaleDateString('en', {
                                                    month: 'short', day: 'numeric', year: 'numeric',
                                                })}
                                            </span>
                                            {/* Delete — visible on hover */}
                                            <button
                                                onClick={() => handleDelete(review)}
                                                className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition"
                                                title="Delete review"
                                            >
                                                <DeleteOutlined className="text-xs" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Comment */}
                                    {review.comment ? (
                                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                                    ) : (
                                        <p className="text-xs text-gray-400 mt-2 italic">No comment</p>
                                    )}

                                    {/* Product tag */}
                                    <div className="flex items-center gap-2 mt-3">
                                        {review.product.image && (
                                            <img
                                                src={review.product.image}
                                                alt={review.product.name}
                                                className="w-6 h-6 rounded-lg object-cover bg-gray-100 border border-gray-100"
                                            />
                                        )}
                                        <span className="text-xs text-indigo-600 font-medium truncate">
                                            {review.product.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/40 flex items-center justify-between gap-4">
                        <p className="text-xs text-gray-400">
                            Showing{' '}
                            <span className="font-semibold text-gray-600">
                                {(meta.page - 1) * meta.limit + 1}–{Math.min(meta.page * meta.limit, meta.total)}
                            </span>{' '}
                            of <span className="font-semibold text-gray-600">{meta.total}</span>
                        </p>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setQuery((p) => ({ ...p, page: p.page! - 1 }))}
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
                                            onClick={() => setQuery((prev) => ({ ...prev, page: p as number }))}
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
                                onClick={() => setQuery((p) => ({ ...p, page: p.page! + 1 }))}
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