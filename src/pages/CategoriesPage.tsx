import { useState } from "react";
import { Modal, message } from "antd";
import { PlusOutlined, ExclamationCircleOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AddCategoryModal, { type CategorySubmitData } from "../components/ui/AddCategoryModal";
import type { Category } from "../types";
import { useGetCategories } from "../hooks/useGetCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { useUpdateCategory } from "../hooks/useupdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";

export default function CategoriesPage() {
    const { data: categories = [], isLoading } = useGetCategories();
    const { mutate: createMutate, isPending: createPending } = useCreateCategory();
    const { mutate: updateMutate, isPending: updatePending } = useUpdateCategory();
    const { mutate: deleteMutate } = useDeleteCategory();

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleAdd = (data: CategorySubmitData) => {
        // Pass name + actual File object to the API
        createMutate(
            { name: data.name, image: data.imageFile ?? undefined },
            {
                onSuccess: () => {
                    setAddOpen(false);
                    message.success("Category added");
                },
                onError: () => message.error("Something went wrong!"),
            }
        );
    };

    const handleEdit = (data: CategorySubmitData) => {
        if (!data.id) return;
        updateMutate(
            {
                id: data.id,
                name: data.name,
                image: data.imageFile,
            },
            {
                onSuccess: () => {
                    setEditTarget(null);
                    message.success("Category updated");
                },
                onError: () => message.error("Something went wrong!"),
            }
        );
    };

    const handleDeleteClick = (c: Category) => {
        Modal.confirm({
            title: "Delete Category?",
            icon: <ExclamationCircleOutlined className="text-rose-500!" />,
            content: (
                <p className="text-sm text-gray-500 mt-1">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-800">"{c.name}"</span>?{" "}
                    This action cannot be undone.
                </p>
            ),
            okText: "Delete",
            okButtonProps: { danger: true, className: "rounded-lg" },
            cancelButtonProps: { className: "rounded-lg" },
            centered: true,
            // Returning a Promise keeps the OK button in loading state until done
            onOk() {
                return new Promise<void>((resolve, reject) => {
                    setDeletingId(c.id);
                    deleteMutate(c.id, {
                        onSuccess: () => {
                            setDeletingId(null);
                            message.success("Category deleted");
                            resolve();
                        },
                        onError: () => {
                            setDeletingId(null);
                            message.error("Something went wrong!");
                            reject();
                        },
                    });
                });
            },
        });
    };

    return (
        <div className="space-y-6 w-full">

            {/* ── Page header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categories</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {isLoading ? "Loading…" : `${categories.length} categories total`}
                    </p>
                </div>
                <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200 shrink-0"
                >
                    <PlusOutlined />
                    Add Category
                </button>
            </div>

            {/* ── Category grid ── */}
            {isLoading ? (
                // Skeleton loading grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 animate-pulse">
                            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
                            <div className="space-y-2 flex-1">
                                <div className="h-3.5 w-24 bg-gray-100 rounded-lg" />
                                <div className="h-3 w-16 bg-gray-100 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : categories.length === 0 ? (
                // Empty state
                <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
                    <span className="text-4xl">🗂️</span>
                    <p className="text-sm font-medium text-gray-500">No categories yet</p>
                    <button
                        onClick={() => setAddOpen(true)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 transition"
                    >
                        + Add your first category
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {categories.map((c) => (
                        <div
                            key={c.id}
                            className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between group hover:border-indigo-200 hover:shadow-md transition-all ${deletingId === c.id ? "opacity-40 pointer-events-none" : ""}`}
                        >
                            <div className="flex items-center gap-4 min-w-0">
                                {/* Category image */}
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                    {c.image ? (
                                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl">🖼️</div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 truncate">{c.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{c.productCount ?? 0} products</p>
                                </div>
                            </div>

                            {/* Action buttons — visible on hover */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0 ml-2">
                                <button
                                    onClick={() => setEditTarget(c)}
                                    title="Edit"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                                >
                                    <EditOutlined className="text-sm" />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(c)}
                                    title="Delete"
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                >
                                    <DeleteOutlined className="text-sm" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            <AddCategoryModal
                open={addOpen}
                isPending={createPending}
                onClose={() => setAddOpen(false)}
                onSubmit={handleAdd}
            />

            {/* Edit Modal — same modal, initialData triggers edit mode */}
            <AddCategoryModal
                open={!!editTarget}
                isPending={updatePending}
                initialData={editTarget ?? undefined}
                onClose={() => setEditTarget(null)}
                onSubmit={handleEdit}
            />
        </div>
    );
}