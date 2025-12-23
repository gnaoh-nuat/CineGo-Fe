import React from "react";
import {
  formatCurrency,
  formatDateTime,
  formatSeats,
  mapOrderStatus,
  getPrimaryPoster,
} from "../../../utils/helper";

const TicketResult = ({ order, onCheckIn, checkingIn }) => {
  if (!order) return null;

  // Lấy trạng thái và format dữ liệu
  const statusInfo = mapOrderStatus(order.status);
  const seatsText = formatSeats(order.Tickets || []);
  const foodsText = (order.OrderFoods || [])
    .map((f) => `${f.quantity || 1} x ${f?.Food?.name || f?.name || "Combo"}`)
    .join(", ");
  const user = order.User || {};
  const primaryTicket = order.Tickets?.[0];
  const movie =
    order.Movie ||
    primaryTicket?.Movie ||
    primaryTicket?.Showtime?.Movie ||
    primaryTicket?.ShowTime?.Movie;
  const posterSource = movie?.poster_urls || movie?.poster_url || order.poster_urls;
  const poster = Array.isArray(posterSource)
    ? getPrimaryPoster(posterSource)
    : posterSource
    ? posterSource
    : getPrimaryPoster([]);
  const duration =
    order.duration ||
    movie?.duration_minutes ||
    movie?.duration ||
    primaryTicket?.Showtime?.Movie?.duration_minutes;
  const movieFormat =
    order.movie_format ||
    primaryTicket?.Showtime?.movie_format ||
    primaryTicket?.ShowTime?.movie_format;
  const ageRating =
    movie?.age_rating || movie?.rated || order.age_rating || "T13";
  const showtime =
    order.showtime ||
    primaryTicket?.Showtime?.start_time ||
    primaryTicket?.Showtime?.startTime ||
    primaryTicket?.ShowTime?.start_time;
  const roomName =
    order.Room?.name ||
    primaryTicket?.Showtime?.Room?.name ||
    primaryTicket?.Showtime?.CinemaRoom?.name ||
    primaryTicket?.Room?.name;
  const cinemaName =
    order.Cinema?.name ||
    primaryTicket?.Showtime?.Cinema?.name ||
    primaryTicket?.Showtime?.CinemaRoom?.Cinema?.name;
  const seatsDisplay = seatsText || order.seats || "";
  const normalizedStatus = (order.status || "").toUpperCase();

  // Logic màu sắc trạng thái
  const isPaid = ["PAID", "SUCCESSFUL"].includes(normalizedStatus);
  const isUsed = order.is_used;

  // Xác định style dựa trên logic nghiệp vụ
  let variant = "danger"; // Mặc định đỏ (Lỗi)
  let statusLabel = "Không hợp lệ";
  let statusIcon = "error";

  if (isUsed) {
    variant = "warning";
    statusLabel = "Vé đã sử dụng";
    statusIcon = "history";
  } else if (isPaid) {
    variant = "success";
    statusLabel = "Mã vé hợp lệ";
    statusIcon = "check_circle";
  }

  // Map class color
  const colorMap = {
    success: {
      bg: "bg-success",
      text: "text-success",
      border: "border-success/20",
      bgSoft: "bg-success/10",
    },
    warning: {
      bg: "bg-warning",
      text: "text-warning",
      border: "border-warning/20",
      bgSoft: "bg-warning/10",
    },
    danger: {
      bg: "bg-danger",
      text: "text-danger",
      border: "border-danger/20",
      bgSoft: "bg-danger/10",
    },
  };
  const theme = colorMap[variant];

  return (
    <div className="animate-fade-in-up bg-surface-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col relative overflow-hidden h-full">
      {/* Header Card */}
      <div
        className={`p-5 flex items-center justify-between border-b ${theme.bgSoft} ${theme.border}`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`size-10 rounded-full flex items-center justify-center shadow-lg ${theme.bg} text-white`}
          >
            <span className="material-symbols-outlined text-2xl font-bold">
              {statusIcon}
            </span>
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${theme.text}`}>
              {statusLabel}
            </h3>
            <p className="text-white/50 text-xs mt-0.5">
              {isUsed
                ? "Vé này đã được check-in trước đó."
                : "Thông tin hợp lệ. Có thể check-in."}
            </p>
          </div>
        </div>
        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${theme.bgSoft} ${theme.text} ${theme.border}`}
        >
          {isUsed ? "USED" : order.status}
        </span>
      </div>

      <div className="p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Poster & Mã vé */}
          <div className="shrink-0 flex flex-col gap-4 lg:w-64">
            <div className="aspect-[2/3] rounded-xl bg-black/40 shadow-2xl overflow-hidden relative group border border-white/10">
              {poster ? (
                <img
                  src={poster}
                  alt="poster"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white/10">
                  <span className="material-symbols-outlined text-6xl">
                    movie
                  </span>
                </div>
              )}
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/5 flex flex-col items-center text-center gap-2">
              <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">
                MÃ ĐẶT VÉ
              </p>
              <p className="font-mono text-xl text-primary font-bold tracking-wider">
                {order.booking_code}
              </p>
            </div>
          </div>

          {/* Thông tin chi tiết */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                {movie?.title || "Thông tin phim không có sẵn"}
              </h2>
              <div className="flex flex-wrap gap-2 text-sm font-medium">
                {movieFormat && (
                  <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                    {movieFormat}
                  </span>
                )}
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/80">
                  {duration ? `${duration} phút` : "N/A"}
                </span>
                <span className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  {ageRating}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                  Khách hàng
                </label>
                <p className="text-lg font-semibold text-white">
                  {user.full_name || "Khách lẻ"}
                </p>
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                  {user.phone || "---"}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                  Suất chiếu
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">
                    calendar_month
                  </span>
                  <p className="text-lg font-bold text-white">
                    {formatDateTime(showtime)}
                  </p>
                </div>
                {(cinemaName || roomName) && (
                  <p className="text-sm text-white/60 pl-7">
                    {cinemaName || ""}
                    {cinemaName && roomName ? " - " : ""}
                    {roomName || ""}
                  </p>
                )}
              </div>
            </div>

            {/* Ghế và Bắp nước */}
            <div className="grid gap-4">
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 relative">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wide mb-2 block">
                  Ghế đã đặt
                </label>
                <div className="flex flex-wrap gap-2">
                  {seatsDisplay ? (
                    seatsDisplay.split(/,\s*/).map((seat) => (
                      <span
                        key={seat}
                        className="px-4 py-2 bg-background-dark border border-primary/30 text-primary font-bold rounded-lg shadow-sm"
                      >
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/40 italic">Chưa chọn ghế</span>
                  )}
                </div>
              </div>

              {foodsText && (
                <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wide mb-1 block">
                    Bắp nước
                  </label>
                  <p className="text-white/90 font-medium">{foodsText}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-5 border-t border-white/10 bg-surface-dark flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-white/40 uppercase font-bold">
            Tổng thanh toán
          </span>
          <span className="text-2xl font-bold text-white">
            {formatCurrency(order.total_amount)}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              /* Logic reset form */
            }}
            className="px-6 py-3 rounded-xl font-bold text-white/60 hover:text-white hover:bg-white/5 transition-colors"
          >
            Quét lại
          </button>
          <button
            onClick={onCheckIn}
            disabled={checkingIn || !order.booking_code || isUsed}
            className={`
                 relative px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-3 transition-all transform active:scale-95
                 ${
                   isUsed
                     ? "bg-white/10 cursor-not-allowed text-white/40 shadow-none"
                     : "bg-primary hover:bg-red-600 shadow-primary/25 hover:shadow-primary/40"
                 }
              `}
          >
            {checkingIn ? (
              <>
                <span className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : isUsed ? (
              <>
                <span className="material-symbols-outlined">check_circle</span>
                Đã Check-in
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  airplane_ticket
                </span>
                Xác nhận vào rạp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketResult;
