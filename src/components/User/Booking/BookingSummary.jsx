import React, { useState, useEffect, useRef } from "react";
import { formatCurrency, formatTimeHM, seatLabel } from "../../../utils/helper";
import {
  MdLocalOffer,
  MdChair,
  MdFastfood,
  MdCheckCircle,
  MdCancel,
  MdMovie,
  MdKeyboardArrowDown,
  MdLunchDining,
  MdChevronRight,
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
  // State quản lý đóng mở dropdown
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sync voucher code khi apply thành công
  useEffect(() => {
    if (appliedVoucher) {
      setVoucherCode(appliedVoucher.code);
    }
  }, [appliedVoucher]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectVoucher = (code) => {
    setVoucherCode(code || "");
    setIsOpen(false);
    onApplyVoucher?.(code || null);
  };

  const renderFoodItem = (foodId) => {
    const food = foods.find((f) => String(f.id) === String(foodId));
    const qty = selectedFoods[foodId] || 0;
    if (!food || qty <= 0) return null;

    return (
      <div
        key={foodId}
        className="flex justify-between items-center text-sm py-1"
      >
        <span className="text-white/70 truncate max-w-[60%]">
          {qty}x {food.name}
        </span>
        <span className="font-semibold text-white">
          {formatCurrency(Number(food.price) * qty)}
        </span>
      </div>
    );
  };

  return (
    <aside className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col h-full max-h-[calc(100vh-100px)] sticky top-24 overflow-hidden">
      {/* 1. Header Info (Phim, Rạp) */}
      <div className="p-6 border-b border-white/10 bg-white/[0.02]">
        <div className="flex gap-4 items-start mb-5">
          <div className="w-20 rounded-lg overflow-hidden shadow-lg border border-white/10 shrink-0 bg-white/5 aspect-[2/3]">
            <img
              src={
                showtimeInfo.posterUrl ||
                "https://placehold.co/150x220?text=No+Image"
              }
              alt="poster"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white text-lg leading-tight mb-1 line-clamp-2">
              {showtimeInfo.movieTitle || "Phim chưa cập nhật"}
            </h3>
            <p className="text-white/60 text-sm mb-2">
              {showtimeInfo.format || "2D"} • {showtimeInfo.ageRating || "T13"}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Rạp</span>
            <span className="text-white font-medium text-right truncate ml-4">
              {showtimeInfo.cinemaName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Suất chiếu</span>
            <span className="text-white font-medium text-right">
              {showtimeInfo.startTime
                ? formatTimeHM(showtimeInfo.startTime)
                : "--:--"}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Phòng chiếu</span>
            <span className="text-white font-medium text-right">
              {showtimeInfo.roomName}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/40">Ghế</span>
            <div className="flex flex-wrap justify-end gap-1 max-w-[50%]">
              {selectedSeats.length > 0 ? (
                selectedSeats.map((s) => (
                  <span key={s.id} className="text-primary font-bold">
                    {seatLabel(s)},
                  </span>
                ))
              ) : (
                <span className="text-white/30 italic">Chưa chọn</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Body (Đồ ăn + Voucher) */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-background-dark/20">
        {/* Food Section */}
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <MdLunchDining className="text-base text-primary" /> Đồ ăn
          </h4>
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

        {/* Divider */}
        <div className="border-t border-white/10 border-dashed" />

        {/* Voucher Section - CUSTOM DROPDOWN */}
        <div>
          <h4 className="font-bold text-white text-sm uppercase tracking-wide mb-4 flex items-center gap-2">
            <MdLocalOffer className="text-base text-primary" /> Mã giảm giá
          </h4>

          <div className="space-y-3">
            {/* Custom Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => {
                  if (!appliedVoucher) {
                    setIsOpen(!isOpen);
                    if (!isOpen && onRefreshVouchers) onRefreshVouchers();
                  }
                }}
                disabled={!!appliedVoucher}
                className={`w-full bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-3 flex items-center justify-between transition-all ${
                  !appliedVoucher
                    ? "hover:bg-white/10 cursor-pointer"
                    : "opacity-50 cursor-not-allowed"
                } ${isOpen ? "ring-1 ring-primary border-primary" : ""}`}
              >
                <span className={voucherCode ? "text-white" : "text-white/40"}>
                  {voucherCode || "Chọn mã giảm giá..."}
                </span>
                <MdKeyboardArrowDown
                  className={`text-lg text-white/40 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu List */}
              {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up ring-1 ring-white/5 max-h-60 overflow-y-auto custom-scrollbar">
                  <button
                    type="button"
                    onMouseDown={() => handleSelectVoucher(null)}
                    className="w-full text-left px-4 py-3 text-xs text-white hover:bg-white/10 border-b border-white/5"
                  >
                    Không dùng mã giảm giá
                  </button>
                  {vouchers.length === 0 ? (
                    <div className="p-4 text-center text-white/30 text-xs">
                      Không có mã giảm giá nào khả dụng.
                    </div>
                  ) : (
                    vouchers.map((v) => (
                      <div
                        key={v.id}
                        onMouseDown={() => handleSelectVoucher(v.code)}
                        className="px-4 py-3 border-b border-white/5 hover:bg-white/10 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-primary text-sm group-hover:text-white transition-colors">
                            {v.code}
                          </span>
                          <span className="text-[11px] text-white/60">
                            {v.discount_percent
                              ? `${v.discount_percent}%`
                              : v.discount_amount
                              ? `-${formatCurrency(v.discount_amount)}`
                              : ""}
                          </span>
                        </div>
                        <p className="text-white/60 text-xs line-clamp-1">
                          {v.description || "Giảm giá vé xem phim"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Input Manual & Action Button */}
            <div className="flex gap-2">
              <input
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                placeholder="Hoặc nhập mã..."
                disabled={!!appliedVoucher}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary focus:ring-1 outline-none uppercase placeholder:normal-case transition-all disabled:opacity-50"
              />
              {appliedVoucher ? (
                <button
                  onClick={() => {
                    onApplyVoucher(null);
                    setVoucherCode("");
                  }}
                  className="px-3 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1"
                >
                  <MdCancel /> Hủy
                </button>
              ) : (
                <button
                  disabled={applying || !voucherCode}
                  onClick={() => onApplyVoucher(voucherCode)}
                  className="px-4 bg-white/10 text-white hover:bg-white/20 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 uppercase min-w-[80px]"
                >
                  {applying ? "..." : "Áp dụng"}
                </button>
              )}
            </div>

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

      {/* 3. Footer Total & Button (Sticky) */}
      <div className="p-6 bg-surface-dark border-t border-white/10 space-y-3 z-10 relative">
        <div className="space-y-2 mb-2">
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Tổng tiền ghế</span>
            <span className="text-white font-medium">
              {formatCurrency(seatTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Combo</span>
            <span className="text-white font-medium">
              {formatCurrency(foodTotal)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/50">Giảm giá</span>
            <span className="text-green-500 font-medium">
              -{formatCurrency(discount)}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-2 border-t border-white/10">
          <span className="text-white font-bold">Tổng thanh toán</span>
          <span className="text-2xl font-bold text-primary">
            {formatCurrency(finalTotal)}
          </span>
        </div>

        <button
          onClick={onCheckout}
          disabled={checkoutLoading || selectedSeats.length === 0}
          className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 flex items-center justify-center gap-2 group"
        >
          {checkoutLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Tiếp tục
              <MdChevronRight className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
};

export default BookingSummary;
