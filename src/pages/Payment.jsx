import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import BookingStepper from "../components/User/Booking/BookingStepper";
import BookingInfoCard from "../components/User/Booking/BookingInfoCard";
import TransactionDetail from "../components/User/Booking/TransactionDetail";
import PaymentSidebar from "../components/User/Booking/PaymentSidebar";
import SummaryApi from "../common";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id: showtimeIdParam } = useParams();

  const [paying, setPaying] = useState(false);
  const [verifyingReturn, setVerifyingReturn] = useState(false);

  // Lấy dữ liệu từ state hoặc fallback
  const showtimeInfo = state?.showtimeInfo || state?.showtime || {};
  const appliedVoucher = state?.appliedVoucher;
  const selectedSeats = state?.selectedSeats || [];
  const foods = state?.foods || [];
  const selectedFoods = state?.selectedFoodQty || state?.selectedFoods || {};
  const stateDiscount = state?.discount || 0;
  const voucherCode = state?.appliedVoucher?.code || state?.voucherCode || "";
  const backPath = state?.backPath;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Nếu quay lại Payment cùng query VNPAY, chuyển sang PaymentReturn để xử lý
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("vnp_TxnRef")) {
      navigate("/payment/return" + window.location.search, { replace: true });
    }
  }, [navigate]);

  // Tính toán tiền
  const seatTotal = useMemo(
    () =>
      selectedSeats.reduce((sum, seat) => sum + Number(seat?.price || 0), 0),
    [selectedSeats]
  );

  const foodTotal = useMemo(
    () =>
      Object.entries(selectedFoods).reduce((sum, [id, qty]) => {
        const food = foods.find((f) => String(f.id) === String(id));
        return sum + Number(food?.price || 0) * Number(qty);
      }, 0),
    [selectedFoods, foods]
  );

  const voucherDiscount = useMemo(() => {
    if (stateDiscount) return stateDiscount;
    if (!appliedVoucher) return 0;

    const total = seatTotal + foodTotal;

    if (appliedVoucher.discount_amount)
      return Number(appliedVoucher.discount_amount);

    if (appliedVoucher.discount_percent) {
      const amount = (Number(appliedVoucher.discount_percent) / 100) * total;
      if (appliedVoucher.max_discount_amount) {
        return Math.min(amount, Number(appliedVoucher.max_discount_amount));
      }
      return amount;
    }
    return 0;
  }, [appliedVoucher, foodTotal, seatTotal, stateDiscount]);

  const subtotal = seatTotal + foodTotal;
  const finalTotal = Math.max(subtotal - voucherDiscount, 0);

  const goToResult = (status, message, extra = {}) => {
    navigate("/payment/result", {
      replace: true,
      state: {
        status,
        message,
        showtimeId: showtimeIdParam,
        movieId: showtimeInfo?.movieId || showtimeInfo?.movie_id,
        seats: selectedSeats,
        total: finalTotal,
        ...extra,
      },
    });
  };

  // Hàm xác thực VNPAY
  const verifyVnpayReturn = async (txnRef, responseCode) => {
    setVerifyingReturn(true);
    try {
      const res = await fetch(SummaryApi.orderVnpayReturn.url, {
        method: SummaryApi.orderVnpayReturn.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vnp_TxnRef: txnRef,
          vnp_ResponseCode: responseCode,
        }),
      });
      const data = await res.json();

      if (data.success && responseCode === "00") {
        goToResult("success", "Thanh toán thành công", {
          bookingCode: data?.data?.booking_code,
        });
      } else {
        goToResult("failed", data.message || "Thanh toán thất bại", {
          bookingCode: data?.data?.booking_code,
        });
      }
    } catch (error) {
      goToResult("failed", "Không thể xác thực thanh toán");
    } finally {
      setVerifyingReturn(false);
    }
  };

  // Chuẩn bị payload food
  const buildFoodPayload = () =>
    Object.entries(selectedFoods || {})
      .filter(([, qty]) => qty > 0)
      .map(([id, quantity]) => ({
        id: Number(id),
        quantity: Number(quantity),
      }));

  // Xử lý thanh toán (Tạo đơn hàng)
  const handlePay = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.info("Vui lòng đăng nhập để thanh toán");
      return navigate("/login", {
        state: { redirect: location.pathname + location.search },
        replace: true,
      });
    }

    if (!selectedSeats.length) {
      toast.warn("Vui lòng chọn ghế trước");
      if (showtimeIdParam) return navigate(`/seat/${showtimeIdParam}`);
      if (showtimeInfo?.movieId)
        return navigate(`/booking/${showtimeInfo.movieId}`);
      return navigate(-1);
    }

    const showtimeId =
      showtimeInfo?.id || showtimeInfo?.showtime_id || showtimeIdParam;
    if (!showtimeId) {
      toast.error("Thiếu thông tin suất chiếu");
      return;
    }

    setPaying(true);
    try {
      const payload = {
        showtime_id: Number(showtimeId),
        seats: selectedSeats.map((seat) => seat.id || seat.seat_id || seat),
        foods: buildFoodPayload(),
        voucher_code: voucherCode || undefined,
      };

      const res = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        if (data.data?.payment_url) {
          window.location.href = data.data.payment_url;
        } else if (data.data?.order_id) {
          goToResult("success", "Đặt vé thành công", {
            bookingCode: data.data?.booking_code,
            orderId: data.data?.order_id,
          });
        }
      } else {
        goToResult("failed", data.message || "Thanh toán thất bại");
      }
    } catch (error) {
      goToResult("failed", "Không thể tạo đơn");
    } finally {
      setPaying(false);
    }
  };

  const handleBack = () => {
    const bookingState = {
      ...state,
      showtimeInfo: { ...showtimeInfo, id: showtimeIdParam },
      voucherCode,
      discount: voucherDiscount,
      selectedFoodQty: selectedFoods,
      selectedSeats,
      backPath: backPath || `/seat/${showtimeIdParam}`,
    };

    if (backPath) return navigate(backPath, { state: bookingState });
    if (showtimeIdParam)
      return navigate(`/seat/${showtimeIdParam}`, { state: bookingState });
    if (showtimeInfo?.movieId)
      return navigate(`/booking/${showtimeInfo.movieId}`, {
        state: bookingState,
      });
    return navigate(-1);
  };

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 pb-12 space-y-8">
        <BookingStepper
          currentStep={3}
          movieId={showtimeInfo?.movieId || showtimeInfo?.movie_id}
          seatId={showtimeIdParam}
          seatState={{
            ...state,
            showtimeInfo: { ...showtimeInfo, id: showtimeIdParam },
            voucherCode,
            discount: voucherDiscount,
            selectedFoodQty: selectedFoods,
            selectedSeats,
            backPath: backPath || `/seat/${showtimeIdParam}`,
          }}
        />

        {verifyingReturn && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-100 text-sm px-4 py-3 rounded-xl animate-pulse">
            Đang xác thực giao dịch VNPAY, vui lòng chờ...
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <BookingInfoCard showtime={showtimeInfo} seats={selectedSeats} />
            <TransactionDetail
              seats={selectedSeats}
              foods={foods}
              selectedFoods={selectedFoods}
              seatTotal={seatTotal}
              foodTotal={foodTotal}
            />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-24 h-fit">
            <PaymentSidebar
              subtotal={subtotal}
              discount={voucherDiscount}
              serviceFee={0}
              total={finalTotal}
              voucherCode={voucherCode}
              loading={paying || verifyingReturn}
              onPay={handlePay}
              onBack={handleBack}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
