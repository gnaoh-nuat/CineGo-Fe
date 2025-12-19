import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    // Dùng bg-background-dark để đồng bộ với config
    <footer className="bg-background-dark border-t border-white/10 pt-16 pb-8 font-display text-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* --- CỘT 1: BRAND INFO --- */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo CineGo */}
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M19.838 3H4.162C3.52 3 3 3.52 3 4.162V19.84c0 .64.52 1.16 1.162 1.16h15.676c.642 0 1.162-.52 1.162-1.16V4.16c0-.64-.52-1.16-1.162-1.16ZM7 11H5V9h2v2Zm0-4H5V5h2v2Zm4 4H9V9h2v2Zm0-4H9V5h2v2Zm4 4h-2V9h2v2Zm0-4h-2V5h2v2Zm4 4h-2V9h2v2Zm0-4h-2V5h2v2Z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight">CineGo</h2>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed">
              Trải nghiệm điện ảnh tuyệt vời cùng CineGo. Những bộ phim hay
              nhất, tiện nghi và dịch vụ đang chờ đón bạn.
            </p>

            {/* Social Icons (Giữ nguyên màu đặc trưng của MXH) */}
            <div className="flex gap-4">
              {/* Facebook */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#1877F2] hover:text-white transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-[#FF0000] hover:text-white transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5"
                >
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                </svg>
              </a>
            </div>
          </div>

          {/* --- CỘT 2: HỖ TRỢ --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Hỗ trợ</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary transition-colors"
                >
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/feedback"
                  className="hover:text-primary transition-colors"
                >
                  Góp ý
                </Link>
              </li>
            </ul>
          </div>

          {/* --- CỘT 3: PHIM --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Phim</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <Link
                  to="/movies/action"
                  className="hover:text-primary transition-colors"
                >
                  Hành động
                </Link>
              </li>
              <li>
                <Link
                  to="/movies/adventure"
                  className="hover:text-primary transition-colors"
                >
                  Phiêu lưu
                </Link>
              </li>
              <li>
                <Link
                  to="/movies/animation"
                  className="hover:text-primary transition-colors"
                >
                  Hoạt hình
                </Link>
              </li>
              <li>
                <Link
                  to="/movies/comedy"
                  className="hover:text-primary transition-colors"
                >
                  Hài
                </Link>
              </li>
              <li>
                <Link
                  to="/movies/drama"
                  className="hover:text-primary transition-colors"
                >
                  Tâm lý
                </Link>
              </li>
            </ul>
          </div>

          {/* --- CỘT 4: TÀI KHOẢN --- */}
          <div>
            <h3 className="text-white font-bold mb-6">Tài khoản</h3>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <Link
                  to="/login"
                  className="hover:text-primary transition-colors"
                >
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-primary transition-colors"
                >
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link
                  to="/membership"
                  className="hover:text-primary transition-colors"
                >
                  Thành viên
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* --- COPYRIGHT --- */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2024 CineGo. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/sitemap" className="hover:text-white">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
