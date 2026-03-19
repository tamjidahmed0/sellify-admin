import Icon from '../components/Icons';
import { SLIDES } from '../data/mockData';

export default function SlidesPage() {
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
        {SLIDES.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 group hover:border-indigo-200 transition"
          >
            <div className="flex items-center gap-4 min-w-0">
              <img src={s.img} alt={s.title} className="w-24 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="min-w-0">
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
                <p className="font-semibold text-gray-900 mt-1 truncate">{s.title}</p>
                <p className="text-sm text-gray-500 truncate">
                  {s.subtitle} · <span className="text-indigo-500">{s.link}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                <Icon.edit />
              </button>
              <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
                <Icon.trash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}