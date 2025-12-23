import React from "react";
import { formatDateTime } from "../../../utils/helper";

const CheckInHistory = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <div className="bg-surface-dark p-6 rounded-2xl border border-white/5 shadow-lg flex-1 flex flex-col overflow-hidden min-h-[300px]">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <h3 className="text-white font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-white/50">
            history
          </span>
          Lịch sử quét
        </h3>
        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded text-white/60 uppercase tracking-wider">
          {items.length} gần nhất
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {items.map((item, idx) => (
          <div
            key={`${item.booking_code}-${idx}`}
            className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 flex items-center justify-between gap-3 transition-colors group animate-fade-in-up"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`size-10 rounded-lg flex items-center justify-center font-bold shadow-inner ${
                  item.success
                    ? "bg-success/10 text-success border border-success/20"
                    : "bg-danger/10 text-danger border border-danger/20"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  {item.success ? "check_small" : "priority_high"}
                </span>
              </div>
              <div>
                <p className="text-white font-mono font-bold text-sm tracking-wide group-hover:text-primary transition-colors">
                  {item.booking_code}
                </p>
                <p className="text-white/40 text-[11px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">
                    schedule
                  </span>
                  {formatDateTime(item.time)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInHistory;
