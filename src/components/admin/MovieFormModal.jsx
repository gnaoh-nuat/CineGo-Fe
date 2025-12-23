import React, { useState, useEffect } from 'react';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const MovieFormModal = ({ isOpen, onClose, onSave, editData = null }) => {
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
  const [errors, setErrors] = useState({});
  const [directors, setDirectors] = useState([]);
  const [actors, setActors] = useState([]);
  const [genres, setGenres] = useState([]);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [showActorDropdown, setShowActorDropdown] = useState(false);
  const [showDirectorDropdown, setShowDirectorDropdown] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchDirectors();
      fetchActors();
      fetchGenres();
    }
  }, [isOpen]);

  // Fetch helper functions
  const fetchDirectors = async () => {
    try {
      const res = await authenticatedFetch(`${SummaryApi.getPeoples.url}?page=1&size=100&type=DIRECTOR`);
      const data = await res.json();
      if (data.success) setDirectors(data.data.items);
    } catch (error) { console.error("Err fetch directors", error); }
  };

  const fetchActors = async () => {
    try {
      const res = await authenticatedFetch(`${SummaryApi.getPeoples.url}?page=1&size=100&type=ACTOR`);
      const data = await res.json();
      if (data.success) setActors(data.data.items);
    } catch (error) { console.error("Err fetch actors", error); }
  };

  const fetchGenres = async () => {
    try {
      const res = await authenticatedFetch(`${SummaryApi.getGenres.url}?page=1&size=100`);
      const data = await res.json();
      // data format: { success: true, message: "...", data: { genres: [...] } }
      if (data.success) {
        if (data.data && Array.isArray(data.data.genres)) {
          setGenres(data.data.genres);
        } else if (Array.isArray(data.data)) {
          setGenres(data.data);
        } else {
          setGenres([]);
        }
      }
    } catch (error) { console.error("Err fetch genres", error); }
  };


  useEffect(() => {
    if (editData) {
      setFormData({
        title: editData.title || "",
        duration_minutes: editData.duration_minutes || "",
        director_id: editData.director_id || editData.director?.id || "",
        writer: editData.writer || "",
        release_date: editData.release_date?.split('T')[0] || "",
        description: editData.description || "",
        poster_urls: editData.poster_urls || [],
        trailer_url: editData.trailer_url || "",
        status: editData.status || "NOW_PLAYING",
        genre_ids: editData.genres?.map(g => Number(g.id)) || [],
        actor_ids: editData.actors?.map(a => Number(a.id)) || []
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [editData, isOpen]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];

    // Upload sequentially or parallel needed? API likely handles one by one or needs loop
    // But since user asked for "upload multiple files", let's loop
    // Note: SummaryApi.uploadImage usually takes single file 'file' key. 
    // If backend supports multiple, we might change logic. Assuming single file upload per request for now based on previous knowledge.

    try {
      for (const file of files) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const response = await authenticatedFetch(SummaryApi.uploadImage.url, {
          method: SummaryApi.uploadImage.method,
          body: formDataUpload,
        });

        const result = await response.json();
        if (result.success) {
          if (Array.isArray(result.data) && result.data.length > 0) {
            uploadedUrls.push(result.data[0].url);
          } else if (typeof result.data === 'string') {
            uploadedUrls.push(result.data);
          } else if (result.data?.url) {
            uploadedUrls.push(result.data.url);
          } else if (result.url) {
            uploadedUrls.push(result.url);
          }
        }
      }

      // Append new URLs to existing ones
      setFormData(prev => ({
        ...prev,
        poster_urls: [...prev.poster_urls, ...uploadedUrls]
      }));

    } catch (error) {
      console.error("Upload failed", error);
      alert("Có lỗi khi upload ảnh");
    } finally {
      setUploading(false);
    }
  };


  const removePoster = (index) => {
    const newPosters = [...formData.poster_urls];
    newPosters.splice(index, 1);
    setFormData({ ...formData, poster_urls: newPosters });
  }

  const toggleSelection = (id, field) => {
    const currentIds = formData[field] || [];
    const numId = Number(id);
    if (currentIds.includes(numId)) {
      setFormData({ ...formData, [field]: currentIds.filter(item => item !== numId) });
    } else {
      setFormData({ ...formData, [field]: [...currentIds, numId] });
    }
  };


  const validate = (data) => {
    const errs = {};
    if (!data.title?.toString().trim()) errs.title = "Tiêu đề là bắt buộc.";
    if (!data.duration_minutes || Number(data.duration_minutes) <= 0) errs.duration_minutes = "Thời lượng > 0.";
    if (!data.director_id) errs.director_id = "Đạo diễn là bắt buộc.";
    if (!data.release_date) errs.release_date = "Ngày công chiếu là bắt buộc.";
    if (data.poster_urls.length === 0) errs.poster_urls = "Cần ít nhất 1 poster.";

    return errs;
  };

  const handleSubmit = () => {
    const errs = validate(formData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSave(formData);
  };

  if (!isOpen) return null;
  const isEditMode = !!editData;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-surface-dark w-full max-w-4xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface-dark z-10">
          <h3 className="text-xl font-bold text-white">
            {isEditMode ? `Chỉnh sửa phim` : "Thêm phim mới"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Left Column */}
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Tên phim <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={formData.title}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  {errors.title && <p className="text-xs text-red-400">{errors.title}</p>}
                </div>

                {/* Status & Writer */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Trạng thái</label>
                    <div className="relative">
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none appearance-none"
                      >
                        <option value="NOW_PLAYING">Đang chiếu</option>
                        <option value="COMING_SOON">Sắp chiếu</option>
                        <option value="STOPPED">Đã dừng</option>
                      </select>
                      <span className="absolute right-4 top-3 text-gray-400 pointer-events-none material-symbols-outlined text-sm">expand_more</span>
                    </div>
                  </div>

                  {/* Writer */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Biên kịch</label>
                    <input
                      type="text"
                      value={formData.writer}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                      onChange={(e) => setFormData({ ...formData, writer: e.target.value })}
                    />
                  </div>
                </div>

                {/* Director Select (Collapsible Dropdown - Single Select) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Đạo diễn <span className="text-red-500">*</span></label>
                  <div className="relative">
                    {/* Trigger Box */}
                    <div
                      onClick={() => setShowDirectorDropdown(!showDirectorDropdown)}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors min-h-[46px]"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {formData.director_id && directors.find(d => Number(d.id) === Number(formData.director_id)) ? (
                          <>
                            <img
                              src={directors.find(d => Number(d.id) === Number(formData.director_id))?.image_url || 'https://placehold.co/40x40'}
                              className="size-6 rounded-full object-cover border border-white/10"
                              alt=""
                            />
                            <span className="text-sm text-gray-200 font-bold line-clamp-1">
                              {directors.find(d => Number(d.id) === Number(formData.director_id))?.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">Chọn đạo diễn...</span>
                        )}
                      </div>
                      <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform ${showDirectorDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>

                    {/* Dropdown Options */}
                    {showDirectorDropdown && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top w-full z-[60]">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                          <div className="space-y-1">
                            {Array.isArray(directors) && directors.map(d => {
                              const isSelected = Number(d.id) === Number(formData.director_id);
                              return (
                                <div
                                  key={d.id}
                                  onClick={() => {
                                    setFormData({ ...formData, director_id: d.id });
                                    setShowDirectorDropdown(false);
                                  }}
                                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                                >
                                  <div className={`flex-shrink-0 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'border-primary' : 'border-gray-500'}`}>
                                    {isSelected && <div className="size-2 bg-primary rounded-full"></div>}
                                  </div>
                                  <img src={d.image_url || 'https://placehold.co/40x40'} className="size-8 rounded-full object-cover border border-white/10" alt="" />
                                  <span className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-gray-300'}`}>{d.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.director_id && <p className="text-xs text-red-400">{errors.director_id}</p>}
                </div>

                {/* Trailer */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Trailer URL</label>
                  <input
                    type="text"
                    value={formData.trailer_url}
                    className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>

              </div>

              {/* Right Column */}
              <div className="space-y-4">

                {/* Duration & Release Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Thời lượng (phút)</label>
                    <input
                      type="number"
                      value={formData.duration_minutes}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                      onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                    />
                    {errors.duration_minutes && <p className="text-xs text-red-400">{errors.duration_minutes}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase">Ngày k/chiếu</label>
                    <input
                      type="date"
                      value={formData.release_date}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                      onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    />
                    {errors.release_date && <p className="text-xs text-red-400">{errors.release_date}</p>}
                  </div>
                </div>

                {/* Genres Multi-select (Collapsible Dropdown) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Thể loại</label>
                  <div className="relative">
                    {/* Trigger Box */}
                    <div
                      onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors min-h-[46px]"
                    >
                      <span className="text-sm text-gray-300 line-clamp-1">
                        {Array.isArray(genres) && genres
                          .filter(g => formData.genre_ids && formData.genre_ids.includes(Number(g.id)))
                          .map(g => g.name).join(', ') || "Chọn thể loại..."}
                      </span>
                      <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>

                    {/* Dropdown Options */}
                    {showGenreDropdown && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                          <div className="grid grid-cols-2 gap-1">
                            {Array.isArray(genres) && genres.map(g => {
                              const isSelected = formData.genre_ids && formData.genre_ids.includes(Number(g.id));
                              return (
                                <div
                                  key={g.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(g.id, 'genre_ids');
                                  }}
                                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                                >
                                  <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                                    {isSelected && <span className="material-symbols-outlined text-[10px] text-white">check</span>}
                                  </div>
                                  <span className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-gray-300'}`}>{g.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actors Multi-select (Collapsible Dropdown) */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase">Diễn viên</label>
                  <div className="relative">
                    {/* Trigger Box */}
                    <div
                      onClick={() => setShowActorDropdown(!showActorDropdown)}
                      className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white flex justify-between items-center cursor-pointer hover:border-primary/50 transition-colors min-h-[46px]"
                    >
                      <span className="text-sm text-gray-300 line-clamp-1">
                        {Array.isArray(actors) && actors
                          .filter(a => formData.actor_ids && formData.actor_ids.includes(Number(a.id)))
                          .map(a => a.name).join(', ') || "Chọn diễn viên..."}
                      </span>
                      <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform ${showActorDropdown ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>

                    {/* Dropdown Options */}
                    {showActorDropdown && (
                      <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-dark border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in origin-top">
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-2">
                          <div className="space-y-1">
                            {Array.isArray(actors) && actors.map(a => {
                              const isSelected = formData.actor_ids && formData.actor_ids.includes(Number(a.id));
                              return (
                                <div
                                  key={a.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSelection(a.id, 'actor_ids');
                                  }}
                                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-white/5'}`}
                                >
                                  <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-primary bg-primary' : 'border-gray-500'}`}>
                                    {isSelected && <span className="material-symbols-outlined text-[10px] text-white">check</span>}
                                  </div>
                                  <img src={a.image_url || 'https://placehold.co/40x40'} className="size-8 rounded-full object-cover border border-white/10" alt="" />
                                  <span className={`text-sm ${isSelected ? 'text-primary font-bold' : 'text-gray-300'}`}>{a.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Poster Upload Section */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-400 uppercase">Posters <span className="text-red-500">*</span></label>
                <label className="cursor-pointer px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-bold flex items-center gap-2 transition-colors">
                  <span className="material-symbols-outlined text-sm">cloud_upload</span>
                  {uploading ? "Đang tải lên..." : "Tải ảnh lên (Nhiều ảnh)"}
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </div>

              {formData.poster_urls.length === 0 && (
                <p className="text-sm text-gray-400 italic">Chưa có poster nào. Hãy upload ảnh.</p>
              )}

              {errors.poster_urls && <p className="text-xs text-red-400">{errors.poster_urls}</p>}

              {/* Poster Preview Grid */}
              {formData.poster_urls && formData.poster_urls.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
                  {formData.poster_urls.map((url, idx) => (
                    <div key={idx} className="relative group aspect-[2/3] rounded-lg overflow-hidden border border-white/10">
                      <img src={url} alt={`Poster ${idx}`} className="size-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removePoster(idx)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <span className="material-symbols-outlined text-[10px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Mô tả phim</label>
              <textarea
                rows={3}
                value={formData.description}
                className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-primary outline-none"
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-end gap-3 bg-surface-dark z-10">
          <button onClick={onClose} className="px-6 py-2.5 rounded-full border border-white/10 text-gray-400 font-bold hover:bg-white/5">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="px-6 py-2.5 rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:bg-red-600 transition-all disabled:opacity-50"
          >
            {isEditMode ? "Cập nhật" : "Tạo phim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieFormModal;