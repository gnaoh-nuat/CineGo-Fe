import React from "react";

const STATS = [
  { value: "50+", label: "Rạp chiếu toàn quốc" },
  { value: "200+", label: "Phòng chiếu hiện đại" },
  { value: "1M+", label: "Khách hàng tin dùng" },
];

const IntroSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center animate-fade-in-up">
      {/* --- Left Content --- */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <span className="w-1 h-8 bg-primary rounded-full block"></span>
          Giới thiệu chung về rạp
        </h2>

        <div className="space-y-4 text-white/70 leading-relaxed text-lg font-light">
          <p>
            <strong className="text-white">CineGo</strong> được thành lập với
            niềm đam mê cháy bỏng: mang lại trải nghiệm điện ảnh tuyệt vời nhất
            cho khán giả Việt Nam. Chúng tôi tự hào là hệ thống rạp chiếu phim
            tiên phong trong việc áp dụng các công nghệ chiếu phim hiện đại nhất
            thế giới như IMAX Laser, Dolby Atmos 7.1.
          </p>
          <p>
            Với không gian sang trọng, ghế ngồi êm ái và màn hình sắc nét, mỗi
            bộ phim tại CineGo đều là một tác phẩm nghệ thuật trọn vẹn. Đội ngũ
            nhân viên chuyên nghiệp của chúng tôi luôn sẵn sàng phục vụ để đảm
            bảo bạn có những giây phút giải trí thoải mái nhất.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 mt-2">
          {STATS.map((item, index) => (
            <div key={index}>
              <div className="text-3xl font-bold text-white">{item.value}</div>
              <div className="text-sm text-white/50 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Right Image --- */}
      <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[500px]">
        {/* Đã khôi phục lại link ảnh cũ của bạn */}
        <img
          alt="CineGo Interior"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSMDn0ildwCwUOTgeCFTchu2j4aoXQG4GEREAn14y2eJRh4YbbmpRaojSXQ8_1FQ0MKFprJNBx56BvzZVH54h2Zz0DFM4uRxQXOtVJrSKUhgT84XQolP4wXSfWZ9-LBaAG8HCa_R53zYcOBbzAQmvsguoHtOATI_5qZwYXJH3pyukRtPmNGnlMTNPAGl4-5jqtYVxUGOCcaTy4b1LjqPJYmS54dn9CPvOwNl8TaJjrPz1ZG6fvzyjwJCLZWOpBWz2kYYJ8lpPSiVY0"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-transparent to-transparent pointer-events-none"></div>

        {/* Badge & Quote */}
        <div className="absolute bottom-8 left-8 right-8 pointer-events-none">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-primary text-xs font-bold text-white uppercase tracking-wider">
              Premium
            </span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-bold text-white uppercase tracking-wider">
              Comfort
            </span>
          </div>
          <p className="text-white text-xl font-bold italic">
            "Nơi cảm xúc thăng hoa cùng điện ảnh"
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntroSection;
