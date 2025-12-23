import React from "react";

const ProvinceFilter = ({ search, onSearchChange, onAdd }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
      <div className="max-w-md w-full">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 shadow-sm"
            placeholder="Tìm kiếm tỉnh thành..."
            type="text"
          />
        </div>
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 group shrink-0"
      >
        <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">
          add
        </span>
        Thêm mới
      </button>
    </div>
  );
};

export default ProvinceFilter;
