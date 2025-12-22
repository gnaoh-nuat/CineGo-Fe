import React, { useState, useEffect } from 'react';

const UserFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        phone: "",
        password: "",
        role: "USER",
        gender: "MALE",
        dob: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (editData) {
            setFormData({
                full_name: editData.full_name || "",
                email: editData.email || "",
                phone: editData.phone || "",
                password: "", // Don't show password for edit
                role: editData.role || "USER",
                gender: editData.gender || "MALE",
                dob: editData.dob ? editData.dob.split('T')[0] : "",
            });
        } else {
            setFormData({
                full_name: "",
                email: "",
                phone: "",
                password: "",
                role: "USER",
                gender: "MALE",
                dob: "",
            });
        }
        setErrors({});
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const isEditMode = !!editData;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.full_name) newErrors.full_name = "Họ tên không được để trống";
        if (!formData.email) newErrors.email = "Email không được để trống";
        if (!isEditMode && !formData.password) newErrors.password = "Mật khẩu không được để trống";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clean data before sending
        const dataToSend = { ...formData };
        if (isEditMode && !dataToSend.password) {
            delete dataToSend.password;
        }

        onSave(dataToSend);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-surface-dark w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">

                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">
                        {isEditMode ? `Cập nhật người dùng: ${editData.full_name}` : "Thêm người dùng mới"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form Body */}
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder="Nguyễn Văn A"
                            />
                            {errors.full_name && <p className="text-xs text-red-400 mt-1">{errors.full_name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="email@example.com"
                                disabled={isEditMode}
                            />
                            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Số điện thoại</label>
                            <input
                                type="text"
                                value={formData.phone}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="0912345678"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Vai trò</label>
                            <select
                                value={formData.role}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Giới tính</label>
                            <select
                                value={formData.gender || ""}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            >
                                <option value="">-- Chọn --</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>

                        {/* DOB */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">Ngày sinh</label>
                            <input
                                type="date"
                                value={formData.dob}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">
                                {isEditMode ? "Mật khẩu mới (Để trống nếu không đổi)" : "Mật khẩu"}
                            </label>
                            <input
                                type="password"
                                value={formData.password}
                                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="******"
                            />
                            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
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

export default UserFormModal;
