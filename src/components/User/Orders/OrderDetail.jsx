import React from "react";
import {
  MdClose,
  MdReceipt,
  MdFastfood,
  MdMovie,
  MdPerson,
} from "react-icons/md";
import {
  formatCurrency,
  formatDateTime,
  getPrimaryPoster,
  mapOrderStatus,
} from "../../../utils/helper";

const OrderDetail = ({ bookingCode, loading, data, onClose }) => {
  const statusMeta = mapOrderStatus(data?.status);
  const ticket = data?.Tickets?.[0];
  const movie = ticket?.Showtime?.Movie;
  const showtime = ticket?.Showtime;

  if (!loading && !data) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl relative max-h-[90vh] overflow-hidden flex flex-col animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg text-primary">
              <MdReceipt className="text-xl" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Chi tiết đơn hàng
              </h3>
              <p className="text-xs text-white/50 font-mono">#{bookingCode}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white/50 text-sm">Đang tải thông tin...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Status Banner */}
              <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex flex-col">
                  <span className="text-xs text-white/50 mb-1">
                    Trạng thái đơn hàng
                  </span>
                  <span
                    className={`text-sm font-bold px-3 py-1 rounded-full w-fit ${statusMeta.badge}`}
                  >
                    {statusMeta.text}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/50 mb-1">Ngày đặt</p>
                  <p className="text-sm font-medium text-white">
                    {formatDateTime(data?.createdAt)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Movie Info */}
                <div className="md:col-span-2 space-y-6">
                  {/* Movie Section */}
                  <div>
                    <h4 className="flex items-center gap-2 text-white font-bold mb-4">
                      <MdMovie className="text-primary" /> Thông tin vé
                    </h4>
                    <div className="flex gap-4 bg-background-dark p-4 rounded-xl border border-white/5">
                      <img
                        src={getPrimaryPoster(movie?.poster_urls)}
                        alt="Poster"
                        className="w-24 h-36 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1 space-y-2">
                        <h5 className="text-lg font-bold text-white line-clamp-2">
                          {movie?.title}
                        </h5>
                        <div className="text-sm text-white/70 space-y-1">
                          <p>
                            <span className="text-white/40">Rạp:</span>{" "}
                            {showtime?.CinemaRoom?.Cinema?.name}
                          </p>
                          <p>
                            <span className="text-white/40">Phòng:</span>{" "}
                            {showtime?.CinemaRoom?.name}
                          </p>
                          <p>
                            <span className="text-white/40">Suất chiếu:</span>{" "}
                            {formatDateTime(showtime?.start_time)}
                          </p>
                          <p>
                            <span className="text-white/40">Định dạng:</span>{" "}
                            {showtime?.movie_format}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Seat List */}
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      {(data?.Tickets || []).map((t, idx) => (
                        <div
                          key={t.id}
                          className="flex justify-between items-center text-sm p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                          <span className="font-medium text-white">
                            Ghế {t.Seat?.row}
                            {t.Seat?.number}{" "}
                            <span className="text-xs text-white/40 font-normal">
                              ({t.Seat?.type})
                            </span>
                          </span>
                          <span className="text-white font-bold">
                            {formatCurrency(t.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Food Section */}
                  {(data?.OrderFoods || []).length > 0 && (
                    <div>
                      <h4 className="flex items-center gap-2 text-white font-bold mb-4 border-t border-white/10 pt-6">
                        <MdFastfood className="text-primary" /> Bắp & Nước
                      </h4>
                      <div className="space-y-3">
                        {data.OrderFoods.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                          >
                            <div className="flex items-center gap-3">
                              {/* Food Image */}
                              <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                                <img
                                  src={
                                    f.Food?.image_url ||
                                    "https://placehold.co/100x100?text=Food"
                                  }
                                  alt={f.Food?.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-white">
                                  {f.Food?.name}
                                </p>
                                <p className="text-xs text-white/50">
                                  Số lượng: x{f.quantity}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm font-bold text-white">
                              {formatCurrency(
                                Number(f.price_at_purchase) * Number(f.quantity)
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Customer & Payment */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <h4 className="flex items-center gap-2 text-white font-bold mb-3 text-sm">
                      <MdPerson className="text-primary" /> Khách hàng
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex flex-col">
                        <span className="text-white/40 text-xs">Họ tên</span>
                        <span className="text-white font-medium">
                          {data?.User?.full_name}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/40 text-xs">Email</span>
                        <span
                          className="text-white font-medium truncate"
                          title={data?.User?.email}
                        >
                          {data?.User?.email}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/40 text-xs">
                          Số điện thoại
                        </span>
                        <span className="text-white font-medium">
                          {data?.User?.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Summary */}
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <h4 className="text-white font-bold mb-3 text-sm">
                      Thanh toán
                    </h4>
                    <div className="space-y-2 text-sm border-b border-white/10 pb-3 mb-3">
                      <div className="flex justify-between">
                        <span className="text-white/60">Tổng vé</span>
                        <span className="text-white">
                          {formatCurrency(data?.ticket_total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Tổng đồ ăn</span>
                        <span className="text-white">
                          {formatCurrency(data?.food_total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/60">Giảm giá</span>
                        <span className="text-green-400">
                          -{formatCurrency(data?.discount_applied)}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="text-white/80 font-bold">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">
                        {formatCurrency(data?.total_amount)}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-center text-white/40 bg-white/5 py-1 rounded">
                      PTTT: {data?.payment_method || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
