import React from "react";
import {
  MdCalendarMonth,
  MdLocationOn,
  MdEventSeat,
  MdQrCode,
  MdInfo,
  MdAccessTime,
} from "react-icons/md";
import {
  formatCurrency,
  formatDateTime,
  getPrimaryPoster,
  mapOrderStatus,
} from "../../../utils/helper";

const OrderCard = ({ order, onShowQr, onViewDetail }) => {
  const ticket = order?.Tickets?.[0];
  const movie = ticket?.Showtime?.Movie;
  const showtime = ticket?.Showtime;

  // Xử lý hiển thị danh sách ghế gọn gàng
  const seatList = order?.Tickets?.map((t) =>
    t.Seat?.row && t.Seat?.number
      ? `${t.Seat.row}${t.Seat.number}`
      : t.Seat?.number || t.seat_id
  );
  const seats = seatList?.join(", ") || "";
  const seatCount = seatList?.length || 0;

  const statusMeta = mapOrderStatus(order?.status);

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-primary/50 transition-all duration-300 group flex flex-col md:flex-row">
      {/* Poster Section */}
      <div className="w-full md:w-48 h-48 md:h-auto shrink-0 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{
            backgroundImage: `url('${getPrimaryPoster(movie?.poster_urls)}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent md:bg-gradient-to-r" />

        {/* Badge Format */}
        <div className="absolute top-3 left-3 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
          {showtime?.movie_format || "2D"}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow p-5 flex flex-col justify-between gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-3">
            <h3
              className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1"
              title={movie?.title}
            >
              {movie?.title || "Đang cập nhật..."}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-primary text-lg" />
                <span>
                  {formatDateTime(showtime?.start_time)?.split(" - ")[0] || ""}
                  <span className="text-white/40 mx-1">|</span>
                  <span className="text-white font-medium">
                    {formatDateTime(showtime?.start_time)?.split(" - ")[1] ||
                      ""}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-primary text-lg" />
                <span
                  className="truncate max-w-[200px]"
                  title={showtime?.CinemaRoom?.name}
                >
                  {showtime?.CinemaRoom?.Cinema?.name} -{" "}
                  {showtime?.CinemaRoom?.name}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <MdEventSeat className="text-primary text-lg" />
                <span className="truncate max-w-[300px]">
                  Ghế: <strong className="text-white">{seats}</strong>
                  <span className="text-white/40 text-xs ml-1">
                    ({seatCount} vé)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Order Meta */}
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 md:gap-1">
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusMeta.badge}`}
            >
              {statusMeta.text}
            </div>
            <span className="text-xs text-white/40 font-mono tracking-wider">
              #{order?.booking_code}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-white/50 uppercase font-bold">
              Tổng thanh toán
            </span>
            <span className="text-xl font-bold text-primary">
              {formatCurrency(order?.total_amount)}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onViewDetail?.(order)}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <MdInfo className="text-lg" />
              Chi tiết
            </button>
            {order?.status === "SUCCESSFUL" && (
              <button
                onClick={() => onShowQr?.(order)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2"
              >
                <MdQrCode className="text-lg" />
                QR Code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
