// import Icon from '../components/Icons';
// import { SLIDES } from '../data/mockData';

// export default function SlidesPage() {
//   return (
//     <div className="space-y-5">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-xl font-semibold text-gray-900">Hero Slides</h1>
//           <p className="text-sm text-gray-500">{SLIDES.length} slides</p>
//         </div>
//         <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
//           <Icon.plus /> Add Slide
//         </button>
//       </div>

//       <div className="space-y-3">
//         {SLIDES.map((s) => (
//           <div
//             key={s.id}
//             className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 group hover:border-indigo-200 transition"
//           >
//             <div className="flex items-center gap-4 min-w-0">
//               <img src={s.img} alt={s.title} className="w-24 h-14 rounded-xl object-cover bg-gray-100 shrink-0" />
//               <div className="min-w-0">
//                 <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
//                   {s.badge}
//                 </span>
//                 <p className="font-semibold text-gray-900 mt-1 truncate">{s.title}</p>
//                 <p className="text-sm text-gray-500 truncate">
//                   {s.subtitle} · <span className="text-indigo-500">{s.link}</span>
//                 </p>
//               </div>
//             </div>
//             <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
//               <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
//                 <Icon.edit />
//               </button>
//               <button className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition">
//                 <Icon.trash />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }












import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useGetSlides, useDeleteSlide } from '../hooks/useSlides';
import { useState } from 'react';

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

export default function SlidesPage() {
  const navigate = useNavigate();
  const { data: slides = [], isLoading } = useGetSlides();
  const { mutate: deleteMutate } = useDeleteSlide();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (slide: typeof slides[0]) => {
    Modal.confirm({
      title: 'Delete Slide?',
      icon: <ExclamationCircleOutlined className="text-rose-500!" />,
      content: (
        <p className="text-sm text-gray-500 mt-1">
          Are you sure you want to delete{' '}
          <span className="font-semibold text-gray-800">"{slide.title}"</span>?
          This action cannot be undone.
        </p>
      ),
      okText: 'Delete',
      okButtonProps: { danger: true, className: 'rounded-lg' },
      cancelButtonProps: { className: 'rounded-lg' },
      centered: true,
      onOk() {
        return new Promise<void>((resolve, reject) => {
          setDeletingId(slide.id);
          deleteMutate(slide.id, {
            onSuccess: () => {
              message.success('Slide deleted');
              setDeletingId(null);
              resolve();
            },
            onError: () => {
              message.error('Something went wrong!');
              setDeletingId(null);
              reject();
            },
          });
        });
      },
    });
  };

  return (
    <div className="space-y-6 w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hero Slides</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isLoading ? 'Loading…' : `${slides.length} slides total`}
          </p>
        </div>
        <button
          onClick={() => navigate('/slides/add')}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200 shrink-0"
        >
          <PlusOutlined />
          Add Slide
        </button>
      </div>

      {/* Slides list */}
      <div className="space-y-3">

        {/* Skeleton loading */}
        {isLoading && Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <Skeleton className="w-24 h-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-64" />
            </div>
          </div>
        ))}

        {/* Empty state */}
        {!isLoading && slides.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center gap-3 text-gray-400">
            <span className="text-4xl">🖼️</span>
            <p className="text-sm font-medium text-gray-500">No slides yet</p>
            <button
              onClick={() => navigate('/slides/add')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
            >
              + Add your first slide
            </button>
          </div>
        )}

        {/* Slide cards */}
        {!isLoading && slides.map((s) => (
          <div
            key={s.id}
            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4 group hover:border-indigo-200 hover:shadow-md transition-all ${deletingId === s.id ? 'opacity-40 pointer-events-none' : ''
              }`}
          >
            {/* Left — image + info */}
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={s.image}
                alt={s.title}
                className="w-24 h-14 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                  {s.badge}
                </span>
                <p className="font-semibold text-gray-900 mt-1.5 truncate">{s.title}</p>
                <p className="text-sm text-gray-500 truncate mt-0.5">
                  {s.description}
                  {s.link && (
                    <>
                      {' · '}
                      <span className="text-indigo-500">{s.link}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Right — actions, visible on hover */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition">
              <button
                onClick={() => navigate(`/slides/edit/${s.id}`)}
                title="Edit"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
              >
                <EditOutlined className="text-sm" />
              </button>
              <button
                onClick={() => handleDelete(s)}
                title="Delete"
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
              >
                <DeleteOutlined className="text-sm" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}