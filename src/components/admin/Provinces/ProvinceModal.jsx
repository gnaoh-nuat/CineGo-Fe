import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const defaultForm = { name: "" };

const ProvinceModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({ name: initial?.name || "" });
    } else {
      setForm(defaultForm);
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.warn("Vui lòng nhập tên Tỉnh / Thành");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 transition-all">
      <div
        className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">
              {initial ? "Cập nhật" : "Tạo mới"}
            </p>
            <h3 className="text-xl font-bold text-white">Tỉnh / Thành phố</h3>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase">
              Tên địa danh
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
              className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {initial ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvinceModal;
