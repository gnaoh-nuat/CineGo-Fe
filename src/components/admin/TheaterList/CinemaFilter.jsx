import React from "react";

const CinemaFilter = ({
  search,
  setSearch,
  provinceId,
  setProvinceId,
  provinceOptions,
  setPage,
}) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Search Input */}
      <div className="relative flex-1 group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">
          search
        </span>
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Tìm kiếm theo tên rạp, địa chỉ..."
          className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
        />
      </div>

      {/* Province Select */}
      <div className="w-full lg:w-64 relative group">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">
          location_on
        </span>
        <select
          value={provinceId}
          onChange={(e) => {
            setPage(1);
            setProvinceId(e.target.value);
          }}
          className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-12 pr-10 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm appearance-none cursor-pointer"
        >
          <option value="">Tất cả tỉnh thành</option>
          {provinceOptions.map((p) => (
            <option key={p.id} value={p.id} className="bg-surface-dark">
              {p.name}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-lg">
          expand_more
        </span>
      </div>
    </div>
  );
};

export default CinemaFilter;
