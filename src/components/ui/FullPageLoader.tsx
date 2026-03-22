
const FullPageLoader = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">

                {/* Animated logo mark */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 animate-pulse" />
                    </div>
                    {/* Spinning ring */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent border-t-indigo-500 animate-spin" />
                </div>

                {/* Brand name */}
                <div className="text-center">
                    <p className="text-white font-semibold text-lg tracking-tight">Sellify</p>
                    <p className="text-slate-400 text-sm mt-0.5">Loading your dashboard…</p>
                </div>

                {/* Progress dots */}
                <div className="flex items-center gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FullPageLoader