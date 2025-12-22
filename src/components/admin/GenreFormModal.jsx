import React, { useState, useEffect } from 'react';

const GenreFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setFormData({ name: editData.name || '', description: editData.description || '' });
    } else {
      setFormData({ name: '', description: '' });
    }
    setErrors({});
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isEditMode = !!editData;

  const validate = (data) => {
    const errs = {};
    if (!data.name || !data.name.toString().trim()) errs.name = 'Tên thể loại là bắt buộc.';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface-dark w-full max-w-lg rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? `Chỉnh sửa thể loại: ${editData.name}` : 'Thêm Thể loại Mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Tên thể loại</label>
              <input
                type="text"
                value={formData.name}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Hành động"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Mô tả (Tùy chọn)</label>
              <textarea
                rows={4}
                value={formData.description}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none resize-none custom-scrollbar"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả ngắn về thể loại"
              />
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5">Hủy</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all">
            {isEditMode ? 'Lưu thay đổi' : 'Lưu Thể loại'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenreFormModal;
