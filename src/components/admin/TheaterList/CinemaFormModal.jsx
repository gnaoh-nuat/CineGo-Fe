import React, { useState, useEffect } from "react";
import SummaryApi from "../../../common";
import { authenticatedFetch } from "../../../utils/helper";

const defaultForm = { name: "", address: "", province_id: "", image_urls: [] };

const CinemaFormModal = ({
  isOpen,
  onClose,
  editingCinema,
  provinces,
  onSuccess,
  token,
}) => {
  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCinema) {
      setForm({
        name: editingCinema.name || "",
        address: editingCinema.address || "",
        province_id: editingCinema.province_id || "",
        image_urls: editingCinema.image_urls || [],
      });
    } else {
      setForm(defaultForm);
    }
  }, [editingCinema]);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await authenticatedFetch(SummaryApi.uploadImage.url, {
          method: SummaryApi.uploadImage.method,
          body: formData,
        });
        const data = await res.json();
        if (data?.success) {
          const d = data.data;
          if (!d) {
            // nothing returned
          } else if (Array.isArray(d)) {
            for (const item of d) {
              if (typeof item === "string") uploadedUrls.push(item);
              else if (item?.url) uploadedUrls.push(item.url);
            }
          } else if (typeof d === "string") {
            uploadedUrls.push(d);
          } else if (d.url) {
            uploadedUrls.push(d.url);
          } else if (d.urls && Array.isArray(d.urls)) {
            uploadedUrls.push(...d.urls);
          }
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }

    if (uploadedUrls.length) {
      setForm((prev) => ({
        ...prev,
        image_urls: [...prev.image_urls, ...uploadedUrls],
      }));
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.address || !form.province_id) {
      alert("Vui lòng nhập đủ thông tin!");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        province_id: Number(form.province_id),
      };

      const url = editingCinema
        ? `${SummaryApi.updateCinema.url}/${editingCinema.id}`
        : SummaryApi.createCinema.url;

      const method = editingCinema
        ? SummaryApi.updateCinema.method
        : SummaryApi.createCinema.method;

      const res = await authenticatedFetch(url, {
        method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data?.success) {
        onSuccess();
      } else {
        alert(data?.message || "Lưu thất bại");
      }
    } catch (err) {
      console.error("Save error", err);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-surface-dark border border-white/10 w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-bold text-white">
              {editingCinema ? "Chỉnh sửa rạp" : "Thêm rạp mới"}
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Điền thông tin chi tiết bên dưới
            </p>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Tên Rạp
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                placeholder="VD: CineGo Royal City"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Tỉnh / Thành
              </label>
              <div className="relative">
                <select
                  value={form.province_id}
                  onChange={(e) =>
                    setForm({ ...form, province_id: e.target.value })
                  }
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Chọn khu vực</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id} className="bg-surface-dark">
                      {p.name}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                  expand_more
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Địa chỉ chi tiết
              </label>
              <input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
                placeholder="VD: 72A Nguyễn Trãi, Thanh Xuân, Hà Nội"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                Hình ảnh ({form.image_urls.length})
              </label>
              <label
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-xs font-bold cursor-pointer hover:bg-primary/20 transition-colors ${
                  uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(Array.from(e.target.files))}
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <div className="size-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />{" "}
                    Đang tải...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">
                      cloud_upload
                    </span>{" "}
                    Tải ảnh lên
                  </>
                )}
              </label>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {form.image_urls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40"
                >
                  <img
                    src={url || "https://placehold.co/400x300?text=No+Image"}
                    alt="cinema"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/400x300?text=Error";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          image_urls: p.image_urls.filter((_, i) => i !== idx),
                        }))
                      }
                      className="size-8 rounded-full bg-white/10 hover:bg-danger text-white flex items-center justify-center transition-colors"
                      title="Xóa ảnh"
                    >
                      <span className="material-symbols-outlined text-base">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              ))}
              <label className="aspect-video rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 flex flex-col items-center justify-center text-white/30 hover:text-white/60 cursor-pointer transition-all gap-1">
                <span className="material-symbols-outlined text-2xl">
                  add_photo_alternate
                </span>
                <span className="text-[10px] font-medium">Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleUpload(Array.from(e.target.files))}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 flex justify-end gap-3 bg-white/[0.02]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && (
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {editingCinema ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaFormModal;
