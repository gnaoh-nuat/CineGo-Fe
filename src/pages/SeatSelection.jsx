import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import BookingStepper from "../components/User/Booking/BookingStepper";
import SeatMap from "../components/User/Booking/SeatMap";
import ServiceList from "../components/User/Booking/ServiceList";
import BookingSummary from "../components/User/Booking/BookingSummary";
import { formatCurrency } from "../utils/helper";

const SeatSelection = () => {
  const { id: showtimeId } = useParams();
  const { state } = useLocation();

  const [loading, setLoading] = useState({
    seats: false,
    foods: false,
    vouchers: false,
    checkout: false,
  });

  const [seats, setSeats] = useState([]);
  const [showtimeInfo, setShowtimeInfo] = useState(
    () => state?.showtime || state?.showtimeInfo || {}
  );

  const [foods, setFoods] = useState([]);
  const [selectedFoodQty, setSelectedFoodQty] = useState({});

  const [selectedSeatIds, setSelectedSeatIds] = useState([]);

  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [applyingVoucher, setApplyingVoucher] = useState(false);
  const [vouchers, setVouchers] = useState([]);

  // Map seat id to seat object for quick lookup
  const seatById = useMemo(() => {
    return seats.reduce((acc, seat) => {
      acc[seat.id] = seat;
      return acc;
    }, {});
  }, [seats]);

  const selectedSeats = useMemo(
    () => selectedSeatIds.map((id) => seatById[id]).filter(Boolean),
    [selectedSeatIds, seatById]
  );

  const seatTotal = useMemo(
    () => selectedSeats.reduce((sum, seat) => sum + Number(seat.price || 0), 0),
    [selectedSeats]
  );

  const foodTotal = useMemo(() => {
    return Object.entries(selectedFoodQty).reduce((sum, [id, qty]) => {
      if (qty <= 0) return sum;
      const food = foods.find((f) => `${f.id}` === `${id}`);
      const price = Number(food?.price || 0);
      return sum + price * qty;
    }, 0);
  }, [selectedFoodQty, foods]);

  const discount = useMemo(() => {
    if (!appliedVoucher) return 0;
    const totalBefore = seatTotal + foodTotal;
    if (appliedVoucher.discount_amount != null)
      return Number(appliedVoucher.discount_amount);
    if (appliedVoucher.discount_percent != null) {
      return (Number(appliedVoucher.discount_percent) / 100) * totalBefore;
    }
    return 0;
  }, [appliedVoucher, seatTotal, foodTotal]);

  const finalTotal = Math.max(seatTotal + foodTotal - discount, 0);

  const fetchSeats = useCallback(async () => {
    if (!showtimeId) return;
    try {
      setLoading((p) => ({ ...p, seats: true }));
      const res = await fetch(
        `${SummaryApi.getShowtimeSeats.url}/${showtimeId}/seats`,
        {
          method: SummaryApi.getShowtimeSeats.method,
        }
      );
      const data = await res.json();
      const seatList = data?.data?.seats || [];
      setSeats(seatList);
      setShowtimeInfo((prev) => ({
        ...prev,
        roomName: data?.data?.room_name || prev?.roomName,
        format: data?.data?.movie_format || prev?.format,
        showtimeId: data?.data?.showtime_id || showtimeId,
      }));
    } catch (error) {
      console.error("Lỗi tải sơ đồ ghế:", error);
      toast.error("Không tải được sơ đồ ghế");
    } finally {
      setLoading((p) => ({ ...p, seats: false }));
    }
  }, [showtimeId]);

  const fetchFoods = useCallback(async () => {
    try {
      setLoading((p) => ({ ...p, foods: true }));
      const url = `${SummaryApi.getFoods.url}?page=1&size=8`;
      const res = await fetch(url, { method: SummaryApi.getFoods.method });
      const data = await res.json();
      const items = data?.data?.items || data?.data || [];
      setFoods(items);
    } catch (error) {
      console.error("Lỗi tải dịch vụ:", error);
      toast.error("Không tải được dịch vụ");
    } finally {
      setLoading((p) => ({ ...p, foods: false }));
    }
  }, []);

  const fetchVouchers = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setAppliedVoucher(null);
      setVouchers([]);
      return; // Không gọi nếu chưa đăng nhập để tránh 401
    }

    try {
      setLoading((p) => ({ ...p, vouchers: true }));
      const res = await fetch(SummaryApi.getMyVouchers.url, {
        method: SummaryApi.getMyVouchers.method,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      const vouchers =
        data?.data?.vouchers || data?.data?.items || data?.data || [];
      setAppliedVoucher(null); // reset, user sẽ chọn mã thủ công
      setVouchers(Array.isArray(vouchers) ? vouchers : []);
      if (res.ok && (!vouchers || vouchers.length === 0)) {
        toast.info("Không tìm thấy mã giảm giá khả dụng");
      }
      if (!res.ok) {
        toast.error(data?.message || "Không tải được mã giảm giá");
      }
    } catch (error) {
      console.error("Lỗi tải voucher:", error);
      setVouchers([]);
      toast.error("Không tải được mã giảm giá");
    } finally {
      setLoading((p) => ({ ...p, vouchers: false }));
    }
  }, []);

  useEffect(() => {
    fetchSeats();
    fetchFoods();
    fetchVouchers();
    window.scrollTo(0, 0);
  }, [fetchSeats, fetchFoods, fetchVouchers]);

  // Cập nhật thông tin phim/ảnh từ state điều hướng
  useEffect(() => {
    if (state?.movie || state?.showtime) {
      setShowtimeInfo((prev) => ({
        ...prev,
        movieTitle: state?.movie?.title || prev.movieTitle,
        posterUrl: state?.movie?.poster_urls?.[0] || prev.posterUrl,
        ageRating: state?.movie?.age_rating || prev.ageRating,
        cinemaName: state?.showtime?.cinemaName || prev.cinemaName,
        roomName: state?.showtime?.roomName || prev.roomName,
        format: state?.showtime?.format || prev.format,
        startTime: state?.showtime?.startTime || prev.startTime,
      }));
    }
  }, [state]);

  const toggleSeat = (seat) => {
    if (!seat || seat.status !== "AVAILABLE") return;
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) {
        return prev.filter((id) => id !== seat.id);
      }
      return [...prev, seat.id];
    });
  };

  const handleChangeFood = (id, qty) => {
    setSelectedFoodQty((prev) => ({ ...prev, [id]: qty }));
  };

  const handleApplyVoucher = async (code) => {
    if (!code) {
      setAppliedVoucher(null);
      return;
    }
    if (seatTotal + foodTotal <= 0) {
      toast.warn("Vui lòng chọn ghế hoặc dịch vụ trước khi áp dụng voucher");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để áp dụng voucher");
      return;
    }
    try {
      setApplyingVoucher(true);
      const matchedVoucher = vouchers.find((v) => v.code === code);
      const payload = {
        voucher_code: code,
        voucher_id: matchedVoucher?.id,
        totalAmount: seatTotal + foodTotal,
      };
      const res = await fetch(SummaryApi.applyVoucher.url, {
        method: SummaryApi.applyVoucher.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data?.success) {
        setAppliedVoucher(data.data || matchedVoucher || { code });
        toast.success("Áp dụng voucher thành công");
      } else {
        setAppliedVoucher(null);
        toast.error(data?.message || "Voucher không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi áp dụng voucher:", error);
      toast.error("Không áp dụng được voucher");
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      toast.warn("Vui lòng chọn ghế trước");
      return;
    }
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để thanh toán");
      return;
    }
    try {
      setLoading((p) => ({ ...p, checkout: true }));
      const foodsPayload = Object.entries(selectedFoodQty)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => ({ id, quantity: qty }));

      const payload = {
        showtime_id: showtimeId,
        seats: selectedSeats.map((s) => s.id),
        foods: foodsPayload,
        voucher_code: appliedVoucher?.code,
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
      if (data?.success) {
        toast.success("Đặt vé thành công");
        const paymentUrl = data?.data?.payment_url;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        }
      } else {
        toast.error(data?.message || "Đặt vé thất bại");
      }
    } catch (error) {
      console.error("Lỗi đặt vé:", error);
      toast.error("Không đặt được vé");
    } finally {
      setLoading((p) => ({ ...p, checkout: false }));
    }
  };

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display">
      <div className="max-w-[1440px] mx-auto px-6 pt-24 pb-12 space-y-8">
        <BookingStepper currentStep={2} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggle={toggleSeat}
            />

            <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Dịch vụ thêm</h2>
                <p className="text-sm text-white/50">
                  Chọn bắp, nước và combo yêu thích
                </p>
              </div>
              <ServiceList
                foods={foods}
                quantities={selectedFoodQty}
                loading={loading.foods}
                onChange={handleChangeFood}
              />
            </div>
          </div>

          <div className="lg:col-span-4">
            <BookingSummary
              showtimeInfo={showtimeInfo}
              selectedSeats={selectedSeats}
              foods={foods}
              selectedFoods={selectedFoodQty}
              seatTotal={seatTotal}
              foodTotal={foodTotal}
              discount={discount}
              finalTotal={finalTotal}
              onApplyVoucher={handleApplyVoucher}
              applying={applyingVoucher}
              vouchers={vouchers}
              onRefreshVouchers={fetchVouchers}
              onCheckout={handleCheckout}
              checkoutLoading={loading.checkout}
            />
          </div>
        </div>

        <div className="text-white/40 text-xs">
          Giá vé hiển thị là {formatCurrency(0)} khi chưa chọn ghế. Vui lòng
          chọn ghế để xem tổng tiền chính xác.
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
