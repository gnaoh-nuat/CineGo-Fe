import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdConfirmationNumber, MdStar, MdAccessTime } from "react-icons/md";
import {
  formatDuration,
  getFirstGenre,
  getPrimaryPoster,
  getYear,
  formatRating,
} from "../../../utils/helper";

const MovieGrid = ({ movies = [], loading }) => {
  const navigate = useNavigate();

  // Skeleton Loading
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div key={idx} className="flex flex-col gap-3 animate-pulse">
            <div className="aspect-[2/3] bg-surface-dark rounded-xl border border-white/5"></div>
            <div className="h-5 bg-surface-dark rounded w-3/4"></div>
            <div className="h-4 bg-surface-dark rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (!loading && movies.length === 0) {
    return (
      <div className="col-span-full text-center py-20 border border-dashed border-white/10 rounded-xl bg-surface-dark/30">
        <p className="text-white/60 text-lg">Không tìm thấy phim nào.</p>
        <p className="text-white/40 text-sm mt-2">
          Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 gap-y-10">
      {movies.map((movie) => {
        const poster = getPrimaryPoster(movie.poster_urls);
        // Mock rating nếu API chưa có field này, hoặc lấy từ movie.vote_average
        const rating = movie.vote_average || Math.random() * 4 + 6;

        return (
          <Link
            key={movie.id}
            to={`/movie/${movie.id}`}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group flex flex-col gap-3 cursor-pointer"
          >
            {/* Poster Card */}
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-dark border border-white/5 shadow-lg">
              <img
                src={poster}
                alt={movie.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />

              {/* Rating Badge (Góc phải trên) */}
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-yellow-500 flex items-center gap-1 border border-white/10 z-10 shadow-sm">
                <MdStar className="text-[14px]" />
                {formatRating(rating)}
              </div>

              {/* Status Badge (Nếu Sắp chiếu) */}
              {movie.status === "COMING_SOON" && (
                <div className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md z-10">
                  {getYear(movie.release_date)}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/booking/${movie.id}`);
                  }}
                  className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                >
                  <MdConfirmationNumber className="text-lg" />
                  Đặt vé
                </button>
              </div>
            </div>

            {/* Info */}
            <div>
              <h3
                className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors"
                title={movie.title}
              >
                {movie.title}
              </h3>
              <div className="flex items-center justify-between mt-1">
                {/* Genre Tag */}
                <span className="text-white/50 text-xs font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                  {getFirstGenre(movie.genres)}
                </span>

                {/* Duration */}
                <span className="text-white/40 text-xs flex items-center gap-1">
                  <MdAccessTime className="text-[14px]" />
                  {formatDuration(movie.duration_minutes)}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MovieGrid;
