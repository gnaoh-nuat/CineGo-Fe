import React from "react";
import { MdPlayArrow } from "react-icons/md"; // Import icon

const PosterCard = ({ movie }) => {
  const posterUrl =
    movie?.poster_urls?.[0] ||
    "https://via.placeholder.com/300x450?text=No+Image";

  const handlePlayTrailer = () => {
    if (movie?.trailer_url) {
      window.open(movie.trailer_url, "_blank");
    }
  };

  return (
    <div className="w-full max-w-[320px] mx-auto lg:mx-0 shrink-0">
      <div className="aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/60 border border-white/10 relative group">
        <img
          src={posterUrl}
          alt={movie?.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
          <button
            onClick={handlePlayTrailer}
            className="size-20 rounded-full bg-primary/90 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/30"
          >
            {/* Sử dụng React Icon, size chỉnh bằng class text hoặc prop size */}
            <MdPlayArrow className="text-5xl ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
