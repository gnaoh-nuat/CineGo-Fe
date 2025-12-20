import React from "react";
import { Link } from "react-router-dom";
import { MdConfirmationNumber, MdShare } from "react-icons/md"; // Import icons

const MovieOverview = ({ movie }) => {
  if (!movie) return null;

  return (
    <>
      <div>
        <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
          <span className="w-1 h-6 bg-primary rounded-full"></span>
          Nội dung phim
        </h3>
        <p className="text-white/70 text-base leading-relaxed text-justify lg:text-left">
          {movie.description || "Đang cập nhật nội dung..."}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
        <Link
          to={`/booking/${movie.id}`}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/25 text-base w-full sm:w-auto min-w-[200px]"
        >
          <MdConfirmationNumber className="text-xl" />
          <span>Đặt Vé Ngay</span>
        </Link>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Đã sao chép liên kết!");
          }}
          className="flex-1 sm:flex-none flex items-center justify-center gap-3 h-14 px-8 bg-surface-dark hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all w-full sm:w-auto"
        >
          <MdShare className="text-xl" />
          <span>Chia Sẻ</span>
        </button>
      </div>
    </>
  );
};

export default MovieOverview;
