import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-surface-dark border-t border-white/10 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-3 text-white">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">movie</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">CinemaPlus</h2>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              Trải nghiệm điện ảnh tuyệt vời cùng CinemaPlus. Những bộ phim hay
              nhất, tiện nghi và dịch vụ đang chờ đón bạn.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all"
              >
                <span className="font-bold text-xs">FB</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all"
              >
                <span className="font-bold text-xs">IG</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-all"
              >
                <span className="font-bold text-xs">YT</span>
              </a>
            </div>
          </div>

          {/* Support Column */}
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

          {/* Movies Column */}
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

          {/* Account Column */}
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

        {/* Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
          <p>© 2024 CinemaPlus. All rights reserved.</p>
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
