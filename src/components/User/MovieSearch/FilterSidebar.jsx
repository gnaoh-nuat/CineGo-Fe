import React, { useMemo, useState } from "react";
import { MdCheck } from "react-icons/md";

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "NOW_PLAYING", label: "Đang chiếu" },
  { value: "COMING_SOON", label: "Sắp chiếu" },
];

const FilterSidebar = ({
  genres = [],
  selectedGenreId,
  onSelectGenre,
  status,
  onStatusChange,
  onReset,
}) => {
  const [showAll, setShowAll] = useState(false);

  const visibleGenres = useMemo(() => {
    const list = Array.isArray(genres) ? genres : [];
    if (showAll) return list;
    return list.slice(0, 8);
  }, [genres, showAll]);

  return (
    <aside className="lg:col-span-3 space-y-8">
      {/* --- Filter By Genre --- */}
      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold text-lg">Thể loại</h3>
          <button
            onClick={onReset}
            className="text-xs text-primary hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="space-y-3">
          {visibleGenres.map((genre) => {
            const isChecked = selectedGenreId === genre.id;
            return (
              <label
                key={genre.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="relative">
                  <input
                    type="checkbox" // Dùng checkbox behavior cho UI, logic là radio (theo code cũ)
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => onSelectGenre(isChecked ? null : genre.id)}
                  />
                  {/* Custom Checkbox UI */}
                  <div
                    className={`w-5 h-5 border rounded transition-all flex items-center justify-center
                    ${
                      isChecked
                        ? "bg-primary border-primary"
                        : "border-white/20 bg-transparent group-hover:border-primary"
                    }`}
                  >
                    <MdCheck
                      className={`text-white text-xs ${
                        isChecked ? "block" : "hidden"
                      }`}
                    />
                  </div>
                </div>
                <span className="text-white/70 group-hover:text-white text-sm transition-colors flex-1">
                  {genre.name}
                </span>
              </label>
            );
          })}

          {Array.isArray(genres) && genres.length > 8 && (
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="text-xs font-semibold text-primary hover:text-white transition-colors mt-2"
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
      </div>

      {/* --- Filter By Status --- */}
      <div className="bg-surface-dark/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-white font-bold text-lg mb-4">Trạng thái</h3>
        <div className="space-y-3">
          {STATUS_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={status === option.value}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-4 h-4 text-primary bg-transparent border-white/20 focus:ring-primary focus:ring-offset-background-dark accent-primary"
              />
              <span className="text-white/70 group-hover:text-white text-sm transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
