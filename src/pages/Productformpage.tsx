import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Upload, Button } from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import { PlusOutlined, InboxOutlined, ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useGetCategories } from '../hooks/useGetCategories';
import { useGetProductPrev } from '../hooks/useGetPreviewProduct';
import { useCreatePost } from '../hooks/useCreatePost';
import { message } from 'antd';
import { useUpdateProduct } from '../hooks/useUpdateProduct';
import ProductFormSkeleton from '../components/ui/ProductFormSkeleton';

export interface ProductFormData {
    name: string;
    description: string;
    categoryId: string[];
    originalPrice: string;
    price: string;
    stock: number;
    thumbnail: File | null;
    images: File[];
    existingThumbnailUrl?: string | null;
    existingImageUrls?: string[];
}

export default function ProductFormPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;

    const [form] = Form.useForm();
    const [thumbnailFile, setThumbnailFile] = useState<UploadFile | null>(null);
    const [imageFiles, setImageFiles] = useState<UploadFile[]>([]);

    const { data: categories = [], isLoading: catLoading } = useGetCategories();
    const { data: productDetail, isLoading: detailLoading } = useGetProductPrev(id ?? '');
    const { mutate: createMutate, isPending: createPending } = useCreatePost();
    const { mutate: updateMutate, isPending: updatePending } = useUpdateProduct();

    // Pre-fill form fields when editing an existing product
    useEffect(() => {
        if (!isEditMode || !productDetail) return;

        form.setFieldsValue({
            name: productDetail.name,
            description: productDetail.description,
            categoryId: productDetail.categories?.map((c: { id: string }) => c.id) ?? [],
            originalPrice: productDetail.originalPrice ? Number(productDetail.originalPrice) : undefined,
            price: productDetail.price ? Number(productDetail.price) : undefined,
            stock: productDetail.inventory?.stock ?? 0,
        });

        if (productDetail.image) {
            setThumbnailFile({
                uid: 'existing-thumb',
                name: 'thumbnail',
                status: 'done',
                url: productDetail.image,
            } as UploadFile);
        }

        if (productDetail.images?.length) {
            setImageFiles(
                productDetail.images.map((img: { url: string }, i: number) => ({
                    uid: `existing-img-${i}`,
                    name: `image-${i + 1}`,
                    status: 'done',
                    url: img.url,
                } as UploadFile))
            );
        }
    }, [productDetail, isEditMode]);

    // Build payload and call create or update mutation
    const handleSubmit = async () => {
        const values = await form.validateFields();

        const payload: ProductFormData = {
            name: values.name,
            description: values.description ?? '',
            categoryId: values.categoryId ?? [],
            originalPrice: String(values.originalPrice ?? ''),
            price: String(values.price),
            stock: values.stock ?? 0,
            thumbnail: thumbnailFile?.originFileObj ?? null,
            images: imageFiles.map((f) => f.originFileObj as File).filter(Boolean),
            existingThumbnailUrl: thumbnailFile?.url ?? null,
            existingImageUrls: imageFiles
                .filter((f) => f.url && !f.originFileObj)
                .map((f) => f.url as string),
        };

        if (isEditMode) {
            updateMutate(
                { id, ...payload },
                {
                    onSuccess: () => {
                        message.success('Product updated');
                        navigate('/products');
                    },
                    onError: () => message.error('Something went wrong!'),
                },
            );

        } else {
            createMutate(
                {
                    name: payload.name,
                    categoryId: payload.categoryId,
                    images: payload.images,
                    description: payload.description,
                    originalPrice: payload.originalPrice,
                    price: payload.price,
                    stock: payload.stock,
                    thumbnail: payload.thumbnail,
                },
                {
                    onSuccess: () => {
                        message.success('Product added');
                        navigate('/products');
                    },
                    onError: () => message.error('Something went wrong!'),
                }
            );
        }
    };

    // Live discount percentage from original vs selling price
    const originalPrice = Form.useWatch('originalPrice', form);
    const price = Form.useWatch('price', form);
    const discount =
        originalPrice && price && +originalPrice > +price
            ? Math.round(((+originalPrice - +price) / +originalPrice) * 100)
            : null;

    // Thumbnail — antd default list hidden, custom full preview rendered inside dragger
    const thumbnailProps: UploadProps = {
        beforeUpload: (file) => {
            setThumbnailFile({
                uid: file.uid,
                name: file.name,
                status: 'done',
                originFileObj: file,
                url: URL.createObjectURL(file),
            } as UploadFile);
            return false;
        },
        fileList: [],
        maxCount: 1,
        accept: 'image/*',
        showUploadList: false,
    };

    // Product images — up to 6, supports both new uploads and existing URLs
    const imagesProps: UploadProps = {
        beforeUpload: (file) => {
            setImageFiles((prev) => {
                if (prev.length >= 6) return prev;
                return [
                    ...prev,
                    {
                        uid: file.uid,
                        name: file.name,
                        status: 'done',
                        originFileObj: file,
                        url: URL.createObjectURL(file),
                    } as UploadFile,
                ];
            });
            return false;
        },
        onRemove: (file) => setImageFiles((prev) => prev.filter((f) => f.uid !== file.uid)),
        fileList: imageFiles,
        multiple: true,
        maxCount: 6,
        accept: 'image/*',
        listType: 'picture-card',
        showUploadList: { showPreviewIcon: false },
    };

    const isPending = createPending || updatePending; // replace with: createPending || updatePending

    // Full-page spinner while fetching product data in edit mode
    if (isEditMode && detailLoading) {
        return (
            <ProductFormSkeleton />
        );
    }

    return (
        <div className="w-full space-y-6 pb-10">

            {/* ── Page header with back button and action buttons ── */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/products')}
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 flex items-center justify-center text-gray-500 transition shadow-sm shrink-0"
                    >
                        <ArrowLeftOutlined />
                    </button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                            {isEditMode ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
                            {isEditMode
                                ? 'Update the details of an existing product'
                                : 'Fill in the details to publish a new product'}
                        </p>
                    </div>
                </div>

                {/* Action buttons — top right, hidden on mobile (shown at bottom instead) */}
                <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <Button
                        onClick={() => navigate('/products')}
                        className="rounded-xl border-gray-200 text-gray-500 hover:border-gray-300! h-10 px-5"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isPending}
                        icon={isEditMode ? <SaveOutlined /> : <PlusOutlined />}
                        className="bg-indigo-600 hover:bg-indigo-500! border-none rounded-xl h-10 px-6 font-medium"
                    >
                        {isPending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Product'}
                    </Button>
                </div>
            </div>

            {/* ── Main form — 2/3 left + 1/3 right on large screens ── */}
            <Form form={form} layout="vertical" requiredMark={false}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    {/* ── Left column: basic info, pricing, images ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Basic information */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle>Basic Information</SectionTitle>

                            <Form.Item
                                name="name"
                                label={<FieldLabel>Product Name <Required /></FieldLabel>}
                                rules={[{ required: true, message: 'Product name is required' }]}
                                className="mb-5"
                            >
                                <Input
                                    placeholder="e.g. Sony WH-1000XM5"
                                    size="large"
                                    className="rounded-xl border-gray-200 bg-gray-50 hover:border-indigo-300"
                                />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label={<FieldLabel>Description</FieldLabel>}
                                className="mb-0"
                            >
                                <Input.TextArea
                                    placeholder="Write a short product description..."
                                    rows={4}
                                    className="rounded-xl border-gray-200 bg-gray-50 resize-none hover:border-indigo-300"
                                />
                            </Form.Item>
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle>Pricing</SectionTitle>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <Form.Item
                                    name="originalPrice"
                                    label={<FieldLabel>Original Price</FieldLabel>}
                                    className="mb-0"
                                >
                                    <InputNumber
                                        placeholder="0.00"
                                        prefix={<span className="text-gray-400 font-medium mr-1">$</span>}
                                        min={0}
                                        size="large"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label={<FieldLabel>Selling Price <Required /></FieldLabel>}
                                    rules={[{ required: true, message: 'Selling price is required' }]}
                                    className="mb-0"
                                >
                                    <InputNumber
                                        placeholder="0.00"
                                        prefix={<span className="text-gray-400 font-medium mr-1">$</span>}
                                        min={0}
                                        size="large"
                                        className="w-full rounded-xl border-gray-200 bg-gray-50"
                                    />
                                </Form.Item>
                            </div>

                            {/* Live discount indicator */}
                            {discount !== null && discount > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mt-4">
                                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-full">
                                        ✓ {discount}% discount
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        Customers save ${(+originalPrice - +price).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Product images */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <SectionTitle className="mb-0">Product Images</SectionTitle>
                                <span className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                                    {imageFiles.length} / 6
                                </span>
                            </div>

                            <Upload {...imagesProps}>
                                {imageFiles.length < 6 && (
                                    <div className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-indigo-500 py-2">
                                        <PlusOutlined className="text-base" />
                                        <span className="text-[11px] font-medium">Add</span>
                                    </div>
                                )}
                            </Upload>

                            <p className="text-xs text-gray-400 mt-3">
                                First image shown as main · PNG, JPG, WEBP
                            </p>
                        </div>
                    </div>

                    {/* ── Right column: thumbnail, category, stock ── */}
                    <div className="space-y-6">

                        {/* Thumbnail */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <SectionTitle>
                                Thumbnail <Required />
                            </SectionTitle>

                            {/* Custom thumbnail zone — shows full image preview when selected */}
                            <Upload.Dragger
                                {...thumbnailProps}
                                className={
                                    thumbnailFile
                                        ? "border-0! bg-transparent! p-0!"
                                        : "rounded-2xl! border-gray-200! bg-gray-50! hover:border-indigo-300! hover:bg-indigo-50/40!"
                                }
                            >
                                {thumbnailFile ? (
                                    /* Full image preview — fills the dragger area */
                                    <div className="relative group rounded-2xl overflow-hidden aspect-square w-full">
                                        <img
                                            src={thumbnailFile.url}
                                            alt="thumbnail preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {/* Hover overlay with change/remove actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                            <span className="text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                Click to change
                                            </span>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); }}
                                                className="text-white/80 hover:text-rose-400 text-xs transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* Empty state placeholder */
                                    <div className="flex flex-col items-center gap-2 py-5">
                                        <span className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 text-2xl">
                                            <InboxOutlined />
                                        </span>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-600">Drop image here</p>
                                            <p className="text-xs text-gray-400 mt-0.5">or click to browse</p>
                                            <p className="text-xs text-gray-300 mt-0.5">PNG · JPG · WEBP</p>
                                        </div>
                                    </div>
                                )}
                            </Upload.Dragger>
                        </div>

                        {/* Category and stock */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                            <SectionTitle>Organization</SectionTitle>

                            <Form.Item
                                name="categoryId"
                                label={<FieldLabel>Category <Required /></FieldLabel>}
                                rules={[{ required: true, message: 'Select at least one category' }]}
                                className="mb-0"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select categories"
                                    loading={catLoading}
                                    size="large"
                                    className="w-full rounded-xl"
                                    allowClear
                                    options={categories.map((c: { id: string; name: string }) => ({
                                        label: c.name,
                                        value: c.id,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                name="stock"
                                initialValue={0}
                                label={<FieldLabel>Stock Quantity</FieldLabel>}
                                className="mb-0"
                            >
                                <InputNumber
                                    min={0}
                                    size="large"
                                    className="w-full rounded-xl border-gray-200 bg-gray-50"
                                />
                            </Form.Item>
                        </div>

                        {/* Mobile action buttons — only visible below sm breakpoint */}
                        <div className="flex flex-col gap-3 sm:hidden">
                            <Button
                                type="primary"
                                onClick={handleSubmit}
                                loading={isPending}
                                icon={isEditMode ? <SaveOutlined /> : <PlusOutlined />}
                                size="large"
                                block
                                className="bg-indigo-600 hover:bg-indigo-500! border-none rounded-xl font-medium"
                            >
                                {isPending ? 'Saving…' : isEditMode ? 'Save Changes' : 'Add Product'}
                            </Button>
                            <Button
                                onClick={() => navigate('/products')}
                                size="large"
                                block
                                className="rounded-xl border-gray-200 text-gray-500"
                            >
                                Cancel
                            </Button>
                        </div>

                    </div>
                </div>
            </Form>
        </div>
    );
}

// ── Small helper components ────────────────────────────────────────────────────

function SectionTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return (
        <p className={`text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5 ${className}`}>
            {children}
        </p>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {children}
        </span>
    );
}

function Required() {
    return <span className="text-rose-400 normal-case font-bold ml-0.5">*</span>;
}