import React, { useState, useEffect } from "react";
import { formatCurrency, formatTimeHM, seatLabel } from "../../../utils/helper";
import {
  MdLocalOffer,
  MdChair,
  MdFastfood,
  MdCheckCircle,
  MdCancel,
  MdMovie,
} from "react-icons/md";

const BookingSummary = ({
  showtimeInfo = {},
  selectedSeats = [],
  foods = [],
  selectedFoods = {},
  seatTotal = 0,
  foodTotal = 0,
  discount = 0,
  finalTotal = 0,
  onApplyVoucher,
  applying = false,
  appliedVoucher,
  vouchers = [],
  onRefreshVouchers,
  onCheckout,
  checkoutLoading = false,
}) => {
  const [voucherCode, setVoucherCode] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sync voucher code khi apply thành công
  useEffect(() => {
    if (appliedVoucher) {
      setVoucherCode(appliedVoucher.code);
    }
  }, [appliedVoucher]);

  const handleSelectVoucher = (e) => {
    const code = e.target.value;
    setVoucherCode(code);
    if (code) onApplyVoucher?.(code);
  };

  const toggleDropdown = () => {
    if (!dropdownOpen && onRefreshVouchers) onRefreshVouchers();
    setDropdownOpen((prev) => !prev);
  };

  const handlePickVoucher = (code) => {
    setVoucherCode(code);
    setDropdownOpen(false);
    if (code) onApplyVoucher?.(code);
  };

  const renderFoodItem = (foodId) => {
    const food = foods.find((f) => String(f.id) === String(foodId));
    const qty = selectedFoods[foodId] || 0;
    if (!food || qty <= 0) return null;

    return (
      <div
        key={foodId}
        className="flex justify-between items-center text-sm group"
      >
        <span className="text-white/70 group-hover:text-white transition-colors truncate max-w-[60%]">
          {qty}x {food.name}
        </span>
        <span className="font-semibold text-white">
          {formatCurrency(Number(food.price) * qty)}
        </span>
      </div>
    );
  };

  return (
    <aside className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full max-h-[calc(100vh-100px)] sticky top-24">
      {/* 1. Header Info */}
      <div className="p-5 border-b border-white/10 bg-white/[0.02] flex gap-4 shrink-0">
        <div className="w-20 h-28 rounded-lg overflow-hidden border border-white/10 shadow-lg shrink-0 bg-black">
          <img
            src={
              showtimeInfo.posterUrl ||
              "https://placehold.co/150x220?text=No+Image"
            }
            alt="poster"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2">
            {showtimeInfo.movieTitle || "Đang chọn phim..."}
          </h3>
          <div className="flex flex-wrap gap-2 text-[10px] uppercase font-bold text-white/60 mb-2">
            <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/5">
              {showtimeInfo.format || "2D"}
            </span>
            <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded border border-primary/20">
              {showtimeInfo.ageRating || "T18"}
            </span>
          </div>
          <p className="text-white/90 text-sm font-medium truncate">
            {showtimeInfo.cinemaName}
          </p>
          <p className="text-white/50 text-xs mt-0.5 truncate">
            {showtimeInfo.roomName} •{" "}
            {showtimeInfo.startTime
              ? formatTimeHM(showtimeInfo.startTime)
              : "--:--"}
          </p>
        </div>
      </div>

      {/* 2. Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-background-dark/30">
        {/* Seats */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h4 className="text-primary font-bold text-sm flex items-center gap-2">
              <MdChair /> Ghế đã chọn
            </h4>
            <span className="font-bold text-white text-sm">
              {formatCurrency(seatTotal)}
            </span>
          </div>

          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <span
                  key={seat.id}
                  className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-xs font-bold"
                >
                  {seatLabel(seat)}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-xs italic">
              Vui lòng chọn ghế trên bản đồ.
            </p>
          )}
        </div>

        {/* Foods */}
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <h4 className="text-orange-400 font-bold text-sm flex items-center gap-2">
              <MdFastfood /> Bắp nước
            </h4>
            <span className="font-bold text-white text-sm">
              {formatCurrency(foodTotal)}
            </span>
          </div>

          {Object.values(selectedFoods).some((q) => q > 0) ? (
            <div className="space-y-2">
              {Object.keys(selectedFoods).map(renderFoodItem)}
            </div>
          ) : (
            <p className="text-white/30 text-xs italic">
              Chưa chọn dịch vụ nào.
            </p>
          )}
        </div>

        {/* Voucher */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-sm flex items-center gap-2 border-b border-white/5 pb-2">
            <MdLocalOffer className="text-gray-400" /> Ưu đãi
          </h4>

          <div className="space-y-2">
            <div
              className="relative"
              tabIndex={0}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 80)}
            >
              <button
                type="button"
                onClick={toggleDropdown}
                disabled={!!appliedVoucher}
                className={`w-full flex items-center justify-between bg-surface-dark border border-white/10 text-white text-xs rounded-lg px-3 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50 ${
                  dropdownOpen ? "ring-1 ring-primary border-primary/60" : ""
                }`}
              >
                <span className="truncate text-left">
                  {voucherCode || "Chọn mã giảm giá..."}
                </span>
                <span className="text-white/40 text-[10px]">▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute z-20 mt-2 w-full max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-surface-dark shadow-xl shadow-black/50 custom-scrollbar">
                  {vouchers.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-white/50">
                      Không có mã khả dụng.
                    </div>
                  ) : (
                    vouchers.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handlePickVoucher(v.code);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-white hover:bg-primary/15 border-b border-white/5 last:border-b-0"
                      >
                        <span className="font-semibold">{v.code}</span>
                        <span className="ml-2 text-white/60">
                          {v.description || "Giảm giá vé"}
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Nhập mã..."
                disabled={!!appliedVoucher}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 outline-none uppercase placeholder:normal-case transition-all disabled:opacity-50"
              />
              {appliedVoucher ? (
                <button
                  onClick={() => {
                    onApplyVoucher(null);
                    setVoucherCode("");
                  }}
                  className="px-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center"
                >
                  <MdCancel className="text-lg" />
                </button>
              ) : (
                <button
                  disabled={applying || !voucherCode}
                  onClick={() => onApplyVoucher(voucherCode)}
                  className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 uppercase"
                >
                  {applying ? "..." : "Áp dụng"}
                </button>
              )}
            </div>

            {(!vouchers || vouchers.length === 0) && (
              <p className="text-[11px] text-white/40">
                Không có mã khả dụng. Hãy đăng nhập và bấm vào hộp chọn để tải
                lại.
              </p>
            )}

            {appliedVoucher && (
              <div className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg flex justify-between items-center animate-fade-in-up">
                <span className="text-green-400 text-xs flex items-center gap-1.5">
                  <MdCheckCircle /> {appliedVoucher.code}
                </span>
                <span className="text-green-400 font-bold text-sm">
                  -{formatCurrency(discount)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Footer Total */}
      <div className="p-5 bg-surface-dark border-t border-white/10 space-y-4 shrink-0 z-10 relative">
        <div className="flex justify-between items-end">
          <span className="text-white/60 text-sm font-medium">
            Tổng thanh toán
          </span>
          <span className="text-2xl font-black text-primary tracking-tight">
            {formatCurrency(finalTotal)}
          </span>
        </div>

        <button
          onClick={onCheckout}
          disabled={checkoutLoading || selectedSeats.length === 0}
          className="w-full py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          {checkoutLoading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          Thanh toán ngay
        </button>
      </div>
    </aside>
  );
};

export default BookingSummary;
