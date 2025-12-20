import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#121212]/90 backdrop-blur-md border-b border-white/10 font-sans">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        {/* --- LEFT SECTION: LOGO & NAV --- */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity group"
          >
            {/* SỬA: Dùng bg-[#ea2a33] trực tiếp cho màu đỏ logo */}
            <div className="size-8 bg-[#ea2a33] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#ea2a33]/30 group-hover:scale-105 transition-transform">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path d="M19.838 3H4.162C3.52 3 3 3.52 3 4.162V19.84c0 .64.52 1.16 1.162 1.16h15.676c.642 0 1.162-.52 1.162-1.16V4.16c0-.64-.52-1.16-1.162-1.16ZM7 11H5V9h2v2Zm0-4H5V5h2v2Zm4 4H9V9h2v2Zm0-4H9V5h2v2Zm4 4h-2V9h2v2Zm0-4h-2V5h2v2Zm4 4h-2V9h2v2Zm0-4h-2V5h2v2Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight">CinemaPlus</h1>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="relative group h-20 flex items-center cursor-pointer">
              <span className="flex items-center gap-1 text-sm font-medium text-white/80 group-hover:text-[#ea2a33] transition-colors">
                Phim
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5 group-hover:rotate-180 transition-transform duration-300"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>

              {/* Dropdown Menu - Dùng bg-[#1e1e1e] cho menu con */}
              <div className="hidden group-hover:block absolute top-[90%] left-0 w-48 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl py-2 animate-fade-in-up">
                <Link
                  to="/movies/action"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Hành động
                </Link>
                <Link
                  to="/movies/adventure"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Phiêu lưu
                </Link>
                <Link
                  to="/movies/animation"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Hoạt hình
                </Link>
                <Link
                  to="/movies/comedy"
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Hài
                </Link>
              </div>
            </div>

            <Link
              to="/theaters"
              className="text-sm font-medium text-white/80 hover:text-[#ea2a33] transition-colors"
            >
              Rạp
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-white/80 hover:text-[#ea2a33] transition-colors"
            >
              Giới thiệu
            </Link>
          </nav>
        </div>

        {/* --- RIGHT SECTION --- */}
        <div className="flex items-center gap-5">
          <div className="relative group">
            {/* Thanh search dùng màu nền trắng mờ bg-white/5 */}
            <label className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 h-10 w-10 focus-within:w-64 focus-within:bg-[#1e1e1e] focus-within:border-[#ea2a33]/50 transition-all duration-300 overflow-hidden cursor-text hover:bg-white/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 text-white/60 shrink-0 group-focus-within:text-[#ea2a33] transition-colors"
              >
                <path
                  fillRule="evenodd"
                  d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                className="bg-transparent border-none text-white text-sm placeholder:text-white/30 focus:ring-0 w-full ml-2 outline-none h-full"
                placeholder="Tìm kiếm..."
                type="text"
              />
            </label>
          </div>

          <div className="relative group h-20 flex items-center cursor-pointer">
            <div className="size-10 rounded-full p-0.5 border-2 border-transparent group-hover:border-[#ea2a33] transition-all">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"
                alt="User"
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            {/* Dropdown User - Dùng bg-[#1e1e1e] */}
            <div className="hidden group-hover:block absolute top-[85%] right-0 w-56 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl py-2 animate-fade-in-up">
              <div className="px-4 py-3 border-b border-white/10 mb-2">
                <p className="text-sm text-white font-bold">John Doe</p>
                <p className="text-xs text-white/50 truncate">
                  john.doe@example.com
                </p>
              </div>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                Thông tin cá nhân
              </Link>
              <div className="border-t border-white/10 my-2"></div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:text-red-400 hover:bg-white/10 transition-colors text-left font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
                    clipRule="evenodd"
                  />
                </svg>
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
