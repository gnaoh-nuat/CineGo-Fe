import React, { useEffect, useMemo, useState } from "react";
import OrderFilter from "../components/User/Orders/OrderFilter";
import OrderList from "../components/User/Orders/OrderList";
import OrderDetail from "../components/User/Orders/OrderDetail";
import SummaryApi from "../common";
import { formatCurrency } from "../utils/helper";
import { MdClose } from "react-icons/md";

const MyTickets = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("ALL");

  // QR States
  const [qrImage, setQrImage] = useState(null);
  const [qrBooking, setQrBooking] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);

  // Detail States
  const [detailBooking, setDetailBooking] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 1. Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await fetch(SummaryApi.getOrderHistory.url, {
          method: SummaryApi.getOrderHistory.method,
          headers: {
            "content-type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(Array.isArray(data.data) ? data.data : []);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử vé:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (status === "ALL") return orders;
    return orders.filter((o) => (o.status || "").toUpperCase() === status);
  }, [orders, status]);

  // 2. Handle QR: lấy trực tiếp qr_code_url từ đơn hàng (ưu tiên dữ liệu sẵn có, fallback gọi /orders/{id})
  const handleShowQr = async (order) => {
    if (!order?.booking_code) return;

    setQrBooking(order.booking_code);
    setQrImage(null);
    setQrLoading(true);

    try {
      // Ưu tiên dùng QR đã có trong order (nếu backend trả sẵn)
      const existingQr = order.qr_code_url || order.qrCodeUrl;
      if (existingQr) {
        const normalizedExisting = existingQr.startsWith("data:")
          ? existingQr
          : `data:image/png;base64,${existingQr}`;
        setQrImage(normalizedExisting);
        return;
      }

      // Nếu chưa có, gọi /orders/{id}
      if (!order.id) {
        console.error("Thiếu order.id để lấy QR");
        return;
      }

      const token = localStorage.getItem("accessToken");
      const url = `${SummaryApi.getOrderDetail.url}/${order.id}`;

      const res = await fetch(url, {
        method: SummaryApi.getOrderDetail.method,
        headers: {
          "content-type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await res.json();
      const qrUrl = data?.data?.qr_code_url;
      if (data?.success && qrUrl) {
        const normalizedQr = qrUrl.startsWith("data:")
          ? qrUrl
          : `data:image/png;base64,${qrUrl}`;
        setQrImage(normalizedQr);
      } else {
        console.error(
          "Không tạo được QR:",
          data?.message || "Missing qr_code_url"
        );
      }
    } catch (error) {
      console.error("Lỗi gọi API QR:", error);
    } finally {
      setQrLoading(false);
    }
  };

  // 3. Handle View Detail
  const handleViewDetail = (order) => {
    if (!order?.booking_code) return;
    setDetailBooking(order.booking_code);
    setDetailData(null);
    setDetailLoading(true);

    const token = localStorage.getItem("accessToken");
    const url = `${
      SummaryApi.getOrderByBookingCode.url
    }?booking_code=${encodeURIComponent(order.booking_code)}`;

    fetch(url, {
      method: SummaryApi.getOrderByBookingCode.method,
      headers: {
        "content-type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data) {
          setDetailData(data.data);
        } else {
          setDetailData(null);
        }
      })
      .catch((err) => {
        console.error("Lấy chi tiết đơn hàng thất bại", err);
        setDetailData(null);
      })
      .finally(() => setDetailLoading(false));
  };

  return (
    <div className="flex-grow bg-background-dark text-white min-h-screen pt-24 pb-16">
      <div className="max-w-[1024px] mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Vé của tôi</h1>
          <p className="text-white/50 text-sm">
            Quản lý và xem lại lịch sử đặt vé của bạn.
          </p>
        </div>

        <OrderFilter active={status} onChange={setStatus} />

        <OrderList
          orders={filteredOrders}
          loading={loading}
          onShowQr={handleShowQr}
          onViewDetail={handleViewDetail}
        />
      </div>

      {/* QR Modal */}
      {qrBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl p-6 w-full max-w-sm relative flex flex-col items-center animate-scale-up">
            <button
              onClick={() => {
                setQrBooking(null);
                setQrImage(null);
              }}
              className="absolute top-3 right-3 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <MdClose className="text-xl" />
            </button>

            <h3 className="text-xl font-bold mb-1 text-white">Mã vé vào rạp</h3>
            <p className="text-white/50 text-sm font-mono tracking-wider mb-6">
              #{qrBooking}
            </p>

            <div className="bg-white p-4 rounded-xl shadow-inner border border-white/10 mb-4 w-64 h-64 flex items-center justify-center">
              {qrLoading ? (
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              ) : qrImage ? (
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center">
                  Không thể tải mã QR
                </div>
              )}
            </div>

            <p className="text-white/40 text-xs text-center max-w-[250px]">
              Vui lòng đưa mã QR này cho nhân viên tại quầy soát vé.
            </p>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailBooking && (
        <OrderDetail
          bookingCode={detailBooking}
          loading={detailLoading}
          data={detailData}
          onClose={() => {
            setDetailBooking(null);
            setDetailData(null);
          }}
        />
      )}
    </div>
  );
};

export default MyTickets;
