import React from "react";

const CinemaRoomFilter = ({
  provinces = [],
  cinemas = [],
  selectedProvinceId,
  selectedCinemaId,
  onSelectProvince,
  onSelectCinema,
}) => {
  const currentCinema = cinemas.find((c) => c.id == selectedCinemaId);

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8 items-end animate-fade-in-up">
      {/* Tỉnh/Thành */}
      <div className="w-full md:w-64 relative group">
        <label className="block text-xs font-bold text-white/50 uppercase mb-2 group-focus-within:text-primary transition-colors">
          Tỉnh / Thành phố
        </label>
        <div className="relative">
          <select
            value={selectedProvinceId}
            onChange={(e) => onSelectProvince(e.target.value)}
            className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer transition-all shadow-sm"
          >
            <option value="">Chọn tỉnh thành</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id} className="bg-surface-dark">
                {p.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
            expand_more
          </span>
        </div>
      </div>

      {/* Rạp */}
      <div className="w-full md:w-80 relative group">
        <label className="block text-xs font-bold text-white/50 uppercase mb-2 group-focus-within:text-primary transition-colors">
          Rạp chiếu phim <span className="text-primary">*</span>
        </label>
        <div className="relative">
          <select
            value={selectedCinemaId}
            onChange={(e) => onSelectCinema(e.target.value)}
            disabled={!selectedProvinceId}
            className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
          >
            <option value="">Chọn rạp phim</option>
            {cinemas.map((c) => (
              <option key={c.id} value={c.id} className="bg-surface-dark">
                {c.name}
              </option>
            ))}
          </select>
          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
            expand_more
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="ml-auto hidden md:block">
        {currentCinema ? (
          <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-4 py-2.5 rounded-xl animate-fade-in-up">
            <span className="material-symbols-outlined text-lg">
              check_circle
            </span>
            <span className="text-xs font-bold">
              Dữ liệu: {currentCinema.name}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-white/5 text-white/40 border border-white/5 px-4 py-2.5 rounded-xl">
            <span className="material-symbols-outlined text-lg">info</span>
            <span className="text-xs font-medium">
              Vui lòng chọn rạp để xem
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CinemaRoomFilter;
