import React, { useState, useEffect } from 'react';

const VoucherFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
    const [formData, setFormData] = useState({
        code: "",
        discount_percent: "",
        start_date: "",
        end_date: "",
        is_active: true,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                code: editData.code || "",
                discount_percent: editData.discount_percent || "",
                start_date: editData.start_date ? editData.start_date.slice(0, 16) : "", // Format datetime-local
                end_date: editData.end_date ? editData.end_date.slice(0, 16) : "",
                is_active: editData.is_active ?? true,
            });
        } else {
            setFormData({
                code: "",
                discount_percent: "",
                start_date: "",
                end_date: "",
                is_active: true,
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const isEditMode = !!editData;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.code) newErrors.code = "Mã voucher không được để trống";
        if (!formData.discount_percent) newErrors.discount_percent = "Phần trăm giảm số phải nhập";
        if (formData.discount_percent < 0 || formData.discount_percent > 100) newErrors.discount_percent = "Phần trăm giảm từ 0-100";
        if (!formData.start_date) newErrors.start_date = "Chưa chọn ngày bắt đầu";
        if (!formData.end_date) newErrors.end_date = "Chưa chọn ngày kết thúc";

        if (new Date(formData.end_date) <= new Date(formData.start_date)) {
            newErrors.end_date = "Ngày kết thúc phải sau ngày bắt đầu";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Format dates back to ISO if needed, or send as is depending on backend
        // Backend seems to accept ISO strings. datetime-local value is YYYY-MM-DDTHH:mm
        // We can append :00Z or let backend handle it.
        // Let's send ISO string constructed from the input.
        const dataToSend = {
            ...formData,
            start_date: new Date(formData.start_date).toISOString(),
            end_date: new Date(formData.end_date).toISOString(),
            discount_percent: Number(formData.discount_percent)
        };

        onSave(dataToSend);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {isEditMode ? `Cập nhật Voucher: ${editData.code}` : "Thêm Voucher mới"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Code */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Mã Voucher</label>
                            <input
                                type="text"
                                value={formData.code}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none uppercase"
                                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                placeholder="SALE50"
                            />
                            {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
                        </div>

                        {/* Discount Percent */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Giảm giá (%)</label>
                            <input
                                type="number"
                                value={formData.discount_percent}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, discount_percent: e.target.value })}
                                placeholder="10"
                                min="0" max="100"
                            />
                            {errors.discount_percent && <p className="text-xs text-red-400 mt-1">{errors.discount_percent}</p>}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Ngày bắt đầu</label>
                            <input
                                type="datetime-local"
                                value={formData.start_date}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                            />
                            {errors.start_date && <p className="text-xs text-red-400 mt-1">{errors.start_date}</p>}
                        </div>

                        {/* End Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Ngày kết thúc</label>
                            <input
                                type="datetime-local"
                                value={formData.end_date}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                            />
                            {errors.end_date && <p className="text-xs text-red-400 mt-1">{errors.end_date}</p>}
                        </div>

                        {/* Is Active */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.is_active ? 'bg-success' : 'bg-gray-600'}`}>
                                    <div className={`h-4 w-4 bg-white rounded-full transition-transform ${formData.is_active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </div>
                                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                                    Kích hoạt
                                </span>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                            </label>
                        </div>

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
                            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
                        >
                            {isEditMode ? "Lưu thay đổi" : "Thêm mới"}
                        </button>
                    </div>
                </form>


            </div>
        </div>
    );
};

export default VoucherFormModal;
