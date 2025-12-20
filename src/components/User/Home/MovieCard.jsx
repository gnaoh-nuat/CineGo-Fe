import React from "react";
import { Link } from "react-router-dom";
import { MdConfirmationNumber } from "react-icons/md";
import { formatDuration, getYear } from "../../../utils/helper"; // Đảm bảo đường dẫn import đúng

const MovieCard = ({ movie }) => {
  const posterUrl =
    movie.poster_urls?.[0] ||
    "https://via.placeholder.com/300x450?text=No+Image";

  return (
    // 1. Thay thẻ div bao ngoài thành Link để click vào cả card đều chuyển trang
    <Link
      to={`/movie/${movie.id}`}
      className="min-w-[200px] w-[200px] snap-start flex flex-col gap-3 group cursor-pointer"
      // Thêm sự kiện scroll lên đầu trang khi chuyển hướng để trải nghiệm tốt hơn
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
          {/* 2. Thay Link cũ bằng thẻ div. 
             Vì thẻ cha đã là Link rồi, nên click vào nút này sự kiện vẫn nổi bọt (bubble) lên cha 
             và thực hiện chuyển trang như bình thường.
          */}
          <div className="w-full py-2.5 bg-primary text-white text-sm font-bold rounded-lg shadow-lg hover:bg-primary/90 flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <MdConfirmationNumber className="text-lg" />
            Đặt vé
          </div>
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
