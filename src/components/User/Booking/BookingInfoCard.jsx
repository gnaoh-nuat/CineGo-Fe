import React from "react";
import {
  formatDateTime,
  formatDuration,
  formatTimeHM,
  calcEndTime,
  getPrimaryPoster,
  seatLabel,
} from "../../../utils/helper";
import { MdEventSeat, MdSchedule, MdTheaters, MdMovie } from "react-icons/md";

const BookingInfoCard = ({ showtime = {}, seats = [] }) => {
  const posterUrl =
    showtime.posterUrl ||
    showtime.poster_url ||
    getPrimaryPoster(showtime.posterUrls);

  const movieTitle =
    showtime.movieTitle ||
    showtime.movie_title ||
    showtime.title ||
    "Phim đang chọn";

  const cinemaName =
    showtime.cinemaName ||
    showtime.cinema_name ||
    showtime.cinema ||
    "Rạp đang chọn";

  const roomName =
    showtime.roomName || showtime.room_name || showtime.room || "Phòng chiếu";

  const format = showtime.format || showtime.movie_format || "2D";
  const ageRating = showtime.ageRating || showtime.age_rating || "T13";

  const startTime = showtime.startTime || showtime.start_time;
  const duration =
    showtime.duration || showtime.duration_minutes || showtime.movie_duration;

  const endTime = startTime && duration ? calcEndTime(startTime, duration) : "";
  const showDateTime = startTime
    ? formatDateTime(startTime)
    : "Thời gian cập nhật sau";

  const seatLabels = seats.length
    ? seats
        .map((seat) => seatLabel(seat))
        .filter(Boolean)
        .join(", ")
    : "Chưa chọn ghế";

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 shadow-xl">
      <div className="w-full sm:w-32 md:w-40 shrink-0 rounded-lg overflow-hidden border border-white/10 shadow-lg">
        <img
          src={posterUrl}
          alt={movieTitle}
          className="w-full h-full object-cover aspect-[2/3]"
        />
      </div>

      <div className="flex-grow">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          {movieTitle}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="px-2.5 py-1 rounded bg-white/10 text-xs font-bold text-white border border-white/10 uppercase tracking-wider">
            {format}
          </span>
          <span className="px-2.5 py-1 rounded bg-primary text-xs font-bold text-white uppercase tracking-wider">
            {ageRating}
          </span>
          {duration ? (
            <div className="flex items-center gap-1 text-white/70 text-sm font-medium">
              <MdSchedule className="text-lg" />
              {formatDuration(duration)}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm border-t border-white/5 pt-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded bg-white/5 flex items-center justify-center text-white/60">
              <MdTheaters />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                Rạp chiếu
              </p>
              <p className="text-white font-medium">{cinemaName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-9 rounded bg-white/5 flex items-center justify-center text-white/60">
              <MdMovie />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                Phòng chiếu
              </p>
              <p className="text-white font-medium">{roomName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-9 rounded bg-white/5 flex items-center justify-center text-white/60">
              <MdSchedule />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                Suất chiếu
              </p>
              <p className="text-white font-medium text-lg text-primary">
                {startTime ? formatTimeHM(startTime) : "--:--"}
              </p>
              <p className="text-white/70">{showDateTime}</p>
              {endTime ? (
                <p className="text-white/40 text-xs mt-1">
                  Kết thúc khoảng {endTime}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="size-9 rounded bg-white/5 flex items-center justify-center text-white/60">
              <MdEventSeat />
            </div>
            <div>
              <p className="text-white/40 text-xs uppercase font-bold tracking-wider mb-1">
                Ghế đã chọn
              </p>
              <p className="text-white font-bold">{seatLabels}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingInfoCard;
