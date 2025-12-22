import React from "react";
import {
  formatDuration,
  getPrimaryPoster,
  getYear,
} from "../../../utils/helper";
import { MdStar, MdAccessTime, MdCalendarToday } from "react-icons/md";

const BookingHero = ({ movie, loading }) => {
  const poster = getPrimaryPoster(movie?.poster_urls);
  const backdrop = movie?.backdrop_url || poster;
  const badge = movie?.status === "COMING_SOON" ? "Sắp chiếu" : "Đang chiếu";

  if (loading) {
    return (
      <section className="relative w-full h-[60vh] bg-background-dark animate-pulse">
        <div className="absolute inset-0 bg-white/5"></div>
      </section>
    );
  }

  return (
    // UPDATE: Tăng min-height và thêm pb-20 để dành chỗ cho phần overlap
    <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden bg-background-dark">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[3px] opacity-50 scale-105"
        style={{ backgroundImage: `url('${backdrop}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-transparent to-transparent opacity-90" />

      {/* Content */}
      {/* UPDATE: padding-bottom lớn (pb-24) để nội dung không bị sát đáy */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-6 pt-32 pb-24 flex flex-col md:flex-row gap-8 md:items-end h-full">
        {/* Poster */}
        <div className="w-40 md:w-60 shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 border-2 border-white/10 group">
          <img
            src={poster}
            alt={movie?.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Info */}
        <div className="flex-1 pb-2 space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 bg-primary text-white text-[11px] font-bold tracking-widest rounded uppercase shadow-lg shadow-primary/30">
              {badge}
            </span>
            {movie?.movie_format && (
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-widest rounded uppercase">
                {movie.movie_format}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
            {movie?.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm font-medium">
            <div className="flex items-center gap-2 text-yellow-400">
              <MdStar className="text-xl" />
              <span className="text-lg font-bold text-white">
                {movie?.rating || movie?.vote_average || "N/A"}
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MdAccessTime className="text-lg text-white/60" />
              <span>
                {movie?.duration_minutes
                  ? formatDuration(movie.duration_minutes)
                  : "--"}
              </span>
            </div>
            <div className="w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MdCalendarToday className="text-lg text-white/60" />
              <span>{getYear(movie?.release_date)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(movie?.genres || []).map((g) => (
              <span
                key={g.id || g.name}
                className="px-3 py-1 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white/80 text-xs transition-colors cursor-default"
              >
                {g.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingHero;
