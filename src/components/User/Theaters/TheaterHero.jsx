import React from "react";

const HERO_BG =
  "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80";

const TheaterHero = () => {
  return (
    <section className="relative py-16 md:py-24 bg-surface-darker border-b border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BG}
          alt="bg"
          className="w-full h-full object-cover opacity-20 blur-sm"
        />
        <div className="absolute inset-0 bg-background-dark/80" />
      </div>

      <div className="relative z-10 max-w-[1440px] mx-auto px-6">
        <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-4 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Hệ thống toàn quốc
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">
            Hệ Thống Rạp CinemaPlus
          </h1>
          <p className="text-white/60 max-w-2xl text-base md:text-lg">
            Khám phá không gian điện ảnh hiện đại và tiện nghi tại hệ thống rạp
            trên toàn quốc.
          </p>
        </div>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>
    </section>
  );
};

export default TheaterHero;
