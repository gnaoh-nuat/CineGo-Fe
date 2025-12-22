import React, { useState, useEffect } from 'react';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const FoodFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
    const [formData, setFormData] = useState({
        name: "",
        image_url: "",
        price: "",
    });
    const [errors, setErrors] = useState({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name || "",
                image_url: editData.image_url || "",
                price: editData.price || "",
            });
        } else {
            setFormData({
                name: "",
                image_url: "",
                price: "",
            });
        }
        setErrors({});
        setUploading(false);
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const isEditMode = !!editData;

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type (optional but recommended)
        if (!file.type.startsWith('image/')) {
            setErrors({ ...errors, image_url: "Chỉ chấp nhận file ảnh!" });
            return;
        }

        setUploading(true);
        setErrors({ ...errors, image_url: null });

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        try {
            const response = await authenticatedFetch(SummaryApi.uploadImage.url, {
                method: SummaryApi.uploadImage.method,
                body: formDataUpload,
            });

            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const result = await response.json();
                if (result.success) {
                    let uploadedUrl = "";
                    if (Array.isArray(result.data) && result.data.length > 0) {
                        uploadedUrl = result.data[0].url;
                    } else if (typeof result.data === 'string') {
                        uploadedUrl = result.data;
                    } else if (result.data && result.data.url) {
                        uploadedUrl = result.data.url;
                    } else if (result.data && result.data.file_path) {
                        uploadedUrl = result.data.file_path;
                    } else if (result.url) {
                        uploadedUrl = result.url;
                    }

                    if (uploadedUrl) {
                        setFormData(prev => ({ ...prev, image_url: uploadedUrl }));
                    } else {
                        console.warn("Upload response:", result);
                        setErrors({ ...errors, image_url: "Upload thành công nhưng không lấy được link ảnh." });
                    }
                } else {
                    setErrors({ ...errors, image_url: result.message || "Upload thất bại" });
                }
            } else {
                // Handle non-JSON response (e.g. 401 text/plain)
                const text = await response.text();
                console.error("Upload non-JSON response:", text);
                setErrors({ ...errors, image_url: "Lỗi upload: " + text });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setErrors({ ...errors, image_url: "Lỗi kết nối hoặc lỗi xử lý: " + error.message });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) newErrors.name = "Tên đồ ăn không được để trống";
        // if (!formData.image_url) newErrors.image_url = "Vui lòng chọn ảnh"; // Optional: require image
        if (!formData.price) newErrors.price = "Giá không được để trống";
        if (formData.price < 0) newErrors.price = "Giá không được âm";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {isEditMode ? `Cập nhật Đồ ăn: ${editData.name}` : "Thêm Đồ ăn mới"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Tên Đồ ăn / Thức uống</label>
                        <input
                            type="text"
                            value={formData.name}
                            className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ví dụ: Bắp rang bơ"
                        />
                        {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Ảnh mô tả</label>

                        <div className="flex items-center gap-4">
                            {/* File Input - Hidden but triggered by label or button */}
                            <label className="cursor-pointer px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-gray-400">cloud_upload</span>
                                <span className="text-sm text-gray-300 font-bold">
                                    {uploading ? "Đang tải lên..." : "Chọn ảnh từ máy"}
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={uploading}
                                />
                            </label>

                            {/* OR Input URL directly */}
                            <input
                                type="text"
                                value={formData.image_url}
                                className="flex-1 bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                placeholder="Hoặc dán link ảnh..."
                            />
                        </div>

                        {errors.image_url && <p className="text-xs text-red-400 mt-1">{errors.image_url}</p>}

                        {/* Image Preview */}
                        {formData.image_url && (
                            <div className="mt-2 h-40 w-full rounded-lg bg-surface border border-white/5 overflow-hidden flex items-center justify-center relative group">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="h-full object-contain"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                                {/* Remove Image Button */}
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, image_url: "" })}
                                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase">Giá bán (VNĐ)</label>
                        <input
                            type="number"
                            value={formData.price}
                            className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="50000"
                        />
                        {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-white/5 flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default FoodFormModal;
