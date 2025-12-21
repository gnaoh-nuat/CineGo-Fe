import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import BookingStepper from "../components/User/Booking/BookingStepper";
import SeatMap from "../components/User/Booking/SeatMap";
import ServiceList from "../components/User/Booking/ServiceList";
import BookingSummary from "../components/User/Booking/BookingSummary";
import { formatCurrency } from "../utils/helper";

const SeatSelection = () => {
  const { id: showtimeId } = useParams();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  // --- States ---
  const [loading, setLoading] = useState({
    seats: true,
    foods: true,
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

  // Voucher state
  const [vouchers, setVouchers] = useState([]);
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  // --- Computations ---
  useEffect(() => {
    // Hydrate selections when returning from Payment
    if (state?.selectedSeats?.length) {
      setSelectedSeatIds(
        state.selectedSeats.map((s) => s?.id || s?.seat_id || s).filter(Boolean)
      );
    }
    if (state?.selectedFoodQty) {
      setSelectedFoodQty(state.selectedFoodQty);
    }
    if (state?.appliedVoucher) {
      setAppliedVoucher(state.appliedVoucher);
    }
  }, [state]);

  const seatById = useMemo(
    () => seats.reduce((acc, s) => ({ ...acc, [s.id]: s }), {}),
    [seats]
  );

  const selectedSeats = useMemo(
    () => selectedSeatIds.map((id) => seatById[id]).filter(Boolean),
    [selectedSeatIds, seatById]
  );

  const seatTotal = useMemo(
    () => selectedSeats.reduce((sum, s) => sum + Number(s.price || 0), 0),
    [selectedSeats]
  );

  const foodTotal = useMemo(
    () =>
      Object.entries(selectedFoodQty).reduce((sum, [id, qty]) => {
        const food = foods.find((f) => String(f.id) === String(id));
        return sum + Number(food?.price || 0) * qty;
      }, 0),
    [selectedFoodQty, foods]
  );

  const discount = useMemo(() => {
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
  }, [appliedVoucher, seatTotal, foodTotal]);

  const finalTotal = Math.max(seatTotal + foodTotal - discount, 0);

  // --- API Calls ---
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!showtimeId) return;

    const fetchData = async () => {
      // 1. Get Seats & Showtime Info
      try {
        const res = await fetch(
          `${SummaryApi.getShowtimeSeats.url}/${showtimeId}/seats`,
          { method: SummaryApi.getShowtimeSeats.method }
        );
        const data = await res.json();
        setSeats(data?.data?.seats || []);

        if (data?.data) {
          setShowtimeInfo((prev) => ({
            ...prev,
            movieId: data.data.movie_id || prev.movieId,
            roomName: data.data.room_name || prev.roomName,
            format: data.data.movie_format || prev.format,
            cinemaName: data.data.cinema_name || prev.cinemaName,
            movieTitle: data.data.movie_title || prev.movieTitle,
            posterUrl: data.data.poster_url || prev.posterUrl,
            startTime: data.data.start_time || prev.startTime,
            ageRating: data.data.age_rating || prev.ageRating || "T13",
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading((p) => ({ ...p, seats: false }));
      }

      // 2. Get Foods
      try {
        const res = await fetch(`${SummaryApi.getFoods.url}?page=1&size=20`, {
          method: SummaryApi.getFoods.method,
        });
        const data = await res.json();
        setFoods(data?.data?.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading((p) => ({ ...p, foods: false }));
      }

      // 3. Get Vouchers (Logged in only)
      const token = localStorage.getItem("accessToken");
      if (token) {
        try {
          const res = await fetch(SummaryApi.getMyVouchers.url, {
            method: SummaryApi.getMyVouchers.method,
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          setVouchers(data?.data?.vouchers || []);
        } catch (e) {
          console.error(e);
        }
      }
    };

    fetchData();
  }, [showtimeId]);

  // --- Handlers ---
  const handleToggleSeat = useCallback((seat) => {
    if (!seat || seat.status !== "AVAILABLE") return;
    setSelectedSeatIds((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  }, []);

  const handleChangeFood = useCallback((id, qty) => {
    setSelectedFoodQty((prev) => ({ ...prev, [id]: qty }));
  }, []);

  const handleApplyVoucher = async (code) => {
    if (!code) {
      setAppliedVoucher(null);
      return;
    }

    if (seatTotal + foodTotal <= 0) {
      toast.warn("Vui lòng chọn ghế hoặc dịch vụ trước khi áp dụng mã");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) return toast.info("Vui lòng đăng nhập để sử dụng mã giảm giá");

    setApplyingVoucher(true);
    try {
      const matched = vouchers.find((v) => v.code === code);
      const payload = {
        voucher_code: code,
        voucher_id: matched?.id,
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

      if (data.success) {
        setAppliedVoucher(data.data || matched || { code });
        toast.success("Áp dụng mã thành công!");
      } else {
        setAppliedVoucher(null);
        toast.error(data.message || "Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      toast.error("Lỗi khi kiểm tra mã giảm giá");
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.info("Vui lòng đăng nhập để thanh toán");
    if (selectedSeats.length === 0)
      return toast.warn("Vui lòng chọn ghế trước");

    const bookingState = {
      showtimeInfo: { ...showtimeInfo, id: showtimeId },
      selectedSeats,
      foods,
      selectedFoodQty,
      appliedVoucher,
      discount,
      voucherCode: appliedVoucher?.code,
      backPath: `/seat/${showtimeId}`,
      from: location.pathname,
    };

    navigate(`/payment/${showtimeId}`, { state: bookingState });
  };

  return (
    <div className="w-full min-h-screen bg-background-dark text-white font-display">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 pt-24 pb-12 space-y-8">
        <BookingStepper
          currentStep={2}
          movieId={showtimeInfo?.movieId}
          seatId={showtimeId}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Main Content */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggle={handleToggleSeat}
              loading={loading.seats}
            />

            <div className="bg-surface-dark border border-white/5 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-bold text-white uppercase tracking-wide">
                  Dịch vụ thêm
                </h2>
                <p className="text-sm text-white/50">Chọn combo yêu thích</p>
              </div>
              <ServiceList
                foods={foods}
                quantities={selectedFoodQty}
                loading={loading.foods}
                onChange={handleChangeFood}
              />
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 h-full">
              <BookingSummary
                showtimeInfo={showtimeInfo}
                selectedSeats={selectedSeats}
                foods={foods}
                selectedFoods={selectedFoodQty}
                seatTotal={seatTotal}
                foodTotal={foodTotal}
                discount={discount}
                finalTotal={finalTotal}
                vouchers={vouchers}
                onApplyVoucher={handleApplyVoucher}
                applying={applyingVoucher}
                appliedVoucher={appliedVoucher}
                onCheckout={handleCheckout}
                checkoutLoading={loading.checkout}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
