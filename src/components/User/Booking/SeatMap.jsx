import React, { useMemo } from "react";
import {
  groupSeatsByRow,
  seatLabel,
  formatCurrency,
} from "../../../utils/helper";

// Cấu hình chú thích ghế
const LEGEND = [
  { label: "Ghế trống", class: "border-white/20 bg-transparent" },
  {
    label: "Đang chọn",
    class: "bg-primary border-primary shadow-[0_0_8px_rgba(234,42,51,0.6)]",
  },
  {
    label: "Đã bán",
    class: "bg-white/5 border-transparent opacity-50 cursor-not-allowed",
  },
  { label: "VIP", class: "border-purple-500 text-purple-400" },
  { label: "Couple", class: "border-pink-500 text-pink-400 w-12" },
];

const SeatMap = ({
  seats = [],
  selectedSeatIds = [],
  onToggle,
  loading = false,
}) => {
  const groupedRows = useMemo(() => groupSeatsByRow(seats), [seats]);

  // Render từng ghế đơn lẻ
  const renderSeat = (seat) => {
    const isBooked = seat.status === "BOOKED"; // Hoặc check field tương ứng từ API
    const isSelected = selectedSeatIds.includes(seat.id);
    const isCouple = seat.type === "COUPLE";
    const isVip = seat.type === "VIP";

    // Base styles
    let btnClass = `relative flex items-center justify-center rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all duration-200 select-none `;

    // Size styles
    btnClass += isCouple
      ? "w-16 h-8 md:w-20 md:h-9 mx-1 "
      : "w-8 h-8 md:w-9 md:h-9 mx-0.5 md:mx-1 ";

    // State styles
    if (isBooked) {
      btnClass +=
        "bg-white/5 text-transparent border border-transparent cursor-not-allowed";
    } else if (isSelected) {
      btnClass +=
        "bg-primary text-white border border-primary shadow-[0_0_10px_rgba(234,42,51,0.5)] transform scale-105 z-10";
    } else {
      // Available styles based on Type
      if (isVip) {
        btnClass +=
          "bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]";
      } else if (isCouple) {
        btnClass +=
          "bg-transparent border border-pink-500 text-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_8px_rgba(236,72,153,0.4)]";
      } else {
        btnClass +=
          "bg-transparent border border-white/20 text-white/60 hover:border-white/60 hover:text-white";
      }
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => !isBooked && onToggle?.(seat)}
        className={btnClass}
        title={`${seatLabel(seat)} - ${seat.type} (${formatCurrency(
          seat.price
        )})`}
      >
        {!isBooked && seatLabel(seat)}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-1/2 h-2 bg-white/10 rounded-full mb-8" />
        <div className="w-full h-full bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl p-4 md:p-8 relative overflow-hidden flex flex-col items-center shadow-2xl">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-primary/5 blur-[60px] rounded-full pointer-events-none" />

      {/* Screen Area */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10 mb-12">
        <div className="w-full h-1.5 bg-white/20 rounded-full mb-1 shadow-[0_0_15px_rgba(255,255,255,0.4)]" />
        <div className="w-[95%] h-12 bg-gradient-to-b from-white/5 to-transparent skew-x-[40deg] absolute top-1 blur-md pointer-events-none" />
        <p className="text-white/20 text-[10px] tracking-[0.4em] font-medium mt-3 uppercase">
          Màn hình
        </p>
      </div>

      {/* Seat Grid - Horizontal Scroll for Mobile */}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar flex justify-center">
        <div className="flex flex-col gap-2 md:gap-3 min-w-max">
          {groupedRows.map(({ row, seats: rowSeats }) => (
            <div
              key={row}
              className="flex items-center justify-center gap-4 md:gap-8"
            >
              <span className="text-white/20 text-xs font-bold w-4 text-center">
                {row}
              </span>
              <div className="flex justify-center">
                {rowSeats.map((seat) => renderSeat(seat))}
              </div>
              <span className="text-white/20 text-xs font-bold w-4 text-center">
                {row}
              </span>
            </div>
          ))}
          {groupedRows.length === 0 && (
            <div className="text-white/40 text-sm py-10">
              Không tìm thấy dữ liệu ghế.
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-3 mt-auto pt-6 border-t border-white/5">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded ${item.class}`} />
            <span className="text-white/50 text-xs md:text-sm">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
