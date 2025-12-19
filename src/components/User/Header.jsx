import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Import Icons
import {
  MdMovie,
  MdSearch,
  MdPerson,
  MdOutlinePerson,
  MdLogout,
  MdConfirmationNumber,
  MdKeyboardArrowDown,
} from "react-icons/md";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && keyword.trim()) {
      // Điều hướng đến trang tìm kiếm (nếu có)
      navigate(`/search?q=${keyword}`);
    }
  };

  // Helper: Lấy chữ cái đầu tên
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  // Danh sách thể loại phim (Dễ dàng mở rộng sau này)
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
        {/* --- LEFT: LOGO & NAV --- */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
              <MdMovie className="text-2xl" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight group-hover:text-primary transition-colors">
              CineGo
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Dropdown Phim */}
            <div className="relative group h-20 flex items-center cursor-pointer">
              <span className="flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-primary transition-colors">
                Thể loại
                <MdKeyboardArrowDown className="text-xl group-hover:rotate-180 transition-transform duration-300" />
              </span>

              {/* Dropdown Content */}
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

        {/* --- RIGHT: SEARCH & AUTH --- */}
        <div className="flex items-center gap-6">
          {/* Search Bar */}
          <div className="relative group hidden lg:block">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-4 h-10 w-10 focus-within:w-64 focus-within:bg-surface-dark focus-within:border-primary/50 transition-all duration-300 overflow-hidden cursor-text hover:bg-white/10">
              <MdSearch className="text-xl text-white/60 shrink-0 group-focus-within:text-primary transition-colors" />
              <input
                className="bg-transparent border-none text-white text-sm placeholder:text-white/30 focus:ring-0 w-full ml-2 outline-none h-full"
                placeholder="Tìm kiếm phim..."
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleSearch}
              />
            </div>
          </div>

          {/* Auth Section */}
          {user ? (
            // --- LOGGED IN: USER AVATAR & DROPDOWN ---
            <div className="relative group h-20 flex items-center cursor-pointer">
              {/* Avatar Circle */}
              <div className="size-10 rounded-full p-0.5 border-2 border-transparent group-hover:border-primary transition-all overflow-hidden bg-surface-dark flex items-center justify-center shadow-lg">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-rose-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {getInitials(user.full_name)}
                    </span>
                  </div>
                )}
              </div>

              {/* User Dropdown Menu */}
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute top-full right-0 w-72 bg-surface-dark border border-white/10 rounded-xl shadow-2xl py-2 mt-2 transition-all duration-300 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                {/* 1. Thông tin User (Tên & Email) */}
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

                {/* 2. Menu Links */}
                <div className="px-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MdOutlinePerson className="text-xl text-primary" />
                    Thông tin cá nhân
                  </Link>

                  <Link
                    to="/orders"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    <MdConfirmationNumber className="text-xl text-primary" />
                    Vé của tôi
                  </Link>
                </div>

                <div className="border-t border-white/10 my-2 mx-2"></div>

                {/* 3. Logout */}
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
            // --- NOT LOGGED IN: BUTTONS ---
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
                <MdPerson className="text-lg" />
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
