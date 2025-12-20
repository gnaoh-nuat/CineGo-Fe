import React from "react";

const PARTNERS = [
  { id: 1, name: "IMAX" },
  { id: 2, name: "DOLBY" },
  { id: 3, name: "SONY" },
  { id: 4, name: "COCA-COLA" },
  { id: 5, name: "MOMO" },
  { id: 6, name: "ZALO" },
  { id: 7, name: "VISA" },
  { id: 8, name: "CJ E&M" },
];

const PartnerSlider = () => {
  return (
    <div className="py-12 animate-fade-in-up border-y border-white/5 bg-background-dark">
      <h2 className="text-xl font-bold text-white/80 mb-8 text-center uppercase tracking-widest">
        Đối tác đồng hành
      </h2>

      <div className="relative w-full overflow-hidden group/slider">
        {/* --- Fade Overlay (Tệp màu hoàn hảo với nền background-dark) --- */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background-dark to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background-dark to-transparent z-10 pointer-events-none"></div>

        {/* --- Slider Container --- */}
        <div className="inline-flex w-full flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <ul className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll group-hover/slider:paused">
            {PARTNERS.map((partner) => (
              <PartnerCard key={partner.id} data={partner} />
            ))}
          </ul>

          <ul
            className="flex items-center justify-center md:justify-start [&_li]:mx-4 [&_img]:max-w-none animate-infinite-scroll group-hover/slider:paused"
            aria-hidden="true"
          >
            {PARTNERS.map((partner) => (
              <PartnerCard key={`${partner.id}-clone`} data={partner} />
            ))}
          </ul>
        </div>
      </div>

      {/* --- CSS Animation --- */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 25s linear infinite;
        }
        .group-hover\\/slider\\:paused:hover .animate-infinite-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

const PartnerCard = ({ data }) => {
  return (
    <li className="mx-4">
      {/* Giữ card là surface-dark để nổi nhẹ trên nền background-dark */}
      <div className="w-48 h-24 bg-surface-dark/50 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center px-6 transition-all duration-300 hover:bg-white/10 hover:border-white/30 cursor-pointer group">
        {data.logo ? (
          <img
            src={data.logo}
            alt={data.name}
            className="h-10 w-auto opacity-50 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <span className="text-2xl font-black text-white/30 group-hover:text-white/90 group-hover:scale-110 transition-all duration-300 tracking-tighter truncate">
            {data.name}
          </span>
        )}
      </div>
    </li>
  );
};

export default PartnerSlider;
