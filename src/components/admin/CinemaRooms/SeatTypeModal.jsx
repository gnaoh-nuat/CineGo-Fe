import React, { useState, useEffect } from "react";

const OPTIONS = [
  { value: "STANDARD", label: "Thường", icon: "event_seat" },
  { value: "VIP", label: "VIP", icon: "workspace_premium" },
  { value: "COUPLE", label: "Đôi (Couple)", icon: "favorite" },
];

const SeatTypeModal = ({ isOpen, onClose, onSubmit, seat }) => {
  const [type, setType] = useState("STANDARD");

  useEffect(() => {
    if (!seat) return;
    setType((seat?.type || "STANDARD").toUpperCase());
  }, [seat]);

  if (!isOpen || !seat) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-5 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/50">Chỉnh loại ghế</p>
            <h3 className="text-lg font-semibold text-white">
              {seat.label || "Ghế"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="size-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition"
            title="Đóng"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-2">
          {OPTIONS.map((opt) => {
            const active = type === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setType(opt.value)}
                className={`w-full flex items-center justify-between rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">
                    {opt.icon}
                  </span>
                  {opt.label}
                </span>
                {active && (
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 text-white hover:bg-white/10"
          >
            Huỷ
          </button>
          <button
            onClick={() => onSubmit?.(type)}
            className="px-4 py-2 rounded-xl bg-primary text-white font-semibold"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatTypeModal;
