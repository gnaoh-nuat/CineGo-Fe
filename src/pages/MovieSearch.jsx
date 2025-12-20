import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Import hook này
import { HiOutlineSearch } from "react-icons/hi";
import FilterSidebar from "../components/User/MovieSearch/FilterSidebar";
import SortBar from "../components/User/MovieSearch/SortBar";
import MovieGrid from "../components/User/MovieSearch/MovieGrid";
import Pagination from "../components/User/MovieSearch/Pagination";
import SummaryApi from "../common";
import { sortMovies } from "../utils/helper";

const PAGE_SIZE = 12;

const MovieSearch = () => {
  // 2. Sử dụng useSearchParams để lấy dữ liệu trên thanh địa chỉ
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialGenre = searchParams.get("genre_id") || null;

  // 3. Khởi tạo state bằng giá trị từ URL
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Các state khác giữ nguyên, nhưng selectedGenre có thể lấy từ URL luôn nếu muốn
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("POPULAR");
  const [page, setPage] = useState(1);

  const [movies, setMovies] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);

  // --- QUAN TRỌNG: Lắng nghe sự thay đổi của URL ---
  // Nếu bạn đang ở trang Search mà lại gõ tìm kiếm mới trên Header,
  // URL sẽ đổi -> Cần cập nhật lại state searchTerm
  useEffect(() => {
    const querySearch = searchParams.get("search") || "";
    const queryGenre = searchParams.get("genre_id");

    // Chỉ cập nhật nếu giá trị khác biệt để tránh loop
    if (querySearch !== searchTerm) {
      setSearchTerm(querySearch);
      setDebouncedSearch(querySearch);
    }
    if (queryGenre && queryGenre !== selectedGenre) {
      setSelectedGenre(queryGenre);
    }
  }, [searchParams]); // Chạy khi URL thay đổi

  // Debounce input khi người dùng gõ trực tiếp tại trang Search
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400); // Tăng delay xíu cho mượt
    return () => clearTimeout(id);
  }, [searchTerm]);

  // Fetch Genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(SummaryApi.getGenres.url, {
          method: SummaryApi.getGenres.method,
        });
        const result = await response.json();
        if (result.success && Array.isArray(result.data?.genres)) {
          setGenres(result.data.genres);
        }
      } catch (error) {
        console.error("Lỗi tải thể loại:", error);
      }
    };
    fetchGenres();
  }, []);

  // Fetch Movies
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, size: PAGE_SIZE });

        if (debouncedSearch) params.append("search", debouncedSearch);
        if (status) params.append("status", status);
        if (selectedGenre) params.append("genre_id", selectedGenre);

        const endpoint = selectedGenre
          ? SummaryApi.getMoviesByGenre
          : SummaryApi.getMovies;

        const url = `${endpoint.url}?${params.toString()}`;

        const response = await fetch(url, { method: endpoint.method });
        const result = await response.json();

        if (result.success) {
          const items = Array.isArray(result.data?.items)
            ? result.data.items
            : [];
          setTotalItems(result.data?.totalItems ?? items.length);
          setTotalPages(result.data?.totalPages ?? 1);
          setMovies(sortMovies(items, sortBy));
        } else {
          setMovies([]);
          setTotalItems(0);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Lỗi tải phim:", error);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [debouncedSearch, page, selectedGenre, sortBy, status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    // Khi submit form tại trang này, ta cập nhật URL cho đồng bộ
    setSearchParams({ search: searchTerm.trim() });
  };

  const handleReset = () => {
    setSelectedGenre(null);
    setStatus("");
    setSearchTerm("");
    setDebouncedSearch("");
    setSortBy("POPULAR");
    setPage(1);
    // Xóa query params trên URL
    setSearchParams({});
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setMovies((prev) => sortMovies(prev, value));
  };

  const handlePageChange = (value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-grow bg-background-dark text-white min-h-screen">
      <section className="max-w-[1440px] mx-auto px-6 pt-24 pb-12 text-center">
        <div className="flex flex-col items-center justify-center text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Tìm kiếm phim
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            Khám phá bộ sưu tập phim đa dạng, tìm rạp chiếu gần bạn và đặt vé
            ngay hôm nay.
          </p>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-3xl mx-auto shadow-2xl shadow-primary/10"
        >
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <HiOutlineSearch className="text-white/60 text-2xl" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              // Lưu ý: Khi gõ, ta chưa đổi page=1 ngay để tránh flicker,
              // useEffect debounce sẽ lo việc fetch data mới
            }}
            className="block w-full pl-14 pr-32 py-5 bg-surface-dark border border-white/10 rounded-2xl text-white placeholder-white/30 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-lg"
            placeholder="Nhập tên phim..."
            type="text"
            // autoFocus // Tùy chọn: Có thể bỏ autoFocus nếu thấy phiền trên mobile
          />
          <button
            type="submit"
            className="absolute right-3 top-2.5 bottom-2.5 px-6 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </section>

      <section className="max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 pb-16">
        <FilterSidebar
          genres={genres}
          selectedGenreId={selectedGenre}
          onSelectGenre={(id) => {
            setSelectedGenre(id);
            setPage(1);
            // Cập nhật URL khi chọn genre (tuỳ chọn)
            // setSearchParams(prev => { prev.set('genre_id', id); return prev; });
          }}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          onReset={handleReset}
        />

        <div className="lg:col-span-9">
          <SortBar
            totalItems={totalItems}
            sortBy={sortBy}
            onChangeSort={handleSortChange}
          />

          <MovieGrid movies={movies} loading={loading} />

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </section>
    </div>
  );
};

export default MovieSearch;
