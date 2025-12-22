import React from "react";
import { formatCurrency, getPrimaryPoster, getYear } from "@/utils/helper";

const MovieRow = ({ movie }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-surface-dark/80 p-3 hover:border-primary/40 transition-colors">
    <div className="h-14 w-10 overflow-hidden rounded-lg bg-black/40">
      <img
        src={getPrimaryPoster(movie.poster_urls)}
        alt={movie.title}
        className="h-full w-full object-cover"
      />
    </div>
    <div className="flex flex-1 flex-col">
      <p className="text-sm font-semibold text-white line-clamp-1">
        {movie.title}
      </p>
      <p className="text-xs text-white/50">{getYear(movie.release_date)}</p>
    </div>
    <div className="text-right">
      <p className="text-xs text-white/50">Doanh thu</p>
      <p className="text-sm font-bold text-primary">
        {formatCurrency(movie.total_revenue)}
      </p>
    </div>
  </div>
);

export default MovieRow;
