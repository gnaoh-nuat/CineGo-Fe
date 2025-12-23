import React, { useEffect, useMemo, useState } from "react";
import SummaryApi from "../../common";
import {
  authenticatedFetch,
  formatTimeHM,
  formatDateTime,
} from "../../utils/helper";
import CheckInSearch from "../../components/admin/CheckIn/CheckInSearch";
import QRScanner from "../../components/admin/CheckIn/QRScanner";
import TicketResult from "../../components/admin/CheckIn/TicketResult";
import CheckInHistory from "../../components/admin/CheckIn/CheckInHistory";
import { toast } from "react-toastify";

const MAX_HISTORY = 6;

const CheckInPage = () => {
  const [bookingCode, setBookingCode] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [history, setHistory] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("checkin_history");
      if (stored) setHistory(JSON.parse(stored));
    } catch (_) {
      /* ignore */
    }
  }, []);

  const persistHistory = (next) => {
    setHistory(next);
    try {
      localStorage.setItem("checkin_history", JSON.stringify(next));
    } catch (_) {
      /* ignore */
    }
  };

  const pushHistory = (entry) => {
    const next = [entry, ...history].slice(0, MAX_HISTORY);
    persistHistory(next);
  };

  const handleUnauthorized = () => {
    toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
    localStorage.removeItem("accessToken");
    setOrder(null);
    setTimeout(() => {
      window.location.href = "/login";
    }, 300);
  };

  const fetchOrder = async (code) => {
    if (!code) {
      toast.info("Nhập mã đặt vé để tìm");
      return;
    }
    setLoading(true);
    setOrder(null);
    try {
      const res = await authenticatedFetch(
        `${SummaryApi.getOrderByBookingCode.url}?booking_code=${code}`
      );
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      if (data?.success && data.data) {
        setOrder(data.data);
        pushHistory({
          booking_code: code,
          time: new Date().toISOString(),
          success: true,
        });
      } else {
        toast.error(data?.message || "Không tìm thấy đơn hàng");
        pushHistory({
          booking_code: code,
          time: new Date().toISOString(),
          success: false,
        });
      }
    } catch (err) {
      console.error("Fetch order error", err);
      toast.error("Lỗi tải đơn hàng");
      pushHistory({
        booking_code: code,
        time: new Date().toISOString(),
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => fetchOrder(bookingCode.trim());

  const handleCheckIn = async () => {
    if (!order?.booking_code) return;
    setCheckingIn(true);
    try {
      const res = await authenticatedFetch(SummaryApi.checkInTicket.url, {
        method: SummaryApi.checkInTicket.method,
        body: JSON.stringify({ booking_code: order.booking_code }),
      });
      if (res.status === 401) {
        handleUnauthorized();
        return;
      }
      const data = await res.json();
      if (data?.success) {
        toast.success(data.message || "Check-in thành công");
        setOrder((prev) => ({ ...(prev || {}), is_used: true }));
        pushHistory({
          booking_code: order.booking_code,
          time: new Date().toISOString(),
          success: true,
        });
      } else {
        toast.error(data?.message || "Check-in thất bại");
        pushHistory({
          booking_code: order.booking_code,
          time: new Date().toISOString(),
          success: false,
        });
      }
    } catch (err) {
      console.error("Check-in error", err);
      toast.error("Lỗi kết nối server");
      pushHistory({
        booking_code: order.booking_code,
        time: new Date().toISOString(),
        success: false,
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const handleDetected = (code) => {
    if (!code) return;
    setBookingCode(code);
    fetchOrder(code.trim());
    toast.success("Đã quét QR, đang tải đơn hàng");
  };

  const hasOrder = useMemo(() => Boolean(order), [order]);

  return (
    <div className="flex flex-col h-full bg-background-dark text-white overflow-hidden">
      <div className="h-16 bg-surface-dark border-b border-surface-dark flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-tight">Check-in Vé</h2>
          {order?.booking_code && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 border border-white/10 text-white/70">
              {order.booking_code}
            </span>
          )}
        </div>
        {order?.showtime && (
          <div className="text-sm text-white/70">
            Suất:{" "}
            {formatDateTime(order.showtime) || formatTimeHM(order.showtime)}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-7xl mx-auto h-full flex flex-col lg:flex-row gap-6">
          <div className="flex flex-col gap-6 lg:w-5/12 xl:w-1/3 shrink-0">
            <CheckInSearch
              value={bookingCode}
              onChange={setBookingCode}
              onSubmit={handleSearch}
              loading={loading}
            />
            <QRScanner
              onDetected={handleDetected}
              scanning={scanning}
              onScanningChange={setScanning}
            />
            <CheckInHistory items={history} />
          </div>

          <div className="flex-1 flex flex-col h-full overflow-hidden gap-4">
            {hasOrder ? (
              <TicketResult
                order={order}
                onCheckIn={handleCheckIn}
                checkingIn={checkingIn}
              />
            ) : (
              <div className="flex-1 bg-surface-dark border border-white/10 rounded-xl shadow-inner flex items-center justify-center text-white/50 text-sm">
                Nhập hoặc quét mã đặt vé để hiển thị thông tin
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInPage;
