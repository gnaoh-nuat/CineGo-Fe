import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowForward, MdConfirmationNumber } from "react-icons/md";
import SummaryApi from "../../../common";
import {
  formatDuration,
  getPrimaryPoster,
  getFirstGenre,
} from "../../../utils/helper";

const RelatedMovies = ({ currentMovieId, genres }) => {
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      // Nếu phim hiện tại không có thể loại nào thì không gọi API
      if (!genres || genres.length === 0) return;

      // Lấy ID của thể loại đầu tiên để tìm phim tương tự
      const genreId = genres[0].id;

      try {
        setLoading(true);
        // Gọi API: page 1, lấy 10 item để trừ hao phim trùng
        const url = `${SummaryApi.getMoviesByGenre.url}?page=1&size=10&genre_id=${genreId}`;

        const response = await fetch(url, {
          method: SummaryApi.getMoviesByGenre.method,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (result.success) {
          // 1. Lọc bỏ phim đang hiển thị (currentMovieId)
          // 2. Chỉ lấy tối đa 6 phim
          const filteredMovies = result.data.items
            .filter((movie) => String(movie.id) !== String(currentMovieId))
            .slice(0, 6);

          setRelatedMovies(filteredMovies);
        }
      } catch (error) {
        console.error("Lỗi khi tải phim tương tự:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedMovies();
  }, [currentMovieId, genres]);

  // Nếu không có phim tương tự hoặc đang loading thì ẩn section hoặc hiển thị skeleton (ở đây chọn ẩn)
  if (!loading && relatedMovies.length === 0) return null;

  return (
    <section className="py-12 bg-surface-dark/30 border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 w-full">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-primary pl-4">
            Phim tương tự
          </h2>
          <Link
            to="/movies"
            className="text-primary text-sm font-semibold hover:text-white transition-colors flex items-center gap-1"
          >
            Xem tất cả <MdArrowForward className="text-lg" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[2/3] bg-white/5 rounded-xl mb-3"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Movie Grid - Hiển thị 6 cột trên màn hình lớn */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {relatedMovies.map((movie) => (
              <Link
                to={`/movie/${movie.id}`}
                key={movie.id}
                className="flex flex-col gap-3 group cursor-pointer"
                onClick={() => window.scrollTo(0, 0)} // Scroll lên đầu trang khi click phim mới
              >
                {/* Poster Card */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-dark border border-white/5 shadow-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `url('${getPrimaryPoster(
                        movie.poster_urls
                      )}')`,
                    }}
                  ></div>

                  {/* Overlay & Button khi hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <button className="w-full py-2 bg-primary text-white text-sm font-bold rounded shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                      <MdConfirmationNumber /> Đặt vé
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-white font-bold text-base lg:text-lg truncate group-hover:text-primary transition-colors">
                    {movie.title}
                  </h3>
                  <p className="text-white/50 text-xs lg:text-sm flex items-center gap-2">
                    {/* Sử dụng Helper để format dữ liệu */}
                    <span>{getFirstGenre(movie.genres)}</span>
                    <span>•</span>
                    <span>{formatDuration(movie.duration_minutes)}</span>
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RelatedMovies;
