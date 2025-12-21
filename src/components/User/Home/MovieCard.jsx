import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdConfirmationNumber } from "react-icons/md";
import { formatDuration, getYear } from "../../../utils/helper"; // Đảm bảo đường dẫn import đúng

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const posterUrl =
    movie.poster_urls?.[0] || "https://placehold.co/300x450?text=No+Image";

  return (
    // Card dẫn đến chi tiết phim; nút "Đặt vé" riêng dẫn tới booking
    <Link
      to={`/movie/${movie.id}`}
      className="min-w-[200px] w-[200px] snap-start flex flex-col gap-3 group cursor-pointer"
      onClick={() => window.scrollTo(0, 0)}
    >
      {/* --- Poster Image Container --- */}
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-dark border border-white/10 shadow-lg">
        {/* Image */}
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Tag ngày khởi chiếu (nếu là phim sắp chiếu) */}
        {movie.status === "COMING_SOON" && (
          <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded z-10 shadow-md">
            {getYear(movie.release_date)}
          </div>
        )}

        {/* Overlay Hover Effect */}
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

      {/* --- Movie Info --- */}
      <div>
        <h3
          className="text-white font-bold text-lg truncate group-hover:text-primary transition-colors"
          title={movie.title}
        >
          {movie.title}
        </h3>
        <p className="text-white/50 text-xs flex items-center gap-2 mt-1 truncate">
          {/* Hiển thị thể loại đầu tiên và thời lượng */}
          <span>{movie.genres?.[0]?.name || "N/A"}</span>
          <span>•</span>
          <span>{formatDuration(movie.duration_minutes)}</span>
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
