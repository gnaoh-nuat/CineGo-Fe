import React, { useEffect, useState } from "react";
import SummaryApi from "../../../common";
import { getYouTubeThumbnail, getYear } from "../../../utils/helper";
// 1. Import icon từ react-icons
import { MdPlayArrow } from "react-icons/md";

const TrailerList = () => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await fetch(
          `${SummaryApi.getMovies.url}?page=1&size=4`,
          {
            method: SummaryApi.getMovies.method,
          }
        );
        const result = await response.json();
        if (result.success) setTrailers(result.data.items);
      } catch (error) {
        console.error("Lỗi tải trailer:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrailers();
  }, []);

  if (loading) {
    return (
      <div className="py-10 text-center text-white/50 bg-background-dark">
        Đang tải trailer...
      </div>
    );
  }

  return (
    <section className="py-10 bg-surface-dark/30 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="flex items-center gap-2 mb-6 text-white/50 uppercase tracking-widest text-xs font-bold">
          <span className="w-8 h-[2px] bg-primary"></span>
          Trailer mới nhất
        </div>

        <div className="flex overflow-x-auto no-scrollbar gap-5 pb-4 snap-x">
          {trailers.map((movie) => {
            const thumbnailUrl =
              getYouTubeThumbnail(movie.trailer_url) || movie.poster_urls?.[0];

            return (
              <div
                key={movie.id}
                className="min-w-[280px] md:min-w-[320px] snap-start group cursor-pointer"
                onClick={() => window.open(movie.trailer_url, "_blank")}
              >
                <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-white/10 bg-surface-dark">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${thumbnailUrl}')` }}
                  ></div>

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                    <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform shadow-lg group-hover:bg-primary/80 group-hover:border-primary">
                      {/* 2. Sử dụng Icon như một component bình thường */}
                      <MdPlayArrow className="text-white text-3xl" />
                    </div>
                  </div>
                </div>

                <h3 className="text-white font-medium text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {movie.title}
                </h3>
                <p className="text-white/50 text-sm">
                  {getYear(movie.release_date)} • Official Trailer
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrailerList;
