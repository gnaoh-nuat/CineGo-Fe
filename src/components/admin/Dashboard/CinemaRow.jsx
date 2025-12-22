import React from "react";

const CinemaRow = ({ cinema }) => (
  <div className="flex items-start gap-3 rounded-2xl border border-white/5 bg-surface-dark/80 p-3 hover:border-primary/40 transition-colors">
    <div className="rounded-lg bg-primary/10 p-2 text-primary">
      <span className="material-symbols-outlined text-lg">theater_comedy</span>
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-white line-clamp-1">
        {cinema.name}
      </p>
      <p className="text-xs text-white/50 line-clamp-2">{cinema.address}</p>
      <p className="text-[11px] text-white/40 mt-1">{cinema.province_name}</p>
    </div>
    <div className="text-right">
      <p className="text-xs text-white/50">Vé đã bán</p>
      <p className="text-sm font-bold text-success">
        {cinema.total_tickets_sold?.toLocaleString("vi-VN") || "0"}
      </p>
    </div>
  </div>
);

export default CinemaRow;
