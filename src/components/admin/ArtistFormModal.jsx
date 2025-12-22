import React, { useState, useEffect } from 'react';

const ArtistFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "ACTOR",
    image_url: "",
    bio: ""
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.name || "",
        type: editData.type || "ACTOR",
        image_url: editData.image_url || "",
        bio: editData.bio || ""
      });
    } else {
      setFormData({ name: "", type: "ACTOR", image_url: "", bio: "" });
    }
    setErrors({});
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = !!editData;

  const handleSubmit = () => {
    // Logic validate đơn giản tương tự MovieFormModal của bạn
    const newErrors = {};
    if (!formData.name) newErrors.name = "Họ tên không được để trống";
    if (!formData.image_url) newErrors.image_url = "Vui lòng cung cấp link ảnh";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface-dark w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Header - Tái sử dụng style của bạn */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? `Chỉnh sửa nghệ sĩ: ${editData.name}` : "Thêm nghệ sĩ mới"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-4">
          <div className="space-y-4">
            
            {/* Tên nghệ sĩ */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Họ và tên</label>
              <input
                type="text"
                value={formData.name}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Leonardo DiCaprio"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            {/* Loại nghệ sĩ */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Vai trò</label>
              <select
                value={formData.type}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="ACTOR">Diễn viên</option>
                <option value="DIRECTOR">Đạo diễn</option>
              </select>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Link ảnh đại diện (URL)</label>
              <input
                type="text"
                value={formData.image_url}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://..."
              />
              {errors.image_url && <p className="text-xs text-red-400 mt-1">{errors.image_url}</p>}
            </div>

            {/* Tiểu sử */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Tiểu sử</label>
              <textarea
                rows={4}
                value={formData.bio}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none resize-none custom-scrollbar"
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Nhập tóm tắt về nghệ sĩ..."
              />
            </div>

          </div>
        </form>

        {/* Footer - Giữ nguyên style button của bạn */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
          >
            {isEditMode ? "Lưu thay đổi" : "Lưu nghệ sĩ"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistFormModal;