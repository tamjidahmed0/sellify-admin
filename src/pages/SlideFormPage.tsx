import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { ArrowLeftOutlined, InboxOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useGetSlideById, useCreateSlide, useUpdateSlide } from '../hooks/useSlides';

// ── Skeleton ───────────────────────────────────────────────────
function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`bg-gray-100 rounded-xl animate-pulse ${className}`} />;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {children}
        </span>
    );
}

// ── Main page ──────────────────────────────────────────────────
export default function SlideFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [form] = Form.useForm();
    const fileRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Fetch existing slide in edit mode
    const { data: slide, isLoading: slideLoading } = useGetSlideById(id ?? '');

    // Pre-fill form when editing
    useEffect(() => {
        if (!slide) return;
        form.setFieldsValue({
            badge: slide.badge,
            title: slide.title,
            description: slide.description,
            link: slide.link,
        });
        setPreview(slide.image);
    }, [slide]);

    // Create mutation
    const { mutate: create, isPending: createPending } = useCreateSlide();

    // Update mutation  
    const { mutate: update, isPending: updatePending } = useUpdateSlide();

    const isPending = createPending || updatePending;

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();

        const formData = new FormData();
        formData.append('badge', values.badge);
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('link', values.link ?? '');
        if (imageFile) formData.append('image', imageFile);

        if (isEditMode) {
            update(
                { id: id!, formData },
                {
                    onSuccess: () => { message.success('Slide updated'); navigate('/slides'); },
                    onError: () => message.error('Something went wrong!'),
                }
            );
        } else {
            create(formData, {
                onSuccess: () => { message.success('Slide created'); navigate('/slides'); },
                onError: () => message.error('Something went wrong!'),
            });
        }
    };

    // Loading skeleton in edit mode
    if (isEditMode && slideLoading) {
        return (
            <div className="w-full space-y-6 pb-10 animate-pulse">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-10 h-10 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <Skeleton className="h-48" />
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-11" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 pb-10">

            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/slides')}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center text-gray-500 transition shadow-sm shrink-0"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                            {isEditMode ? 'Edit Slide' : 'Add New Slide'}
                        </h1>
                        <p className="text-xs text-gray-400 mt-0.5">
                            {isEditMode ? 'Update the slide details' : 'Fill in the details below'}
                        </p>
                    </div>
                </div>

                {/* Desktop save button */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <Button onClick={() => navigate('/slides')} className="rounded-xl border-gray-200 text-gray-500 h-10 px-5">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isPending}
                        icon={isEditMode ? <SaveOutlined /> : <PlusOutlined />}
                        className="bg-indigo-600 hover:bg-indigo-500! border-none rounded-xl h-10 px-6"
                    >
                        {isPending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Slide'}
                    </Button>
                </div>
            </div>

            {/* Form — two column layout on large screens */}
            <Form form={form} layout="vertical" requiredMark={false}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* Left — image upload (1/3) */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                            Slide Image {!isEditMode && <span className="text-rose-400">*</span>}
                        </p>
                        <input
                            ref={fileRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                        <div
                            onClick={() => fileRef.current?.click()}
                            className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center group ${preview ? 'border-0 aspect-video' : 'border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40 h-40'
                                }`}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                                        <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            Click to change
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setPreview(null); setImageFile(null); }}
                                            className="text-white/70 hover:text-rose-400 text-xs transition"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 py-4">
                                    <span className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 text-xl transition">
                                        <InboxOutlined />
                                    </span>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-gray-600">Drop image here</p>
                                        <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
                                        <p className="text-xs text-gray-300 mt-0.5">PNG · JPG · WEBP</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">Recommended: 1920×600px</p>
                    </div>

                    {/* Right — text fields (2/3) */}
                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-1">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Slide Content</p>

                        {/* Badge */}
                        <Form.Item
                            name="badge"
                            label={<FieldLabel>Badge <span className="text-rose-400">*</span></FieldLabel>}
                            rules={[{ required: true, message: 'Badge is required' }]}
                        >
                            <Input placeholder="e.g. New Arrival" size="large" className="rounded-xl border-gray-200 bg-gray-50" />
                        </Form.Item>

                        {/* Title */}
                        <Form.Item
                            name="title"
                            label={<FieldLabel>Title <span className="text-rose-400">*</span></FieldLabel>}
                            rules={[{ required: true, message: 'Title is required' }]}
                        >
                            <Input placeholder="e.g. Summer Collection 2026" size="large" className="rounded-xl border-gray-200 bg-gray-50" />
                        </Form.Item>

                        {/* Description */}
                        <Form.Item
                            name="description"
                            label={<FieldLabel>Description <span className="text-rose-400">*</span></FieldLabel>}
                            rules={[{ required: true, message: 'Description is required' }]}
                        >
                            <Input.TextArea
                                placeholder="Short description for the slide…"
                                rows={4}
                                className="rounded-xl border-gray-200 bg-gray-50 resize-none"
                            />
                        </Form.Item>

                        {/* Link */}
                        <Form.Item
                            name="link"
                            label={<FieldLabel>Link URL</FieldLabel>}
                            className="mb-0"
                        >
                            <Input placeholder="e.g. /products" size="large" className="rounded-xl border-gray-200 bg-gray-50" />
                        </Form.Item>
                    </div>

                </div>
            </Form>

            {/* Mobile buttons */}
            <div className="flex flex-col gap-3 sm:hidden">
                <Button
                    type="primary"
                    onClick={handleSubmit}
                    loading={isPending}
                    icon={isEditMode ? <SaveOutlined /> : <PlusOutlined />}
                    size="large"
                    block
                    className="bg-indigo-600 hover:bg-indigo-500! border-none rounded-xl"
                >
                    {isPending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Slide'}
                </Button>
                <Button onClick={() => navigate('/slides')} size="large" block className="rounded-xl border-gray-200 text-gray-500">
                    Cancel
                </Button>
            </div>
        </div>
    );
}