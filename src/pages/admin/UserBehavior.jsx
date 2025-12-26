import { useEffect, useMemo, useState } from "react";
import SummaryApi from "@/common";
import { authenticatedFetch, formatDateForDisplay } from "@/utils/helper";

const ACTION_OPTIONS = [
  { value: "", label: "Tất cả hành động" },
  { value: "LOGIN", label: "Đăng nhập" },
  { value: "REGISTER", label: "Đăng ký" },
];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
];

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

const BehaviorChart = ({ timeline }) => {
  const max = useMemo(
    () => Math.max(...timeline.map((item) => Number(item.total) || 0), 0),
    [timeline]
  );

  if (!timeline.length) {
    return (
      <div className="h-40 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60">
        Chưa có dữ liệu trong khoảng thời gian này.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-56 rounded-2xl border border-white/10 bg-background-dark/60 p-4">
        {timeline.map((item) => {
          const success = Number(item.success) || 0;
          const failed = Number(item.failed) || 0;
          const total = success + failed || Number(item.total) || 0;
          const totalHeight = max ? Math.max((total / max) * 100, 4) : 0;
          const successHeight = max ? (success / max) * 100 : 0;
          const failedHeight = max ? (failed / max) * 100 : 0;

          return (
            <div
              key={item.date}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full rounded-lg border border-white/10 bg-white/5 flex flex-col justify-end"
                style={{ height: `${totalHeight}%` }}
              >
                <div
                  className="w-full bg-emerald-500/70"
                  style={{ height: `${successHeight}%` }}
                  title={`${item.date}: ${success} thành công`}
                />
                <div
                  className="w-full bg-red-500/70"
                  style={{ height: `${failedHeight}%` }}
                  title={`${item.date}: ${failed} thất bại`}
                />
              </div>
              <div className="text-[11px] text-white/60 text-center leading-tight">
                {formatDateForDisplay(item.date)}
                <div className="text-[10px] text-primary font-semibold">
                  {total} lượt
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-white/60">
        <span className="inline-flex items-center gap-2">
          <span className="block h-3 w-3 rounded-sm bg-emerald-400" />
          Thành công
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="block h-3 w-3 rounded-sm bg-red-400" />
          Thất bại
        </span>
      </div>
    </div>
  );
};

const UserBehavior = () => {
  const [filters, setFilters] = useState({
    action: "",
    status: "",
    from: "",
    to: "",
  });
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
    timeline: [],
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.action) params.append("action", filters.action);
      if (filters.status) params.append("status", filters.status);
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      params.append("size", "20");
      params.append("page", "1");

      const [statsRes, listRes] = await Promise.all([
        authenticatedFetch(
          `${SummaryApi.behaviorStats.url}?${params.toString()}`
        ),
        authenticatedFetch(`${SummaryApi.behaviors.url}?${params.toString()}`),
      ]);

      const [statsJson, listJson] = await Promise.all([
        statsRes.json(),
        listRes.json(),
      ]);

      if (statsJson?.success)
        setStats(
          statsJson.data || { total: 0, success: 0, failed: 0, timeline: [] }
        );
      else setError(statsJson?.message || "Không thể tải thống kê.");

      if (listJson?.success) setItems(listJson.data?.items || []);
      else setError(listJson?.message || "Không thể tải danh sách hành vi.");
    } catch (err) {
      console.error(err);
      setError("Có lỗi khi tải dữ liệu hành vi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.action, filters.status, filters.from, filters.to]);

  const resetFilters = () =>
    setFilters({ action: "", status: "", from: "", to: "" });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
            Theo dõi hành vi
          </p>
          <h1 className="text-3xl font-black text-white mt-1">
            Đăng nhập / Đăng ký
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Làm mới
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5"
          >
            Xóa lọc
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-background-dark/70 p-4">
          <p className="text-xs text-white/50">Tổng lượt</p>
          <p className="text-3xl font-bold text-white mt-1">
            {stats.total?.toLocaleString?.("vi-VN") || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <p className="text-xs text-emerald-100/80">Thành công</p>
          <p className="text-3xl font-bold text-emerald-100 mt-1">
            {stats.success?.toLocaleString?.("vi-VN") || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
          <p className="text-xs text-red-100/80">Thất bại</p>
          <p className="text-3xl font-bold text-red-100 mt-1">
            {stats.failed?.toLocaleString?.("vi-VN") || 0}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-white/60">Khoảng thời gian</p>
          <p className="text-sm text-white mt-1 leading-relaxed">
            {filters.from || filters.to
              ? `${filters.from || "?"} → ${filters.to || "?"}`
              : "Tất cả thời gian"}
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={filters.action}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, action: e.target.value }))
            }
          >
            {ACTION_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-background-dark text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <select
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            {STATUS_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-background-dark text-white"
              >
                {opt.label}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={filters.from}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, from: e.target.value }))
            }
            max={filters.to || undefined}
          />
          <input
            type="date"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            value={filters.to}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, to: e.target.value }))
            }
            min={filters.from || undefined}
          />
          <button
            type="button"
            onClick={loadData}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-colors"
          >
            <span className="material-symbols-outlined text-base">search</span>
            Lọc
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Xu hướng theo ngày</h3>
          {loading && (
            <span className="text-xs text-white/60">Đang tải...</span>
          )}
        </div>
        <BehaviorChart timeline={stats.timeline || []} />
      </div>

      <div className="rounded-3xl border border-white/10 bg-background-dark/70 p-6 shadow-xl backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Nhật ký gần nhất</h3>
          {loading && (
            <span className="text-xs text-white/60">Đang tải...</span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-white/50">
                <th className="px-3 py-2 font-semibold">Thời gian</th>
                <th className="px-3 py-2 font-semibold">Hành động</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
                <th className="px-3 py-2 font-semibold">Người dùng</th>
                <th className="px-3 py-2 font-semibold">Email</th>
                <th className="px-3 py-2 font-semibold">IP</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-6 w-full rounded bg-white/5 animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : items.length ? (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-white/5 last:border-none"
                  >
                    <td className="px-3 py-3 text-white/80">
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-white">
                      {item.action}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${
                          item.status === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/40"
                            : "bg-red-500/10 text-red-200 border-red-500/40"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {item.status === "SUCCESS" ? "check_circle" : "error"}
                        </span>
                        {item.status === "SUCCESS" ? "Thành công" : "Thất bại"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-white/80">
                      {item.user?.full_name || "Khách"}
                      {item.user?.role ? (
                        <span className="ml-2 text-[11px] text-white/50 uppercase">
                          {item.user.role}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 text-white/70">
                      {item.email || "—"}
                    </td>
                    <td className="px-3 py-3 text-white/60">
                      {item.ip_address || "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-white/60" colSpan={6}>
                    Chưa có dữ liệu.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserBehavior;
