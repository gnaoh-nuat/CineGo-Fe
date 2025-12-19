import React from "react";
import { Link } from "react-router-dom";

const PromotionBanner = () => {
  return (
    <section className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-8 py-12 shadow-2xl border border-white/10 group">
        {/* --- Background Effects (Blobs) --- */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-primary/30 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl opacity-30"></div>

        {/* --- Content --- */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Ưu đãi dành cho thành viên mới
            </h2>
            <p className="text-indigo-200 text-lg md:text-xl font-light">
              Đăng ký ngay hôm nay để nhận{" "}
              <span className="text-white font-semibold">
                Combo Bắp & Nước miễn phí
              </span>{" "}
              cho lần đặt vé đầu tiên của bạn!
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/register"
              className="inline-block bg-white text-indigo-900 font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all duration-300 transform"
            >
              Đăng Ký Ngay
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionBanner;
