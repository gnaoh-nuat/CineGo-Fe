// src/components/admin/MovieFormModal.jsx
import React, { useState, useEffect } from 'react';

const MovieFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
  // Trạng thái khởi tạo mặc định
  const initialFormState = {
    title: "",
    duration_minutes: "",
    director_id: "",
    writer: "",
    release_date: "",
    description: "",
    poster_urls: [],
    trailer_url: "",
    status: "NOW_PLAYING",
    genre_ids: [],
    actor_ids: []
  };

  const [formData, setFormData] = useState(initialFormState);

  // - Đồng bộ dữ liệu khi mở Modal sửa hoặc thêm mới
  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        duration_minutes: editData.duration_minutes || "",
        director_id: editData.director_id || editData.director?.id || "",
        writer: editData.writer || "",
        release_date: editData.release_date?.split('T')[0] || "", // Lấy phần yyyy-mm-dd
        description: editData.description || "",
        poster_urls: editData.poster_urls || [],
        trailer_url: editData.trailer_url || "",
        status: editData.status || "NOW_PLAYING",
        // Chuyển đổi mảng Object thành mảng ID để gửi lên API PUT
        genre_ids: editData.genres?.map(g => Number(g.id)) || [],
        actor_ids: editData.actors?.map(a => Number(a.id)) || []
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editData, isOpen]);

  // Validation state and helpers
  const [errors, setErrors] = useState({});

  const isValidUrl = (str) => {
    if (!str) return false;
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const validate = (data) => {
    const errs = {};
    if (!data.title || !data.title.toString().trim()) errs.title = "Tiêu đề là bắt buộc.";
    if (!data.duration_minutes || Number(data.duration_minutes) <= 0) errs.duration_minutes = "Thời lượng phải lớn hơn 0.";
    if (!data.director_id || Number(data.director_id) <= 0) errs.director_id = "ID Đạo diễn là bắt buộc.";
    if (!data.release_date) errs.release_date = "Ngày công chiếu là bắt buộc.";
    if (data.trailer_url && data.trailer_url.toString().trim() && !isValidUrl(data.trailer_url)) errs.trailer_url = "URL trailer không hợp lệ.";

    if (!Array.isArray(data.poster_urls) || data.poster_urls.length === 0) {
      errs.poster_urls = "Ít nhất một URL poster là bắt buộc.";
    } else {
      for (let i = 0; i < data.poster_urls.length; i++) {
        if (!isValidUrl(data.poster_urls[i])) {
          errs.poster_urls = `Poster URL #${i + 1} không hợp lệ.`;
          break;
        }
      }
    }

    return errs;
  };

  useEffect(() => {
    setErrors(validate(formData));
  }, [formData]);

  const handleSubmit = () => {
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Stop submission if there are validation errors
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  const isEditMode = !!editData; // Kiểm tra đang là chế độ Sửa hay Thêm

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface-dark w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in">
        
        {/* Tiêu đề thay đổi theo chế độ */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? `Chỉnh sửa phim: ${editData.title}` : "Thêm phim mới"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Input (các trường tương ứng với body API yêu cầu) */}
        <form className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Tên phim</label>
              <input
                type="text"
                value={formData.title}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Thời lượng (phút)</label>
              <input
                type="number"
                min="0"
                value={formData.duration_minutes}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
              />
              {errors.duration_minutes && <p className="text-xs text-red-400 mt-1">{errors.duration_minutes}</p>}
            </div>

            {/* Director ID */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">ID Đạo diễn</label>
              <input
                type="number"
                min="0"
                value={formData.director_id}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, director_id: e.target.value })}
              />
              {errors.director_id && <p className="text-xs text-red-400 mt-1">{errors.director_id}</p>}
            </div>

            {/* Writer */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Writer</label>
              <input
                type="text"
                value={formData.writer}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
              />
            </div>

            {/* Release Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Ngày công chiếu</label>
              <input
                type="date"
                value={formData.release_date}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
              />
              {errors.release_date && <p className="text-xs text-red-400 mt-1">{errors.release_date}</p>}
            </div>

            {/* Trailer URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Trailer (URL)</label>
              <input
                type="text"
                value={formData.trailer_url}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
              />
              {errors.trailer_url && <p className="text-xs text-red-400 mt-1">{errors.trailer_url}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Trạng thái</label>
              <select
                value={formData.status}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="NOW_PLAYING">Đang chiếu</option>
                <option value="COMING_SOON">Sắp chiếu</option>
                <option value="STOPPED">Ngừng chiếu</option>
              </select>
            </div>

            {/* Genre IDs (comma separated) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Genre IDs (comma separated)</label>
              <input
                type="text"
                value={(formData.genre_ids || []).join(',')}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean).map(Number);
                  setFormData({ ...formData, genre_ids: arr });
                }}
              />
            </div>

            {/* Actor IDs (comma separated) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Actor IDs (comma separated)</label>
              <input
                type="text"
                value={(formData.actor_ids || []).join(',')}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => {
                  const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean).map(Number);
                  setFormData({ ...formData, actor_ids: arr });
                }}
              />
            </div>

            {/* Poster URLs - full width */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Poster URLs (one per line)</label>
              <textarea
                rows={3}
                value={(formData.poster_urls || []).join('\n')}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none resize-none"
                onChange={(e) => setFormData({ ...formData, poster_urls: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
              />
              <p className="text-xs text-white/60">Nhập mỗi URL poster trên một dòng.</p>
              {errors.poster_urls && <p className="text-xs text-red-400 mt-1">{errors.poster_urls}</p>}
            </div>

            {/* Description - full width */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Mô tả</label>
              <textarea
                rows={4}
                value={formData.description}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

          </div>
        </form>

        <div className="p-6 border-t border-white/5 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={Object.keys(errors).length > 0}
            className={`px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 transition ${Object.keys(errors).length > 0 ? 'opacity-50 cursor-not-allowed hover:bg-primary' : 'hover:bg-red-600'}`}
          >
            {isEditMode ? "Cập nhật thay đổi" : "Lưu phim mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFormModal;