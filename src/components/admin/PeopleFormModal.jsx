import React, { useState, useEffect } from 'react';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const PeopleFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "ACTOR",
    image_url: "",
    bio: ""
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const response = await authenticatedFetch(SummaryApi.uploadImage.url, {
        method: SummaryApi.uploadImage.method,
        body: formDataUpload,
      });

      const result = await response.json();

      if (result.success) {
        let uploadedUrl = "";
        // Handle array response based on user request: data: [{ url: "..." }]
        if (Array.isArray(result.data) && result.data.length > 0) {
          uploadedUrl = result.data[0].url;
        } else if (result.data?.url) { // Fallback for object
          uploadedUrl = result.data.url;
        }

        if (uploadedUrl) {
          setFormData(prev => ({ ...prev, image_url: uploadedUrl }));
          setErrors(prev => ({ ...prev, image_url: "" })); // Clear error on success
        } else {
          console.warn("Upload response structure unexpected:", result);
          setErrors(prev => ({ ...prev, image_url: "Lỗi: Không lấy được link ảnh." }));
        }
      } else {
        setErrors(prev => ({ ...prev, image_url: result.message || "Upload thất bại" }));
      }

    } catch (error) {
      console.error("Upload error:", error);
      setErrors(prev => ({ ...prev, image_url: "Lỗi kết nối khi upload ảnh" }));
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!editData;

  const handleSubmit = () => {
    // Simple validation similar to MovieFormModal
    const newErrors = {};
    if (!formData.name) newErrors.name = "Họ tên không được để trống";
    // if (!formData.image_url) newErrors.image_url = "Vui lòng cung cấp link ảnh"; 
    // Image might be optional depending on strictness, but let's keep it required as per previous simple validation or make it optional? 
    // Previous code had: if (!formData.image_url) newErrors.image_url = "Vui lòng cung cấp link ảnh";
    // Let's keep it required for consistency.
    if (!formData.image_url) newErrors.image_url = "Vui lòng tải ảnh lên.";

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
            {isEditMode ? `Chỉnh sửa người: ${editData.name}` : "Thêm người mới"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form className="p-6 space-y-4">
          <div className="space-y-4">

            {/* Name */}
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

            {/* Role */}
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

            {/* Image Upload */}
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase text-center block">Ảnh đại diện <span className="text-red-500">*</span></label>

              <div className="flex justify-center">
                <div className="relative group">
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className={`block w-40 h-56 rounded-xl overflow-hidden border-2 bg-background-dark shadow-2xl cursor-pointer transition-all relative ${formData.image_url ? 'border-white/10' : 'border-dashed border-white/20 hover:border-primary/50 hover:bg-white/5'}`}
                  >
                    {formData.image_url ? (
                      <>
                        <img src={formData.image_url} alt="Avatar" className="w-full h-full object-cover" />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Thay đổi</span>
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                          <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                        </div>
                        <span className="text-xs font-medium uppercase tracking-wide">Tải ảnh lên</span>
                      </div>
                    )}

                    {uploading && (
                      <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
                        <span className="material-symbols-outlined animate-spin text-primary text-3xl">progress_activity</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              {errors.image_url && <p className="text-xs text-red-400 text-center">{errors.image_url}</p>}
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Tiểu sử</label>
              <textarea
                rows={4}
                value={formData.bio}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none resize-none custom-scrollbar"
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Nhập tóm tắt về người này..."
              />
            </div>

          </div>
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all"
          >
            {isEditMode ? "Lưu thay đổi" : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PeopleFormModal;
