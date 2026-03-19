import { useEffect, useState, useRef } from "react";
import { Modal, Form, Input, Button } from "antd";
import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import type { Category } from "../../types";

interface AddCategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (category: Category) => void;
    initialData?: Category;
    isPending?: boolean;
}

export default function AddCategoryModal({
    open,
    onClose,
    onSubmit,
    initialData,
    isPending = false,
}: AddCategoryModalProps) {
    const [form] = Form.useForm();
    const [preview, setPreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const isEditMode = !!initialData;

    // Pre-fill form when editing
    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({ name: initialData.name });
            setPreview(initialData.img || null);
        }
    }, [open, initialData]);

    // Reset on close
    useEffect(() => {
        if (!open) {
            form.resetFields();
            setPreview(null);
            setImageFile(null);
        }
    }, [open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const values = await form.validateFields();
        onSubmit({
            id: initialData?.id ?? Date.now(),
            name: values.name,
            img: preview || "",
            // TODO: pass imageFile to API instead of base64 preview
            products: initialData?.products ?? 0,
        });
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            title={
                <div>
                    <p className="text-lg font-bold text-gray-900 tracking-tight">
                        {isEditMode ? "Edit Category" : "Add Category"}
                    </p>
                    <p className="text-xs text-gray-400 font-normal mt-0.5">
                        {isEditMode ? "Update the category details" : "Fill in the details below"}
                    </p>
                </div>
            }
            footer={
                <div className="flex items-center justify-between">
                    <Button onClick={onClose} className="rounded-xl text-gray-500 border-gray-200">
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleSubmit}
                        loading={isPending}
                        icon={isEditMode ? undefined : <PlusOutlined />}
                        className="bg-indigo-600 hover:!bg-indigo-500 border-none rounded-xl px-6"
                    >
                        {isPending ? "Saving…" : isEditMode ? "Save Changes" : "Add Category"}
                    </Button>
                </div>
            }
            width={420}
            centered
            styles={{ body: { padding: "24px 28px" } }}
            destroyOnClose
        >
            <Form form={form} layout="vertical" requiredMark={false}>

                {/* Image upload — full preview when selected */}
                <Form.Item label={<FieldLabel>Category Image</FieldLabel>} className="mb-5">
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />

                    {/* Click anywhere on the zone to upload */}
                    <div
                        onClick={() => fileRef.current?.click()}
                        className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex items-center justify-center group
                            ${preview
                                ? "border-0 h-48"
                                : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/40 h-36"
                            }`}
                    >
                        {preview ? (
                            <>
                                {/* Full image preview fills the zone */}
                                <img
                                    src={preview}
                                    alt="category preview"
                                    className="w-full h-full object-cover"
                                />
                                {/* Hover overlay */}
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
                            <div className="flex flex-col items-center gap-2 py-2">
                                <span className="w-11 h-11 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-500 text-xl transition">
                                    <InboxOutlined />
                                </span>
                                <div className="text-center">
                                    <p className="text-sm font-medium text-gray-600">Drop image here</p>
                                    <p className="text-xs text-gray-400 mt-0.5">or click to browse · PNG, JPG, WEBP</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Form.Item>

                {/* Category name */}
                <Form.Item
                    name="name"
                    label={<FieldLabel>Category Name <span className="text-rose-400">*</span></FieldLabel>}
                    rules={[{ required: true, message: "Category name is required" }]}
                    className="mb-0"
                >
                    <Input
                        placeholder="e.g. Electronics"
                        size="large"
                        className="rounded-xl border-gray-200 bg-gray-50 hover:border-indigo-300"
                    />
                </Form.Item>

            </Form>
        </Modal>
    );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
            {children}
        </span>
    );
}