

const ProductFormSkeleton = () => {
    return (
        <div className="w-full space-y-6 pb-10 animate-pulse">

            {/* Skeleton header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-200 shrink-0" />
                    <div className="space-y-2">
                        <div className="h-6 w-40 bg-gray-200 rounded-lg" />
                        <div className="h-3.5 w-56 bg-gray-100 rounded-lg" />
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-3">
                    <div className="h-10 w-20 bg-gray-100 rounded-xl" />
                    <div className="h-10 w-32 bg-gray-200 rounded-xl" />
                </div>
            </div>

            {/* Skeleton two-column grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic info card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="h-3 w-32 bg-gray-200 rounded-lg" />
                        <div className="h-11 w-full bg-gray-100 rounded-xl" />
                        <div className="h-24 w-full bg-gray-100 rounded-xl" />
                    </div>

                    {/* Pricing card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="h-3 w-20 bg-gray-200 rounded-lg" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="h-11 bg-gray-100 rounded-xl" />
                            <div className="h-11 bg-gray-100 rounded-xl" />
                        </div>
                    </div>

                    {/* Images card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="h-3 w-28 bg-gray-200 rounded-lg" />
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-xl" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-6">

                    {/* Thumbnail card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                        <div className="h-3 w-20 bg-gray-200 rounded-lg" />
                        <div className="aspect-square w-full bg-gray-100 rounded-2xl" />
                    </div>

                    {/* Organization card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                        <div className="h-3 w-24 bg-gray-200 rounded-lg" />
                        <div className="h-11 w-full bg-gray-100 rounded-xl" />
                        <div className="h-11 w-full bg-gray-100 rounded-xl" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductFormSkeleton