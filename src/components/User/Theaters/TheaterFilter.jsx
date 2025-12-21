import React from "react";
import { MdMyLocation, MdSearch } from "react-icons/md";

const TheaterFilter = ({
  provinces = [],
  selectedProvince,
  onProvinceChange,
  searchTerm,
  onSearchChange,
  loadingProvinces = false,
}) => {
  return (
    <div className="bg-surface-dark border border-white/10 rounded-xl shadow-xl px-4 py-4 md:px-6 md:py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="p-2 rounded-lg bg-primary/15 border border-primary/30 text-primary">
          <MdMyLocation className="text-2xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.12em] text-white/40 font-semibold">
            Chọn tỉnh / thành
          </span>
          <div className="mt-1">
            <select
              className="bg-white/5 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary min-w-[200px]"
              value={selectedProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              disabled={loadingProvinces}
            >
              <option value="" className="bg-background-dark text-white">
                Tất cả
              </option>
              {provinces.map((province) => (
                <option
                  key={province.id}
                  value={province.id}
                  className="bg-background-dark text-white"
                >
                  {province.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="w-full md:w-[340px]">
        <label className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <MdSearch className="text-white/50 text-xl" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm rạp theo tên hoặc địa chỉ"
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 flex-1"
          />
        </label>
      </div>
    </div>
  );
};

export default TheaterFilter;
