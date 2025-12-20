import React from "react";

const SORT_OPTIONS = [
  { value: "POPULAR", label: "Phổ biến nhất" },
  { value: "TITLE_ASC", label: "Tên phim (A-Z)" },
  { value: "NEWEST", label: "Mới nhất" },
  { value: "RATING", label: "Đánh giá cao" },
];

const SortBar = ({ totalItems, sortBy, onChangeSort }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xl font-bold text-white">Kết quả tìm kiếm</h2>
        <span className="text-white/40 text-sm font-medium">
          {totalItems} phim
        </span>
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={sortBy}
          onChange={(e) => onChangeSort(e.target.value)}
          className="w-full bg-surface-dark border border-white/20 rounded-lg text-sm text-white py-2 px-3 focus:ring-primary focus:border-primary"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SortBar;
