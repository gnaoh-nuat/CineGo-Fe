import React, { useMemo } from "react";

// Hàm helper để nhóm ghế theo hàng
const groupSeatsByRow = (seats) => {
  if (!Array.isArray(seats)) return [];
  const grouped = {};
  seats.forEach((seat) => {
    if (!grouped[seat.row]) grouped[seat.row] = [];
    grouped[seat.row].push(seat);
  });
  // Sắp xếp hàng A->Z và số ghế 1->9
  return Object.keys(grouped)
    .sort()
    .map((row) => ({
      row,
      seats: grouped[row].sort((a, b) => a.number - b.number),
    }));
};

const RoomSeatMap = ({
  seats = [],
  roomInfo = null,
  loading,
  onGenerateSeats,
  onDeleteAllSeats,
  onUpdateSeatType,
}) => {
  const grouped = useMemo(() => groupSeatsByRow(seats), [seats]);

  if (!roomInfo) {
    return (
      <div className="h-full bg-surface-dark border border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/30 gap-4 p-8 border-dashed">
        <div className="p-6 rounded-full bg-white/5 animate-pulse">
          <span className="material-symbols-outlined text-5xl">grid_view</span>
        </div>
        <p className="text-sm font-medium">Chọn một phòng để xem sơ đồ ghế</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-success text-2xl">
            grid_view
          </span>
          <div>
            <h3 className="font-bold text-sm text-white uppercase tracking-wide">
              Sơ đồ: {roomInfo.name}
            </h3>
            <p className="text-xs text-white/40 font-mono mt-0.5">
              {roomInfo.type || "2D"} ·{" "}
              {loading ? "Đang tải..." : `${seats.length} Ghế`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onGenerateSeats}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">
              add_circle
            </span>
            {seats.length > 0 ? "Sinh thêm" : "Sinh ghế"}
          </button>
          {seats.length > 0 && (
            <button
              onClick={onDeleteAllSeats}
              className="size-9 rounded-lg hover:bg-white/10 text-white/60 hover:text-danger flex items-center justify-center transition-colors tooltip"
              title="Xóa tất cả ghế"
            >
              <span className="material-symbols-outlined text-lg">
                delete_sweep
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 bg-black/40 relative overflow-auto custom-scrollbar flex flex-col items-center p-8 select-none">
        {/* Màn hình chiếu */}
        <div className="w-full max-w-3xl mb-12 text-center shrink-0">
          <p className="text-white/20 font-bold uppercase tracking-[0.3em] text-xs mb-4">
            Màn hình chiếu
          </p>
          {/* Hiệu ứng cong CSS */}
          <div className="h-1.5 w-3/4 mx-auto rounded-[50%] bg-gradient-to-r from-transparent via-white/20 to-transparent shadow-[0_15px_30px_rgba(255,255,255,0.1)] mb-8"></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : grouped.length === 0 ? (
          <div className="text-white/30 text-sm italic py-10">
            Chưa có ghế nào. Hãy tạo ghế mới.
          </div>
        ) : (
          <div className="grid gap-y-3">
            {grouped.map((row) => (
              <div
                key={row.row}
                className="flex items-center gap-4 justify-center"
              >
                <span className="text-white/30 text-xs font-bold w-6 text-right font-mono">
                  {row.row}
                </span>
                <div className="flex gap-2">
                  {row.seats.map((s) => {
                    // Logic style ghế
                    let seatClass =
                      "w-9 h-9 text-[10px] rounded-lg border flex items-center justify-center font-bold transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ";

                    if (s.type === "VIP") {
                      seatClass +=
                        "border-primary text-primary bg-primary/5 hover:bg-primary/10 hover:border-primary shadow-[0_0_10px_rgba(237,19,54,0.1)]";
                    } else if (s.type === "COUPLE") {
                      seatClass =
                        "w-20 h-9 text-[10px] rounded-lg border border-purple-500 text-purple-500 bg-purple-500/5 flex items-center justify-center font-bold gap-1 transition-all cursor-pointer hover:bg-purple-500/10";
                    } else {
                      // Standard
                      seatClass +=
                        "border-white/10 bg-[#232323] text-white/40 hover:border-white/40 hover:text-white hover:bg-[#2a2a2a]";
                    }

                    return (
                      <div
                        key={s.id}
                        className={seatClass}
                        title={`${s.row}${s.number} (${s.type})`}
                        role="button"
                        onClick={() => onUpdateSeatType?.(s)}
                      >
                        {s.type === "COUPLE" && (
                          <span className="material-symbols-outlined text-[10px] mr-0.5">
                            favorite
                          </span>
                        )}
                        {s.type === "VIP" && (
                          <span className="material-symbols-outlined text-[12px] mr-0.5">
                            workspace_premium
                          </span>
                        )}
                        <span className="leading-none">{s.number}</span>
                      </div>
                    );
                  })}
                </div>
                <span className="text-white/30 text-xs font-bold w-6 text-left font-mono">
                  {row.row}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 bg-surface-dark border-t border-white/10 flex flex-wrap items-center justify-center gap-6 md:gap-10 shrink-0 z-10">
        <div className="flex items-center gap-2">
          <div className="size-4 rounded border border-white/10 bg-[#232323]"></div>
          <span className="text-xs text-white/50 font-medium">
            Thường (Standard)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-4 rounded border border-primary text-primary flex items-center justify-center bg-primary/5"></div>
          <span className="text-xs text-primary font-medium">VIP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 rounded border border-purple-500 bg-purple-500/5"></div>
          <span className="text-xs text-purple-500 font-medium">
            Đôi (Couple)
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoomSeatMap;
