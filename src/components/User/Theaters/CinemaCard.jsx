import React from "react";
import { MdLocationOn, MdOpenInNew } from "react-icons/md";
import { getPrimaryPoster } from "../../../utils/helper";

const CinemaCard = ({ cinema, onViewDetail }) => {
  const cover = getPrimaryPoster(cinema?.image_urls);

  return (
    <div className="relative rounded-xl overflow-hidden border border-white/10 bg-surface-dark/80 backdrop-blur-sm shadow-lg group">
      <div className="absolute inset-0">
        <img
          src={cover}
          alt={cinema?.name}
          className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-background-dark/40 to-transparent" />
      </div>

      <div className="relative p-5 flex flex-col gap-3 min-h-[200px]">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center px-2 py-1 text-[10px] font-bold uppercase tracking-wide rounded-full bg-primary/20 text-primary border border-primary/30">
            {cinema?.Province?.name || "Rạp CineGo"}
          </span>
          <button
            onClick={() => onViewDetail?.(cinema)}
            className="p-2 rounded-full bg-white/10 border border-white/10 text-white/80 hover:text-white hover:bg-white/15 transition"
            aria-label="Xem chi tiết rạp"
          >
            <MdOpenInNew />
          </button>
        </div>

        <h3 className="text-lg font-bold leading-tight line-clamp-2 text-white drop-shadow">
          {cinema?.name}
        </h3>
        <p className="flex items-start gap-2 text-sm text-white/70 line-clamp-2">
          <MdLocationOn className="text-primary text-xl" />
          <span>{cinema?.address || "Đang cập nhật địa chỉ"}</span>
        </p>

        <div className="mt-auto">
          <button
            onClick={() => onViewDetail?.(cinema)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-transform transform hover:translate-y-[-1px] shadow-lg shadow-primary/25"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default CinemaCard;
