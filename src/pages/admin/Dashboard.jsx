import React, { useEffect, useState } from "react";
import SummaryApi from "@/common";
import { authenticatedFetch, formatCurrency } from "@/utils/helper";

// Import các component con mới tách
import MetricCard from "../../components/admin/Dashboard/MetricCard";
import BarChart from "../../components/admin/Dashboard/BarChart";
import MovieRow from "../../components/admin/Dashboard/MovieRow";
import CinemaRow from "../../components/admin/Dashboard/CinemaRow";
import OrderRow from "../../components/admin/Dashboard/OrderRow";

const SKELETON_CLASS = "bg-white/5 animate-pulse";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    total_revenue: 0,
    tickets_sold: 0,
    food_revenue: 0,
    new_users: 0,
    ticket_revenue: 0,
  });
  const [monthly, setMonthly] = useState([]);
  const [topMovies, setTopMovies] = useState([]);
  const [topCinemas, setTopCinemas] = useState([]);
  const [orders, setOrders] = useState([]);

  const currentYear = new Date().getFullYear();

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, monthlyRes, moviesRes, cinemasRes, ordersRes] =
        await Promise.all([
          authenticatedFetch(SummaryApi.getDashboardStats.url),
          authenticatedFetch(
            `${SummaryApi.getMonthlyRevenue.url}?year=${currentYear}`
          ),
          authenticatedFetch(`${SummaryApi.getTopMovies.url}?page=1&size=5`),
          authenticatedFetch(`${SummaryApi.getTopCinemas.url}?page=1&size=5`),
          authenticatedFetch(`${SummaryApi.getNewestOrders.url}?page=1&size=8`),
        ]);

      const [statsJson, monthlyJson, moviesJson, cinemasJson, ordersJson] =
        await Promise.all([
          statsRes.json(),
          monthlyRes.json(),
          moviesRes.json(),
          cinemasRes.json(),
          ordersRes.json(),
        ]);

      if (statsJson?.success) setStats(statsJson.data || {});
      if (monthlyJson?.success) setMonthly(monthlyJson.data || []);
      if (moviesJson?.success)
        setTopMovies(moviesJson.data?.items?.slice(0, 5) || []);
      if (cinemasJson?.success)
        setTopCinemas(cinemasJson.data?.items?.slice(0, 5) || []);
      if (ordersJson?.success)
        setOrders(ordersJson.data?.items?.slice(0, 8) || []);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const metricValue = (v, isMoney = false) => {
    if (v == null) return "—";
    return isMoney ? formatCurrency(v) : v.toLocaleString("vi-VN");
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
            Dashboard
          </p>
          <h1 className="text-3xl font-black text-white mt-1">Tổng quan</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-sm">Năm {currentYear}</span>
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Làm mới
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-danger">
          {error}
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Doanh thu tổng"
          value={metricValue(stats.total_revenue, true)}
          icon="payments"
          accent="bg-primary/15"
          loading={loading}
          skeleton={SKELETON_CLASS}
        />
        <MetricCard
          title="Vé bán ra"
          value={metricValue(stats.tickets_sold)}
          icon="confirmation_number"
          accent="bg-blue-500/15 text-info"
          loading={loading}
          skeleton={SKELETON_CLASS}
        />
        <MetricCard
          title="Doanh thu F&B"
          value={metricValue(stats.food_revenue, true)}
          icon="fastfood"
          accent="bg-warning/15 text-warning"
          loading={loading}
          skeleton={SKELETON_CLASS}
        />
        <MetricCard
          title="Người dùng mới"
          value={metricValue(stats.new_users)}
          icon="group_add"
          accent="bg-purple/15 text-purple"
          loading={loading}
          skeleton={SKELETON_CLASS}
        />
      </div>

      {/* Charts & Top Movies */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Biểu đồ doanh thu
              </h3>
              <p className="text-xs text-white/50">
                Theo tháng, chỉ tính đơn thành công
              </p>
            </div>
          </div>
          {loading ? (
            <div className={`h-64 w-full rounded-2xl ${SKELETON_CLASS}`} />
          ) : (
            <BarChart data={monthly} />
          )}
        </div>

        <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Top phim doanh thu</h3>
            <span className="text-xs text-white/50">Top 5</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className={`h-14 rounded-2xl ${SKELETON_CLASS}`} />
              ))
            ) : topMovies.length ? (
              topMovies.map((m) => <MovieRow key={m.id} movie={m} />)
            ) : (
              <p className="text-sm text-white/60">Chưa có dữ liệu</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Cinemas & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">
              Top rạp theo vé bán
            </h3>
            <span className="text-xs text-white/50">Top 5</span>
          </div>
          <div className="space-y-3">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className={`h-16 rounded-2xl ${SKELETON_CLASS}`} />
              ))
            ) : topCinemas.length ? (
              topCinemas.map((c) => <CinemaRow key={c.id} cinema={c} />)
            ) : (
              <p className="text-sm text-white/60">Chưa có dữ liệu</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Đơn hàng mới nhất</h3>
            <span className="text-xs text-white/50">Top 8</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-white/50">
                  <th className="px-3 py-2 font-semibold">Mã vé</th>
                  <th className="px-3 py-2 font-semibold">Khách</th>
                  <th className="px-3 py-2 font-semibold">Phim</th>
                  <th className="px-3 py-2 font-semibold">Suất</th>
                  <th className="px-3 py-2 font-semibold text-right">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-3 py-3" colSpan={5}>
                        <div
                          className={`h-6 w-full rounded ${SKELETON_CLASS}`}
                        />
                      </td>
                    </tr>
                  ))
                ) : orders.length ? (
                  orders.map((o) => <OrderRow key={o.ticket_code} order={o} />)
                ) : (
                  <tr>
                    <td className="px-3 py-4 text-white/60" colSpan={5}>
                      Chưa có dữ liệu.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
