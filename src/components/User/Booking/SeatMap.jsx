import React, { useMemo } from "react";
import {
  groupSeatsByRow,
  seatLabel,
  formatCurrency,
} from "../../../utils/helper";

const LEGEND = [
  { label: "Ghế trống", class: "bg-transparent border-white/30 text-white/60" },
  {
    label: "Đang chọn",
    class:
      "bg-primary border-primary shadow-[0_0_10px_rgba(234,42,51,0.6)] text-white",
  },
  {
    label: "Đã bán",
    class: "bg-red-900/80 border-transparent text-white/20",
  },
  { label: "VIP", class: "bg-transparent border-purple-500 text-purple-400" },
  { label: "Couple", class: "bg-transparent border-pink-500 text-pink-400" },
];

const SeatMap = ({
  seats = [],
  selectedSeatIds = [],
  onToggle,
  loading = false,
}) => {
  const groupedRows = useMemo(() => groupSeatsByRow(seats), [seats]);

  const renderSeat = (seat) => {
    const seatStatus = (seat.status || "").toUpperCase();
    const seatType = (seat.type || "").toUpperCase();

    const isBooked =
      seatStatus !== "AVAILABLE" && seatStatus !== "EMPTY" && seatStatus !== "";
    const isSelected = selectedSeatIds.includes(seat.id);
    const isCouple = seatType === "COUPLE";
    const isVip = seatType === "VIP";

    // Base styles
    let btnClass = `relative flex items-center justify-center rounded-t-lg transition-all duration-200 text-[10px] md:text-xs font-bold select-none `;

    // Size styling
    btnClass += isCouple
      ? "w-16 h-8 md:w-20 md:h-9 mx-1 "
      : "w-8 h-8 md:w-9 md:h-9 mx-0.5 md:mx-1 ";

    // State styling
    if (isBooked) {
      btnClass +=
        "bg-red-900/80 border border-transparent text-white/20 cursor-not-allowed";
    } else if (isSelected) {
      btnClass +=
        "bg-primary text-white border border-primary shadow-[0_0_10px_rgba(234,42,51,0.5)] transform scale-105 z-10";
    } else {
      if (isVip) {
        btnClass +=
          "bg-transparent border border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]";
      } else if (isCouple) {
        btnClass +=
          "bg-transparent border border-pink-500 text-pink-400 hover:bg-pink-500/10 hover:shadow-[0_0_8px_rgba(236,72,153,0.4)]";
      } else {
        btnClass +=
          "bg-transparent border border-white/30 text-white/50 hover:bg-white/10 hover:border-white hover:text-white";
      }
    }

    return (
      <button
        key={seat.id}
        type="button"
        disabled={isBooked}
        onClick={() => !isBooked && onToggle?.(seat)}
        className={btnClass}
        title={`${seatLabel(seat)} - ${formatCurrency(seat.price)}`}
      >
        {seatLabel(seat)}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="bg-surface-dark border border-white/5 rounded-2xl p-8 h-[500px] flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="w-1/2 h-2 bg-white/10 rounded-full mb-8" />
        <div className="w-full h-full bg-white/5 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 md:p-8 relative overflow-hidden flex flex-col items-center shadow-lg min-h-[600px]">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />

      {/* Legend */}
      <div className="w-full flex flex-wrap justify-center gap-6 mb-12">
        {LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div
              className={`h-6 w-10 rounded-t-lg border text-[10px] ${item.class}`}
            />
            <span className="text-sm text-white/70">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Screen Visualization */}
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative z-10 mb-16">
        <div className="w-2/3 h-1 bg-white/20 rounded-full mb-2 shadow-[0_0_20px_rgba(255,255,255,0.4)]" />
        <div className="w-2/3 h-12 bg-gradient-to-b from-white/10 to-transparent skew-x-[20deg] absolute top-1 blur-xl pointer-events-none" />
        <p className="text-white/30 text-xs tracking-[0.3em] font-medium mt-2 uppercase">
          Màn hình
        </p>
      </div>

      {/* Seat Grid */}
      <div className="w-full overflow-x-auto pb-8 custom-scrollbar flex justify-center">
        <div className="flex flex-col gap-3 min-w-max">
          {groupedRows.map(({ row, seats: rowSeats }) => (
            <div
              key={row}
              className="flex items-center justify-center gap-4 md:gap-8"
            >
              <span className="text-white/30 text-xs font-bold w-4 text-center">
                {row}
              </span>
              <div className="flex gap-1.5 md:gap-3 justify-center">
                {rowSeats.map((seat) => renderSeat(seat))}
              </div>
              <span className="text-white/30 text-xs font-bold w-4 text-center">
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
    </div>
  );
};

export default SeatMap;
