import React from "react";
// Giả định file helper nằm cùng cấp hoặc trong thư mục utils, bạn hãy chỉnh lại đường dẫn cho đúng
import { getYouTubeThumbnail } from "../../../utils/helper";

// Link video giới thiệu (Ví dụ: Intro Dolby Atmos hoặc Trailer rạp)
// Bạn chỉ cần thay link YouTube vào đây, helper sẽ tự lấy ảnh
const INTRO_VIDEO_URL = "https://www.youtube.com/watch?v=LXb3EKWsInQ";

const VideoSection = () => {
  // Sử dụng helper để lấy thumbnail. Nếu lỗi sẽ có ảnh fallback
  const thumbnailUrl =
    getYouTubeThumbnail(INTRO_VIDEO_URL) ||
    "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80";

  return (
    <div
      className="mb-24 animate-fade-in-up"
      style={{ animationDelay: "0.2s" }}
    >
      <div className="bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-xl p-1.5">
        {/* --- Video Thumbnail Wrapper --- */}
        <div className="relative w-full aspect-[21/9] bg-black rounded-xl overflow-hidden group cursor-pointer">
          <img
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-500 scale-100 group-hover:scale-105"
            src={thumbnailUrl}
            alt="Video Thumbnail"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/90 hover:bg-primary flex items-center justify-center pl-1 shadow-[0_0_30px_rgba(234,42,51,0.5)] group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/20">
              {/* Sửa lỗi Icon: Dùng SVG trực tiếp thay vì font icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-10 h-10 text-white"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>

            <span className="text-white font-medium tracking-wider uppercase text-sm opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
              Xem Video Giới Thiệu
            </span>
          </div>
        </div>

        {/* --- Content Footer --- */}
        <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              Hành trình CineGo
            </h3>
            <p className="text-white/50 text-sm">
              Khám phá quá trình hình thành và phát triển của hệ thống rạp chiếu
              phim hàng đầu.
            </p>
          </div>

          <button className="text-primary hover:text-white font-medium text-sm transition-colors flex items-center gap-1 group/btn">
            Xem tất cả video
            {/* Sửa lỗi Icon: Arrow Forward SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 transition-transform group-hover/btn:translate-x-1"
            >
              <path d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;
