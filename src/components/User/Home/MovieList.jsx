import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdArrowForward } from "react-icons/md";
import SummaryApi from "../../../common";
import MovieCard from "./MovieCard";

/**
 * @param {string} title - Tiêu đề của section (VD: Phim đang chiếu)
 * @param {object} params - Tham số query cho API (VD: { status: 'NOW_SHOWING', page: 1, size: 8 })
 */
const MovieList = ({ title, params = {} }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        // Tạo query string từ object params
        const queryParams = new URLSearchParams({
          page: 1,
          size: 10, // Mặc định lấy 10 phim nếu không truyền
          ...params,
        }).toString();

        const response = await fetch(
          `${SummaryApi.getMovies.url}?${queryParams}`,
          {
            method: SummaryApi.getMovies.method,
          }
        );

        const result = await response.json();

        if (result.success) {
          setMovies(result.data.items);
        }
      } catch (error) {
        console.error(`Lỗi tải danh sách phim (${title}):`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [params, title]); // Re-fetch khi params thay đổi

  // Nếu không có phim nào thì ẩn luôn section này
  if (!loading && movies.length === 0) {
    return null;
  }

  return (
    <section className="pt-12 pb-8 max-w-[1440px] mx-auto px-6 w-full">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white border-l-4 border-primary pl-4 uppercase tracking-wide">
          {title}
        </h2>

        {/* Link xem tất cả - Tạm thời trỏ về trang danh sách chung */}
        <Link
          to="/movies"
          className="text-primary text-sm font-semibold hover:text-white transition-colors flex items-center gap-1 group"
        >
          Xem tất cả
          <MdArrowForward className="text-lg group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Movie List Container */}
      <div className="relative">
        {loading ? (
          // Loading Skeleton đơn giản
          <div className="flex gap-6 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="min-w-[200px] h-[300px] bg-white/5 rounded-xl animate-pulse"
              ></div>
            ))}
          </div>
        ) : (
          // Scrollable List
          <div className="flex overflow-x-auto no-scrollbar gap-6 pb-4 snap-x">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieList;
