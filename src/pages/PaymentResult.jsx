import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MdCheckCircle, MdError, MdHome, MdReceiptLong } from "react-icons/md";
import { formatCurrency } from "../utils/helper";

const PaymentResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const status = state?.status === "success" ? "success" : "failed";
  const message =
    state?.message ||
    (status === "success" ? "Giao dịch thành công" : "Giao dịch thất bại");
  const bookingCode = state?.bookingCode;
  const total = state?.total;

  const icon =
    status === "success" ? (
      <MdCheckCircle className="text-5xl text-green-400" />
    ) : (
      <MdError className="text-5xl text-red-500" />
    );

  const title =
    status === "success" ? "Thanh toán thành công" : "Thanh toán thất bại";
  const hint =
    status === "success"
      ? "Bạn có thể kiểm tra vé trong mục 'Vé của tôi'"
      : "Vui lòng thử lại hoặc chọn phương thức khác.";

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display">
      <div className="max-w-xl mx-auto px-4 md:px-6 pt-24 pb-12 space-y-6 text-center">
        <div className="flex flex-col items-center gap-3">
          {icon}
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-white/60 text-sm">{message}</p>
        </div>

        <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
          {bookingCode ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Mã đặt chỗ</span>
              <span className="text-white font-semibold">{bookingCode}</span>
            </div>
          ) : null}
          {typeof total === "number" ? (
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/60">Tổng thanh toán</span>
              <span className="text-white font-semibold">
                {formatCurrency(total)}
              </span>
            </div>
          ) : null}
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">Trạng thái</span>
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                status === "success"
                  ? "bg-green-500/10 text-green-400 border-green-500/30"
                  : "bg-red-500/10 text-red-400 border-red-500/30"
              }`}
            >
              {status === "success" ? "Thành công" : "Thất bại"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/my-tickets")}
            className="w-full bg-primary hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MdReceiptLong />
            Xem vé của tôi
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/30 text-white/80 font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MdHome />
            Về trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;
