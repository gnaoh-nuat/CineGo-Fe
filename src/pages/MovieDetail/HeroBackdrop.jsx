import React from "react";

const HeroBackdrop = ({ movie }) => {
  // Lấy ảnh đầu tiên trong mảng poster hoặc fallback
  const backgroundUrl = movie?.poster_urls?.[0] || "";

  return (
    <div className="relative w-full h-[550px] overflow-hidden">
      {/* Ảnh nền */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-[2px]" // Thêm blur nhẹ để làm nổi bật nội dung chính
        style={{ backgroundImage: `url('${backgroundUrl}')` }}
      >
        {/* Gradient phủ: Tối dần từ dưới lên và từ trái sang */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/60 to-transparent"></div>
      </div>
    </div>
  );
};

export default HeroBackdrop;
