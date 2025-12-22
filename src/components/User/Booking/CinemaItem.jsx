import React, { useMemo } from "react";
import { formatTimeHM, calcEndTime } from "../../../utils/helper";
import { MdTheaters, MdInfoOutline } from "react-icons/md";

const CinemaItem = ({
  cinema = {},
  showtimes = [],
  movieDuration,
  onSelect,
}) => {
  const groupedByFormat = useMemo(() => {
    const bucket = showtimes.reduce((acc, cur) => {
      const key = cur.format || "2D Standard";
      if (!acc[key]) acc[key] = [];
      acc[key].push(cur);
      return acc;
    }, {});

    // Sort formats if needed
    return Object.entries(bucket).map(([format, list]) => ({
      format,
      list: list.sort((a, b) => new Date(a.startTime) - new Date(b.startTime)),
    }));
  }, [showtimes]);

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl overflow-hidden hover:border-primary/30 transition-all duration-300 group shadow-lg hover:shadow-xl hover:shadow-black/50">
      {/* Header: Cinema Info */}
      <div className="p-5 md:p-6 border-b border-white/5 flex items-start justify-between bg-white/[0.02]">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-primary border border-white/10 shadow-inner shrink-0">
            <MdTheaters className="text-2xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors cursor-pointer leading-tight">
              {cinema?.name || "Rạp chưa cập nhật tên"}
            </h3>
            {cinema?.address && (
              <p
                className="text-white/40 text-xs md:text-sm mt-1.5 line-clamp-1 group-hover:line-clamp-none transition-all"
                title={cinema.address}
              >
                {cinema.address}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Body: Time Slots */}
      <div className="p-6 space-y-8 bg-background-dark/20">
        {groupedByFormat.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-white/30 gap-2">
            <MdInfoOutline className="text-2xl" />
            <p className="text-sm">Chưa có suất chiếu cho ngày này.</p>
          </div>
        )}

        {groupedByFormat.map(({ format, list }) => (
          <div key={format} className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs font-bold text-white/90 uppercase tracking-wider">
                {format}
              </span>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
              {list.map((item) => {
                const start = formatTimeHM(item.startTime);
                const end = movieDuration
                  ? calcEndTime(item.startTime, movieDuration)
                  : "";

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelect?.(item, cinema)}
                    className="group/btn relative flex flex-col items-center justify-center py-2 px-1 bg-background-dark border border-white/10 rounded-xl hover:border-primary hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-200"
                  >
                    <span className="text-base font-bold text-white group-hover/btn:text-white">
                      {start || "--:--"}
                    </span>
                    <span className="text-[10px] text-white/40 font-medium mt-0.5 group-hover/btn:text-white/80">
                      {end ? `~${end}` : "Chi tiết"}
                    </span>

                    {/* Hover Tooltip for Room Name (Optional) */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.room?.name || "Phòng chiếu"}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CinemaItem;
