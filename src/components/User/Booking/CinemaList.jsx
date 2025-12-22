import React from "react";
import CinemaItem from "./CinemaItem";
import { MdSentimentDissatisfied } from "react-icons/md";

const CinemaList = ({
  groups = [],
  loading = false,
  movieDuration,
  onSelectShowtime,
}) => {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((skeleton) => (
          <div
            key={skeleton}
            className="h-48 bg-surface-dark border border-white/5 rounded-2xl animate-pulse"
          >
            <div className="h-20 border-b border-white/5 bg-white/5 rounded-t-2xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="bg-surface-dark/50 rounded-2xl border border-white/10 p-12 text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20">
          <MdSentimentDissatisfied className="text-4xl" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">Chưa có lịch chiếu</h3>
          <p className="text-white/50 text-sm mt-1">
            Vui lòng chọn ngày khác hoặc thử lại sau.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {groups.map((group) => (
        <CinemaItem
          key={group.id || group.cinema?.id}
          cinema={group.cinema}
          showtimes={group.showtimes}
          movieDuration={movieDuration}
          onSelect={onSelectShowtime}
        />
      ))}
    </div>
  );
};

export default CinemaList;
