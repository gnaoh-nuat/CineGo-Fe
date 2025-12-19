import React from "react";
import { Link } from "react-router-dom";
import { MdLoyalty } from "react-icons/md";

const MembershipSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-background-dark to-surface-dark border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <MdLoyalty className="text-6xl text-primary animate-bounce" />
        </div>

        {/* Content */}
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trải nghiệm điện ảnh đỉnh cao
        </h2>
        <p className="text-white/60 text-lg mb-8 leading-relaxed max-w-2xl mx-auto">
          Đăng ký thành viên CinemaPlus ngay hôm nay để tích điểm, đổi quà và
          nhận vé mời tham dự các buổi công chiếu phim bom tấn sớm nhất.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all shadow-lg shadow-primary/20 transform hover:-translate-y-1"
          >
            Đăng Ký Ngay
          </Link>
          <Link
            to="/membership"
            className="w-full sm:w-auto px-8 py-3 bg-transparent border border-white/20 hover:bg-white/5 text-white font-bold rounded-lg transition-all hover:border-white/40"
          >
            Tìm Hiểu Thêm
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
