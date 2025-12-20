import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SummaryApi from "../../common";
import { getPrimaryPoster } from "../../utils/helper";

import {
  MdMovie,
  MdSearch,
  MdPerson,
  MdOutlinePerson,
  MdLogout,
  MdConfirmationNumber,
  MdKeyboardArrowDown,
  MdArrowForward,
} from "react-icons/md";

const Header = () => {
  const { user, logout, fetchUserDetails } = useAuth();
  const navigate = useNavigate();

  // Search States
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);
  const debounceRef = useRef(null);

  // State xử lý lỗi ảnh
  const [imgError, setImgError] = useState(false);

  // 1. Gọi API lấy thông tin mới nhất khi Header load
  useEffect(() => {
    if (fetchUserDetails) {
      fetchUserDetails();
    }
  }, []);

  // 2. Xử lý Avatar URL (SỬA Ở ĐÂY)
  // Ưu tiên 'image_url' vì đó là trường chính xác từ API của bạn
  const avatarUrl = user?.image_url || user?.avatar || user?.profile_pic;

  // Reset lỗi ảnh khi url thay đổi
  useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const submitSearch = () => {
    if (keyword.trim()) {
      navigate(`/movies?search=${encodeURIComponent(keyword.trim())}`);
      setShowSuggest(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submitSearch();
    }
  };

  const handleKeywordChange = (val) => {
    setKeyword(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = val.trim();
    if (!term) {
      setSuggestions([]);
      setShowSuggest(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSuggestLoading(true);
        const params = new URLSearchParams({ page: 1, size: 5, search: term });
        const res = await fetch(
          `${SummaryApi.getMovies.url}?${params.toString()}`,
          { method: SummaryApi.getMovies.method }
        );
        const data = await res.json();
        setSuggestions(data?.data?.items || []);
        setShowSuggest(true);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setSuggestLoading(false);
      }
    }, 300);
  };

  const handleSelectSuggestion = (movie) => {
    if (!movie?.id) return;
    setShowSuggest(false);
    navigate(`/movie/${movie.id}`);
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const GENRES = [
    { name: "Hành động", path: "/movies/action" },
    { name: "Phiêu lưu", path: "/movies/adventure" },
    { name: "Hoạt hình", path: "/movies/animation" },
    { name: "Hài", path: "/movies/comedy" },
    { name: "Tâm lý", path: "/movies/drama" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/90 backdrop-blur-md border-b border-white/10 font-display text-white transition-all duration-300">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* LEFT: LOGO & NAV */}
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <MdMovie className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
              CineGo
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group h-20 flex items-center cursor-pointer">
              <span className="flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-primary transition-colors">
                Thể loại
                <MdKeyboardArrowDown className="text-xl group-hover:rotate-180 transition-transform duration-300" />
              </span>
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full left-0 w-48 bg-surface-dark border border-white/10 rounded-xl shadow-2xl py-2 mt-2 transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0">
                {GENRES.map((genre) => (
                  <Link
                    key={genre.path}
                    to={genre.path}
                    className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/theaters"
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
            >
              Rạp chiếu
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-white/80 hover:text-primary transition-colors"
            >
              Giới thiệu
            </Link>
          </nav>
        </div>

        {/* RIGHT: SEARCH & AUTH */}
        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-10 w-10 focus-within:w-80 focus-within:bg-surface-dark focus-within:border-primary/50 transition-all duration-300 overflow-hidden hover:bg-white/10">
              <button
                onClick={submitSearch}
                className="focus:outline-none"
                type="button"
              >
                <MdSearch className="text-xl text-white/60 shrink-0 group-focus-within:text-primary transition-colors cursor-pointer hover:text-primary" />
              </button>
              <input
                className="bg-transparent border-none text-white text-sm placeholder:text-white/30 focus:ring-0 w-full ml-2 outline-none h-full"
                placeholder="Tìm kiếm phim..."
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggest(Boolean(suggestions.length))}
                onBlur={() => setTimeout(() => setShowSuggest(false), 200)}
              />
            </div>

            {/* SUGGESTION DROPDOWN */}
            {showSuggest && (
              <div className="absolute left-0 right-0 mt-3 bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-40 ring-1 ring-white/5">
                {suggestLoading && (
                  <div className="p-4 text-center text-white/50 text-sm">
                    <div className="inline-block w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang tìm kiếm...
                  </div>
                )}
                {!suggestLoading && suggestions.length === 0 && (
                  <div className="p-6 text-center text-white/50 text-sm">
                    Không tìm thấy phim nào phù hợp.
                  </div>
                )}
                {!suggestLoading && suggestions.length > 0 && (
                  <>
                    <ul className="max-h-[360px] overflow-y-auto no-scrollbar py-2">
                      {suggestions.map((movie) => (
                        <li
                          key={movie.id}
                          className="px-3 py-2 mx-2 mb-1 rounded-xl hover:bg-white/10 cursor-pointer transition-colors duration-200 group/item"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => handleSelectSuggestion(movie)}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-[72px] rounded-lg bg-surface-dark border border-white/10 overflow-hidden flex-shrink-0 shadow-md group-hover/item:shadow-primary/20 transition-all"
                              style={{
                                backgroundImage: `url(${getPrimaryPoster(
                                  movie.poster_urls
                                )})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                              <h4 className="text-white text-[15px] font-semibold truncate group-hover/item:text-primary transition-colors">
                                {movie.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/5 truncate max-w-[120px]">
                                  {movie.genres?.[0]?.name || "Phim"}
                                </span>
                                {movie.release_date && (
                                  <span className="text-xs text-white/30">
                                    •{" "}
                                    {new Date(movie.release_date).getFullYear()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-white/10 bg-surface-dark/50 backdrop-blur-sm">
                      <button
                        className="w-full flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary hover:text-white hover:bg-primary transition-all duration-300"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={submitSearch}
                      >
                        Xem tất cả kết quả{" "}
                        <MdArrowForward className="text-lg" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* AUTH SECTION */}
          {user ? (
            <div className="relative group h-20 flex items-center cursor-pointer">
              <div className="size-10 rounded-full p-0.5 border-2 border-transparent group-hover:border-primary transition-all overflow-hidden bg-surface-dark flex items-center justify-center shadow-lg">
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {getInitials(user.full_name || user.email)}
                    </span>
                  </div>
                )}
              </div>

              {/* Dropdown Menu */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full right-0 w-72 bg-surface-dark border border-white/10 rounded-xl shadow-2xl py-2 mt-2 transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                <div className="px-5 py-4 border-b border-white/10 mb-2 bg-white/5">
                  <p className="text-sm text-white/50 uppercase tracking-wider text-xs font-bold mb-1">
                    Tài khoản
                  </p>
                  <p className="text-lg text-white font-bold truncate">
                    {user.full_name || "Người dùng"}
                  </p>
                  <p className="text-sm text-white/60 truncate font-light">
                    {user.email}
                  </p>
                </div>

                <div className="px-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MdOutlinePerson className="text-xl text-primary" /> Thông
                    tin cá nhân
                  </Link>
                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MdConfirmationNumber className="text-xl text-primary" /> Vé
                    của tôi
                  </Link>
                </div>

                <div className="border-t border-white/10 my-2 mx-2"></div>

                <div className="px-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left font-medium group/logout"
                  >
                    <MdLogout className="text-xl group-hover/logout:-translate-x-1 transition-transform" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all"
              >
                <MdPerson className="text-lg" /> Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
