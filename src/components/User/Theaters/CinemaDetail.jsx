import React, { useState } from "react";
import {
  MdLocationOn,
  MdViewInAr,
  MdMap,
  MdPhotoLibrary,
  MdChair,
  MdLocalCafe,
  MdSupportAgent,
  MdFax,
  MdTheaters,
  MdSurroundSound,
  MdWifi,
  MdAccessible,
  MdClose,
} from "react-icons/md";
import { getPrimaryPoster } from "../../../utils/helper";
// Import component 3D Viewer vừa tạo
import Cinema3DViewer from "./Cinema3DViewer.jsx";

const CinemaDetail = ({ cinema, loading }) => {
  // State bật tắt Modal Map và 3D
  const [showMap, setShowMap] = useState(false);
  const [show3D, setShow3D] = useState(false);

  if (loading) {
    return (
      <div className="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col relative animate-pulse">
        <div className="h-64 md:h-[340px] bg-white/5 w-full"></div>
        <div className="p-8 space-y-4">
          <div className="h-10 bg-white/5 rounded w-1/3"></div>
          <div className="h-40 bg-white/5 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (!cinema) {
    return (
      <div className="bg-surface-dark border border-white/10 rounded-xl shadow-2xl h-full flex items-center justify-center p-10 text-white/40">
        Vui lòng chọn rạp để xem chi tiết
      </div>
    );
  }

  const cover = getPrimaryPoster(cinema.image_urls);

  // Tạo link Google Maps Embed (Miễn phí, không cần API Key)
  const getMapSrc = () => {
    const query = encodeURIComponent(`${cinema.name} ${cinema.address}`);
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  };

  return (
    <div className="bg-surface-dark border border-white/10 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col relative animate-fade-in-up">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header Image */}
      <div className="relative h-64 md:h-[340px] w-full group overflow-hidden shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('${cover}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent" />

        <div className="absolute bottom-0 left-0 p-8 w-full z-10">
          <div className="flex flex-col gap-2">
            <div className="inline-flex items-center px-2.5 py-1 rounded bg-primary/90 text-white text-[10px] font-bold uppercase tracking-wider w-fit shadow-lg shadow-primary/20">
              Đang mở cửa
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-1 drop-shadow-lg leading-tight">
              {cinema.name}
            </h2>
            <div className="flex items-start md:items-center gap-2 text-white/90 max-w-2xl">
              <MdLocationOn className="text-primary text-xl shrink-0 mt-0.5 md:mt-0" />
              <span className="text-sm md:text-base font-light">
                {cinema.address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-8 flex-grow flex flex-col gap-8 overflow-y-auto custom-scrollbar bg-background-dark/20">
        {/* Actions Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 border-b border-white/10 pb-8">
          <button
            onClick={() => setShow3D(true)}
            className="flex-1 flex items-center justify-center gap-3 h-14 px-6 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white font-bold rounded-xl transition-all group"
          >
            <MdViewInAr className="text-2xl group-hover:rotate-[360deg] transition-transform duration-700" />
            <span>Xem mô hình 3D</span>
          </button>

          <button
            onClick={() => setShowMap(true)}
            className="flex-1 flex items-center justify-center gap-3 h-14 px-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl transition-all group"
          >
            <MdMap className="text-2xl group-hover:text-green-400 transition-colors" />
            <span>Xem bản đồ</span>
          </button>
        </div>

        {/* Gallery & Info Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <div className="flex flex-col h-full">
            <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Hình ảnh rạp
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 h-48 rounded-xl overflow-hidden relative group cursor-pointer shadow-lg">
                <img
                  src={cover}
                  alt="Main view"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="col-span-1 h-32 rounded-xl overflow-hidden relative group cursor-pointer bg-white/5 border border-white/5 flex items-center justify-center">
                <MdChair className="text-white/20 text-4xl group-hover:text-white/40 transition-colors" />
              </div>
              <div className="col-span-1 h-32 rounded-xl overflow-hidden relative group cursor-pointer bg-white/5 border border-white/5 flex items-center justify-center">
                <MdLocalCafe className="text-white/20 text-4xl group-hover:text-white/40 transition-colors" />
              </div>
              <div className="col-span-2 mt-2">
                <button className="w-full py-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-medium text-white transition-all flex items-center justify-center gap-2">
                  <MdPhotoLibrary className="text-lg" />
                  Xem tất cả hình ảnh
                </button>
              </div>
            </div>
          </div>

          {/* Amenities & Contact */}
          <div className="flex flex-col gap-8">
            {/* Contact */}
            <div>
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Liên hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="size-10 rounded-full bg-surface-dark flex items-center justify-center text-primary border border-white/10 shrink-0 shadow-inner">
                    <MdSupportAgent className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                      Tổng đài hỗ trợ
                    </p>
                    <p className="text-white font-bold text-lg tracking-wide">
                      {cinema.hotline || "1900 1234 56"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="size-10 rounded-full bg-surface-dark flex items-center justify-center text-primary border border-white/10 shrink-0 shadow-inner">
                    <MdFax className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-wider">
                      Fax
                    </p>
                    <p className="text-white font-bold text-lg tracking-wide">
                      {cinema.fax || "+84 24 3333 4444"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-primary rounded-full"></span>
                Tiện ích rạp
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 flex flex-col items-start gap-2 border border-white/5 transition-colors">
                  <MdTheaters className="text-yellow-500 text-xl" />
                  <span className="text-sm font-medium text-white/90">
                    IMAX Laser
                  </span>
                </div>
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 flex flex-col items-start gap-2 border border-white/5 transition-colors">
                  <MdSurroundSound className="text-blue-500 text-xl" />
                  <span className="text-sm font-medium text-white/90">
                    Dolby Atmos
                  </span>
                </div>
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 flex flex-col items-start gap-2 border border-white/5 transition-colors">
                  <MdWifi className="text-green-500 text-xl" />
                  <span className="text-sm font-medium text-white/90">
                    Free Wifi
                  </span>
                </div>
                <div className="bg-white/5 hover:bg-white/10 rounded-lg p-3 flex flex-col items-start gap-2 border border-white/5 transition-colors">
                  <MdAccessible className="text-purple-500 text-xl" />
                  <span className="text-sm font-medium text-white/90">
                    Wheelchair
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- MAP MODAL --- */}
      {showMap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in-up">
          <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <MdMap className="text-primary text-2xl" />
                <div>
                  <h3 className="text-white font-bold text-lg">
                    {cinema.name}
                  </h3>
                  <p className="text-white/50 text-xs">{cinema.address}</p>
                </div>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>
            <div className="flex-grow bg-background-dark relative">
              <iframe
                title="Cinema Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight="0"
                marginWidth="0"
                src={getMapSrc()}
                className="w-full h-full grayscale-[0.5] invert-[0.9] hue-rotate-180 contrast-[1.1]"
                style={{ filter: "invert(90%) hue-rotate(180deg)" }}
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* --- 3D MODAL --- */}
      {show3D && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in-up">
          <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Header Modal 3D */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5 z-10 shrink-0">
              <div className="flex items-center gap-3">
                <MdViewInAr className="text-primary text-2xl" />
                <div>
                  <h3 className="text-white font-bold text-lg">
                    Mô hình 3D - {cinema.name}
                  </h3>
                  <p className="text-white/50 text-xs">
                    Sử dụng chuột trái để xoay, con lăn để zoom
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShow3D(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Vùng hiển thị 3D Viewer */}
            <div className="flex-grow relative">
              <Cinema3DViewer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaDetail;
