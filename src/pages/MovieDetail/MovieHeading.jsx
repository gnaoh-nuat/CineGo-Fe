import React from "react";
import { MdAccessTime, MdCalendarMonth, MdStar } from "react-icons/md"; // Import icons
import {
  getGenres,
  formatDuration,
  getStatusTag,
  formatDateForDisplay,
} from "../../../utils/helper";

const MovieHeading = ({ movie }) => {
  if (!movie) return null;

  const { text: statusText, classes: statusClasses } = getStatusTag(
    movie.status
  );
  const formattedDate = formatDateForDisplay(movie.release_date);
  const duration = formatDuration(movie.duration_minutes);

  return (
    <div className="flex flex-col gap-5 mb-8">
      <div>
        <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
          <span
            className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-sm uppercase ${statusClasses}`}
          >
            {statusText}
          </span>
          <span className="px-2.5 py-1 bg-white/10 border border-white/10 text-white text-[10px] font-bold tracking-wider rounded-sm uppercase">
            2D/IMAX
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-none tracking-tight mb-4 font-display">
          {movie.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-4">
          {movie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/70 text-xs font-medium hover:bg-white/10 transition-colors cursor-default"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/80 text-sm font-medium">
          <div className="flex items-center gap-2 text-yellow-500">
            {/* MdStar mặc định đã là filled */}
            <MdStar className="text-[22px]" />
            <span className="text-white text-lg font-bold">--</span>
            <span className="text-white/40 text-xs font-normal">
              (Chưa có đánh giá)
            </span>
          </div>

          <div className="w-px h-4 bg-white/20"></div>

          <div className="flex items-center gap-2">
            <MdAccessTime className="text-[20px] text-white/60" />
            <span>{duration}</span>
          </div>

          <div className="w-px h-4 bg-white/20"></div>

          <div className="flex items-center gap-2">
            <MdCalendarMonth className="text-[20px] text-white/60" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieHeading;
