import React from "react";
import { MdArrowForward, MdPayments } from "react-icons/md";
import { formatCurrency } from "../../../utils/helper";

const PaymentSidebar = ({
  subtotal = 0,
  discount = 0,
  serviceFee = 0,
  total = 0,
  voucherCode = "",
  loading = false,
  onPay,
  onBack,
}) => {
  const disabled = loading || subtotal <= 0;

  return (
    <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 shadow-xl">
      <h3 className="font-bold text-white mb-6 flex items-center gap-2">
        <MdPayments className="text-primary" />
        Tổng kết
      </h3>

      <div className="space-y-4 mb-8 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-white/60">Tạm tính</span>
          <span className="text-white font-medium">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/60">Giảm giá</span>
          <span className="text-white font-medium">
            - {formatCurrency(discount)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-white/60">Phí dịch vụ</span>
          <span className="text-green-400 font-medium">
            {serviceFee ? formatCurrency(serviceFee) : "Miễn phí"}
          </span>
        </div>

        {voucherCode ? (
          <div className="flex justify-between items-center">
            <span className="text-white/60">Mã áp dụng</span>
            <span className="text-primary font-semibold">{voucherCode}</span>
          </div>
        ) : null}

        <div className="w-full h-px bg-white/10 my-2" />

        <div className="flex justify-between items-end">
          <span className="text-white font-bold">Tổng cộng</span>
          <div className="text-right">
            <span className="text-3xl font-black text-primary block">
              {formatCurrency(total)}
            </span>
            <span className="text-[10px] text-white/40 block mt-1">
              (Đã bao gồm VAT)
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={onPay}
          disabled={disabled}
          className="w-full bg-primary hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
        >
          {loading ? "Đang xử lý..." : "Thanh toán ngay"}
          <MdArrowForward className="group-hover:translate-x-1 transition-transform" />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/30 text-white/60 hover:text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default PaymentSidebar;
