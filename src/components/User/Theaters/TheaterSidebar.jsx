import React, { useState, useMemo } from "react";
import { MdSearch, MdCheck, MdLocationOn, MdStorefront } from "react-icons/md";

const TheaterSidebar = ({
  provinces = [],
  selectedProvinceId,
  onSelectProvince,
  cinemas = [],
  selectedCinemaId,
  onSelectCinema,
  loadingProvinces,
  loadingCinemas,
}) => {
  const [provinceSearch, setProvinceSearch] = useState("");

  // Filter provinces
  const filteredProvinces = useMemo(() => {
    return provinces.filter((p) =>
      p.name.toLowerCase().includes(provinceSearch.toLowerCase())
    );
  }, [provinces, provinceSearch]);

  return (
    <div className="bg-surface-dark border border-white/10 rounded-xl flex flex-col h-full overflow-hidden shadow-2xl">
      {/* --- PHẦN 1: CHỌN TỈNH/THÀNH (Cố định chiều cao tối đa) --- */}
      <div className="shrink-0 p-5 border-b border-white/5 bg-white/[0.02] flex flex-col gap-3">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full"></span>
          Chọn Khu Vực
        </h2>

        {/* Search Box */}
        <div className="relative group">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xl group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-background-dark/50 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="Tìm tỉnh thành..."
            type="text"
            value={provinceSearch}
            onChange={(e) => setProvinceSearch(e.target.value)}
          />
        </div>

        {/* Province Grid List */}
        <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[140px] custom-scrollbar pr-1">
          {loadingProvinces ? (
            <div className="col-span-2 text-center text-white/30 text-xs py-4">
              Đang tải địa điểm...
            </div>
          ) : (
            filteredProvinces.map((p) => {
              const isSelected = selectedProvinceId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProvince(p.id)}
                  className={`relative px-3 py-2 rounded-md text-left transition-all flex items-center justify-between group border ${
                    isSelected
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border-white/5 hover:border-white/20"
                  }`}
                >
                  <span className="text-xs font-medium truncate">{p.name}</span>
                  {isSelected && <MdCheck className="text-sm shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* --- PHẦN 2: DANH SÁCH RẠP (Chiếm phần còn lại - flex-1) --- */}
      <div className="flex-1 flex flex-col min-h-0 bg-background-dark/20 relative">
        {/* Header Rạp */}
        <div className="p-4 pb-2 shrink-0 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full"></span>
            Danh sách Rạp
          </h2>
          <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/5">
            {cinemas.length} địa điểm
          </span>
        </div>

        {/* List Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-4 pt-2 custom-scrollbar">
          <div className="flex flex-col gap-3">
            {loadingCinemas ? (
              [1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-20 bg-white/5 border border-white/5 rounded-lg animate-pulse"
                />
              ))
            ) : cinemas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/30 gap-2">
                <MdStorefront className="text-4xl opacity-50" />
                <p className="text-sm">Không tìm thấy rạp nào.</p>
              </div>
            ) : (
              cinemas.map((c) => {
                const isSelected = selectedCinemaId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => onSelectCinema(c.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group relative overflow-hidden ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 shadow-lg shadow-primary/10"
                        : "bg-surface-dark border-white/5 hover:bg-white/5 hover:border-white/20"
                    }`}
                  >
                    {/* Active Indicator Line */}
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
                    )}

                    <div className="pl-2">
                      <h3
                        className={`font-bold text-sm mb-1 transition-colors ${
                          isSelected
                            ? "text-white"
                            : "text-white/90 group-hover:text-primary"
                        }`}
                      >
                        {c.name}
                      </h3>
                      <div className="flex items-start gap-1.5 text-xs text-white/50 group-hover:text-white/70 transition-colors">
                        <MdLocationOn className="text-sm shrink-0 mt-0.5" />
                        <p className="line-clamp-2 leading-relaxed">
                          {c.address}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterSidebar;
