import React, { useRef, useEffect, useState } from "react";
import { MdLocationOn, MdKeyboardArrowDown, MdCheck } from "react-icons/md";

const DateSelector = ({
  provinces = [],
  selectedProvince,
  onProvinceChange,
  dates = [],
  selectedDate,
  onDateChange,
  loading = false,
}) => {
  const scrollRef = useRef(null);

  // State cho custom dropdown
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Auto scroll to start
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, []);

  // Close dropdown click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-surface-dark border border-white/10 rounded-3xl shadow-2xl overflow-visible relative">
      {/* Header & Custom Dropdown */}
      <div className="p-6 md:p-8 border-b border-white/10 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(234,42,51,0.5)]" />
          Lịch Chiếu
        </h2>

        {/* CUSTOM DROPDOWN */}
        <div className="relative min-w-[240px] z-50" ref={dropdownRef}>
          {/* Nút Trigger */}
          <button
            onClick={() => !loading && setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between bg-background-dark border ${
              isOpen ? "border-primary" : "border-white/20"
            } text-white rounded-xl pl-10 pr-4 py-3 transition-all hover:border-white/40`}
            disabled={loading}
          >
            <MdLocationOn className="absolute left-3 text-primary text-xl" />
            <span className="font-semibold text-sm truncate mr-2">
              {loading
                ? "Đang tải..."
                : selectedProvince?.name || "Chọn tỉnh/thành"}
            </span>
            <MdKeyboardArrowDown
              className={`text-xl transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Danh sách xổ xuống */}
          {isOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl max-h-[300px] overflow-y-auto custom-scrollbar animate-fade-in-up z-50 ring-1 ring-white/5">
              <div className="p-2 space-y-1">
                {provinces.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-white/50 text-center">
                    Không có dữ liệu
                  </div>
                ) : (
                  provinces.map((p) => {
                    const isSelected = selectedProvince?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          onProvinceChange?.(p);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-lg transition-colors ${
                          isSelected
                            ? "bg-primary text-white font-bold"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {p.name}
                        {isSelected && <MdCheck className="text-lg" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Date Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar p-6 scroll-smooth"
      >
        {dates.map((d) => {
          const isActive = selectedDate?.value === d.value;
          return (
            <button
              key={d.value}
              onClick={() => onDateChange?.(d)}
              className={`group relative flex flex-col items-center justify-center min-w-[80px] h-[90px] rounded-2xl border transition-all duration-300 shrink-0 ${
                isActive
                  ? "bg-primary border-primary shadow-lg shadow-primary/30 translate-y-[-2px]"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              <span
                className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${
                  isActive
                    ? "text-white/90"
                    : "text-white/40 group-hover:text-white/60"
                }`}
              >
                {d.isToday ? "Hôm nay" : d.weekday}
              </span>
              <span
                className={`text-2xl font-bold ${
                  isActive ? "text-white" : "text-white/90"
                }`}
              >
                {d.day}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-white/80" : "text-white/40"
                }`}
              >
                Tháng {d.month}
              </span>

              {isActive && (
                <div className="absolute -bottom-2 w-1.5 h-1.5 bg-primary rounded-full shadow-sm" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
