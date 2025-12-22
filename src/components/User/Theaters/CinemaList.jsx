import React from "react";
import CinemaCard from "./CinemaCard";

const SkeletonCard = () => (
  <div className="rounded-xl border border-white/10 bg-surface-dark/60 animate-pulse h-[220px]" />
);

const CinemaList = ({ cinemas = [], loading = false, onViewDetail }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    );
  }

  if (!cinemas.length) {
    return (
      <div className="border border-dashed border-white/20 rounded-xl p-10 text-center bg-surface-dark/60">
        <p className="text-white/70">Không tìm thấy rạp phù hợp.</p>
        <p className="text-white/40 text-sm mt-1">
          Thử đổi tỉnh thành hoặc từ khóa khác.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {cinemas.map((cinema) => (
        <CinemaCard
          key={cinema.id}
          cinema={cinema}
          onViewDetail={onViewDetail}
        />
      ))}
    </div>
  );
};

export default CinemaList;
