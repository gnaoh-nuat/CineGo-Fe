import React, { useEffect, useMemo, useState, memo } from "react";
import SummaryApi from "../../common";
import {
  authenticatedFetch,
  toUpperSafe,
  formatTimeHM,
} from "../../utils/helper";
import { toast } from "react-toastify";

// --- CONSTANTS ---
const TIMELINE_START_HOUR = 8;
const TIMELINE_END_HOUR = 24;
const HOUR_WIDTH_PX = 100; // Độ rộng 1 giờ (tăng lên 100px cho thoáng)
const TOTAL_MINUTES = (TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60;

// Mảng các mốc giờ: 8, 9, ..., 24
const HOUR_MARKS = Array.from(
  { length: TIMELINE_END_HOUR - TIMELINE_START_HOUR + 1 },
  (_, i) => TIMELINE_START_HOUR + i
);

// Tổng chiều rộng timeline (px)
const TIMELINE_TOTAL_WIDTH = (HOUR_MARKS.length - 1) * HOUR_WIDTH_PX;

// --- HELPER FUNCTIONS ---
const normalizeShowtime = (item) => {
  const startRaw =
    item?.start_time ||
    item?.startTime ||
    item?.start_at ||
    item?.start ||
    item?.startDate;
  const duration =
    item?.duration ||
    item?.movie_duration ||
    item?.movieDuration ||
    item?.movie?.duration ||
    item?.Movie?.duration_minutes ||
    120;
  const start = startRaw ? new Date(startRaw) : null;
  const end = start
    ? new Date(start.getTime() + Number(duration) * 60000)
    : null;

  return {
    id: item?.id || item?.showtime_id,
    original: item,
    movieTitle:
      item?.movie_title ||
      item?.movieTitle ||
      item?.movie?.title ||
      item?.Movie?.title ||
      "(Chưa có tên phim)",
    roomName:
      item?.room_name ||
      item?.roomName ||
      item?.room?.name ||
      item?.cinema_room?.name ||
      "Phòng ?",
    roomId: item?.room_id || item?.room?.id,
    movieId: item?.movie_id || item?.movie?.id,
    // Scheduler trả nested Movie; giữ price dạng number khi render
    format: toUpperSafe(
      item?.format || item?.movie_format || item?.type || "2D"
    ),
    price: Number(item?.price || 0),
    start,
    end,
    duration,
  };
};

const getPositionStyles = (start, end) => {
  if (!start || !end) return { left: "0%", width: "0%" };

  const startMinutes =
    start.getHours() * 60 + start.getMinutes() - TIMELINE_START_HOUR * 60;
  const durationMinutes = (end - start) / 60000;

  const left = Math.max(0, (startMinutes / TOTAL_MINUTES) * 100);
  const width = Math.max(0.5, (durationMinutes / TOTAL_MINUTES) * 100);

  return { left: `${left}%`, width: `${width}%` };
};

// --- SUB-COMPONENTS ---

// 1. Block hiển thị suất chiếu
const ShowtimeBlock = memo(({ item, onClick }) => {
  const { left, width } = getPositionStyles(item.start, item.end);

  return (
    <div
      onClick={() => onClick(item)}
      className="absolute top-2 bottom-2 rounded-lg border border-primary/40 bg-primary/20 hover:bg-primary/30 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md hover:shadow-primary/20 z-10 overflow-hidden group backdrop-blur-sm"
      style={{ left, width }}
      title={`${item.movieTitle} (${formatTimeHM(item.start?.toISOString())})`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      <div className="px-2 py-1 flex flex-col justify-center h-full ml-1">
        <p className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-primary transition-colors">
          {item.movieTitle}
        </p>
        <div className="flex items-center gap-1 mt-0.5 opacity-70">
          <span className="text-[10px] bg-white/10 px-1 rounded text-white font-mono">
            {item.format}
          </span>
          <span className="text-[10px] text-white">
            {formatTimeHM(item.start?.toISOString())}
          </span>
        </div>
      </div>
    </div>
  );
});

// 2. Dòng Timeline cho mỗi phòng
const TimelineRow = memo(({ room, items, onEdit }) => {
  return (
    <div className="flex border-b border-white/5 relative h-24 hover:bg-white/[0.02] transition-colors group shrink-0">
      {/* Cột tên phòng (Sticky left) */}
      <div className="w-48 px-4 py-3 shrink-0 border-r border-white/10 sticky left-0 bg-surface-dark z-20 flex flex-col justify-center shadow-[4px_0_15px_rgba(0,0,0,0.3)]">
        <p className="font-bold text-white text-sm group-hover:text-primary transition-colors truncate">
          {room.name}
        </p>
        <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">
            theaters
          </span>
          {items.length} suất
        </p>
      </div>

      {/* Track timeline (Width cố định theo tổng giờ) */}
      <div
        className="relative h-full"
        style={{ width: `${TIMELINE_TOTAL_WIDTH}px` }}
      >
        {/* Lưới giờ nền */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to right, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent ${HOUR_WIDTH_PX}px)`,
          }}
        />

        {items.map((item) => (
          <ShowtimeBlock key={item.id} item={item} onClick={onEdit} />
        ))}
      </div>
    </div>
  );
});

// 3. Bộ lọc
const ShowtimeFilters = ({
  provinces,
  cinemas,
  provinceId,
  setProvinceId,
  cinemaId,
  setCinemaId,
  date,
  setDate,
  onRefresh,
  onCreate,
}) => (
  <div className="p-6 bg-surface-dark border-b border-white/5 flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-end shrink-0">
    <div className="flex flex-wrap gap-4 w-full xl:w-auto">
      <FilterSelect
        label="Khu vực"
        value={provinceId}
        onChange={(e) => {
          setProvinceId(e.target.value);
          setCinemaId("");
        }}
        options={provinces}
        placeholder="Chọn Tỉnh/Thành"
        icon="location_on"
      />
      <FilterSelect
        label="Rạp chiếu"
        value={cinemaId}
        onChange={(e) => setCinemaId(e.target.value)}
        options={cinemas}
        placeholder="Chọn Rạp"
        disabled={!provinceId}
        icon="theater_comedy"
      />
      <div className="flex flex-col gap-1.5 w-full sm:w-auto">
        <label className="text-xs font-bold text-white/50 uppercase ml-1">
          Ngày chiếu
        </label>
        <div className="relative">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full sm:w-48 bg-background-dark border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
          />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 w-full xl:w-auto mt-2 xl:mt-0">
      <button
        onClick={onRefresh}
        className="px-4 py-2.5 rounded-xl bg-white/5 text-white/70 hover:text-white border border-white/10 hover:bg-white/10 transition flex items-center gap-2 font-medium text-sm"
      >
        <span className="material-symbols-outlined text-lg">refresh</span>
        Làm mới
      </button>
      <button
        onClick={onCreate}
        disabled={!cinemaId}
        className={`flex-1 xl:flex-none px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition flex items-center justify-center gap-2 ${
          !cinemaId
            ? "bg-white/10 text-white/30 cursor-not-allowed"
            : "bg-primary text-white hover:bg-primary/90 shadow-primary/20 hover:-translate-y-0.5"
        }`}
      >
        <span className="material-symbols-outlined text-lg">add_circle</span>
        Thêm lịch chiếu
      </button>
    </div>
  </div>
);

const FilterSelect = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  icon,
}) => (
  <div className="flex flex-col gap-1.5 w-full sm:w-auto">
    <label className="text-xs font-bold text-white/50 uppercase ml-1">
      {label}
    </label>
    <div className="relative group">
      <span
        className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg ${
          disabled
            ? "text-white/20"
            : "text-white/40 group-focus-within:text-primary"
        }`}
      >
        {icon}
      </span>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full sm:w-60 appearance-none bg-background-dark border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer ${
          disabled ? "text-white/30 cursor-not-allowed" : "text-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id || opt.code} value={opt.id || opt.code}>
            {opt.name}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none text-lg">
        expand_more
      </span>
    </div>
  </div>
);

// 4. Modal (Thêm/Sửa)
const ShowtimeModal = ({
  isOpen,
  onClose,
  isEdit,
  data,
  setData,
  movies,
  rooms,
  onSubmit,
  onDelete,
  isLoading,
}) => {
  if (!isOpen) return null;
  const safeMovies = movies || [];
  const safeRooms = rooms || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in-up">
      <div className="bg-surface-dark border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-white/5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              {isEdit ? "edit_calendar" : "calendar_add_on"}
            </span>
            {isEdit ? "Cập nhật lịch chiếu" : "Thêm lịch chiếu mới"}
          </h3>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition rounded-full p-1 hover:bg-white/10"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase">
              Phim chiếu
            </label>
            <select
              value={data.movie_id}
              onChange={(e) => setData({ ...data, movie_id: e.target.value })}
              className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm"
            >
              <option value="">-- Chọn phim --</option>
              {safeMovies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.duration}p)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase">
              Phòng chiếu
            </label>
            <select
              value={data.room_id}
              onChange={(e) => setData({ ...data, room_id: e.target.value })}
              className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none text-sm"
            >
              <option value="">-- Chọn phòng --</option>
              {safeRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase">
                Thời gian
              </label>
              <input
                type="datetime-local"
                value={data.start_time}
                onChange={(e) =>
                  setData({ ...data, start_time: e.target.value })
                }
                className="w-full bg-background-dark border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary outline-none text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/60 uppercase">
                Định dạng
              </label>
              <select
                value={data.movie_format}
                onChange={(e) =>
                  setData({ ...data, movie_format: e.target.value })
                }
                className="w-full bg-background-dark border border-white/10 rounded-xl px-3 py-3 text-white focus:border-primary outline-none text-sm"
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-white/60 uppercase">
              Giá vé (VNĐ)
            </label>
            <div className="relative">
              <input
                type="number"
                value={data.price}
                onChange={(e) => setData({ ...data, price: e.target.value })}
                className="w-full bg-background-dark border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white focus:border-primary outline-none text-sm font-mono"
                placeholder="0"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 text-xs font-bold">
                VNĐ
              </span>
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-white/10 flex justify-end gap-3 bg-white/5">
          {isEdit && (
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-red-500/10 text-danger hover:bg-danger/20 font-bold text-sm mr-auto transition"
            >
              Xóa lịch
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-bold text-sm transition"
          >
            Đóng
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 font-bold text-sm shadow-lg shadow-primary/25 transition flex items-center gap-2"
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {isEdit ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN CONTAINER ---

const ShowtimesManagement = () => {
  // State
  const [provinces, setProvinces] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [loading, setLoading] = useState(false);
  const [provinceId, setProvinceId] = useState("");
  const [cinemaId, setCinemaId] = useState("");
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentShowtimeId, setCurrentShowtimeId] = useState(null);
  const [formData, setFormData] = useState({
    movie_id: "",
    room_id: "",
    start_time: "",
    movie_format: "2D",
    price: "",
  });

  const handleUnauthorized = () => {
    toast.warning("Hết phiên đăng nhập");
    localStorage.removeItem("accessToken");
    setTimeout(() => (window.location.href = "/login"), 500);
  };

  // Initial Data
  useEffect(() => {
    const initData = async () => {
      try {
        const [provRes, movieRes] = await Promise.all([
          authenticatedFetch(`${SummaryApi.getProvinces.url}?page=1&size=200`),
          authenticatedFetch(`${SummaryApi.getMovies.url}?page=1&size=1000`),
        ]);
        const provData = await provRes.json();
        const movieData = await movieRes.json();
        if (provData.success) setProvinces(provData.data?.items || []);
        if (movieData.success) setMovies(movieData.data?.items || []);
      } catch (e) {
        console.error(e);
      }
    };
    initData();
  }, []);

  // Fetch Cinemas
  useEffect(() => {
    if (!provinceId) {
      setCinemas([]);
      setCinemaId("");
      return;
    }
    const loadCinemas = async () => {
      try {
        const res = await authenticatedFetch(
          `${SummaryApi.getCinemas.url}?page=1&size=200&province_id=${provinceId}`
        );
        const data = await res.json();
        setCinemas(data.success ? data.data?.items : []);
      } catch (e) {
        console.error(e);
      }
    };
    loadCinemas();
  }, [provinceId]);

  // Fetch Rooms (SỬA LỖI: Dùng query param cinema_id thay vì path param)
  useEffect(() => {
    if (!cinemaId) {
      setRooms([]);
      return;
    }
    const loadRooms = async () => {
      try {
        // Fix: sử dụng query params đúng chuẩn API
        const res = await authenticatedFetch(
          `${SummaryApi.getCinemaRooms.url}?page=1&size=200&cinema_id=${cinemaId}`
        );
        const data = await res.json();

        if (data.success) {
          // Xử lý cả trường hợp trả về mảng hoặc object phân trang
          const items = data.data?.items || data.data || [];
          setRooms(Array.isArray(items) ? items : []);
        } else {
          setRooms([]);
        }
      } catch (e) {
        console.error("Load rooms error:", e);
        setRooms([]);
      }
    };
    loadRooms();
  }, [cinemaId]);

  // Fetch Showtimes
  const fetchShowtimes = async () => {
    if (!cinemaId || !date) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return toast.warning("Vui lòng đăng nhập");

    setLoading(true);
    try {
      const query = `date=${date}&cinema_id=${cinemaId}`;
      let res = await authenticatedFetch(
        `${SummaryApi.getShowtimeScheduler.url}?${query}`
      );

      if (res.status === 401) return handleUnauthorized();

      // Fallback
      if (res.status >= 400) {
        res = await authenticatedFetch(
          `${SummaryApi.getShowtimes.url}?page=1&size=200&${query}`
        );
        if (res.status === 401) return handleUnauthorized();
      }

      const data = await res.json();
      if (data.success) {
        const rawItems = data.data?.items || data.data || [];
        // Flatten logic
        let flatList = [];
        if (rawItems.length > 0 && rawItems[0].Showtimes) {
          rawItems.forEach((r) => {
            if (r.Showtimes)
              r.Showtimes.forEach((s) =>
                flatList.push({ ...s, room_name: r.name, room_id: r.id })
              );
          });
        } else {
          flatList = rawItems;
        }
        setShowtimes(flatList.map(normalizeShowtime));
      } else {
        setShowtimes([]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Lỗi tải lịch chiếu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cinemaId, date]);

  // Logic Grouping - Source of truth là Rooms
  const groupedData = useMemo(() => {
    if (!rooms || rooms.length === 0) return [];
    const map = new Map();
    showtimes.forEach((st) => {
      const key = String(st.roomId);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(st);
    });
    return rooms.map((room) => ({
      id: room.id,
      name: room.name,
      items: (map.get(String(room.id)) || []).sort(
        (a, b) => (a.start || 0) - (b.start || 0)
      ),
    }));
  }, [showtimes, rooms]);

  // Handlers
  const handleOpenCreate = () => {
    if (!cinemaId) return toast.warning("Chọn rạp trước");
    setIsEditMode(false);
    setCurrentShowtimeId(null);
    setFormData({
      movie_id: "",
      room_id: "",
      start_time: `${date}T09:00`,
      movie_format: "2D",
      price: "",
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setIsEditMode(true);
    setCurrentShowtimeId(item.id);
    const isoLocal = item.start
      ? new Date(item.start.getTime() - item.start.getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : "";
    setFormData({
      movie_id: item.movieId,
      room_id: item.roomId,
      start_time: isoLocal,
      movie_format: item.format,
      price: item.price,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (
      !formData.movie_id ||
      !formData.room_id ||
      !formData.start_time ||
      !formData.price
    )
      return toast.error("Thiếu thông tin");
    setModalLoading(true);
    try {
      const url = isEditMode
        ? `${SummaryApi.updateShowtime.url}/${currentShowtimeId}`
        : SummaryApi.createShowtime.url;
      const method = isEditMode ? "PUT" : "POST";
      const payload = {
        ...formData,
        start_time: new Date(formData.start_time).toISOString(),
        price: Number(formData.price),
      };

      const res = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      if (res.status === 401) return handleUnauthorized();

      const data = await res.json();
      if (data.success) {
        toast.success(
          isEditMode ? "Cập nhật thành công" : "Tạo mới thành công"
        );
        setShowModal(false);
        fetchShowtimes();
      } else {
        toast.error(data.message || "Lỗi xử lý");
      }
    } catch (e) {
      toast.error("Lỗi kết nối");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentShowtimeId || !window.confirm("Xóa lịch chiếu này?")) return;
    setModalLoading(true);
    try {
      const res = await authenticatedFetch(
        `${SummaryApi.deleteShowtime.url}/${currentShowtimeId}`,
        { method: "DELETE" }
      );
      if (res.status === 401) return handleUnauthorized();
      const data = await res.json();
      if (data.success) {
        toast.success("Đã xóa");
        setShowModal(false);
        fetchShowtimes();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error("Lỗi kết nối");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white font-sans overflow-hidden">
      {/* Header */}
      <div className="h-16 px-6 border-b border-white/10 bg-surface-dark flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold font-display tracking-tight flex items-center gap-2">
          <span className="text-primary material-symbols-outlined">
            calendar_month
          </span>
          Quản lý Lịch chiếu
        </h1>
        <div className="size-9 rounded-full bg-white/10 border border-white/10" />
      </div>

      {/* Filters */}
      <ShowtimeFilters
        provinces={provinces}
        cinemas={cinemas}
        provinceId={provinceId}
        setProvinceId={setProvinceId}
        cinemaId={cinemaId}
        setCinemaId={setCinemaId}
        date={date}
        setDate={setDate}
        onRefresh={fetchShowtimes}
        onCreate={handleOpenCreate}
      />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        {!cinemaId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-white/30 border-2 border-dashed border-white/10 rounded-2xl bg-surface-dark/30">
            <span className="material-symbols-outlined text-6xl mb-4">
              theaters
            </span>
            <p className="text-lg font-medium">
              Vui lòng chọn Rạp để xem lịch chiếu
            </p>
          </div>
        ) : (
          <div className="flex-1 bg-surface-dark rounded-2xl border border-white/10 overflow-hidden flex flex-col shadow-2xl">
            {/* Timeline Container */}
            <div className="flex-1 overflow-auto custom-scrollbar relative">
              <div
                style={{
                  minWidth: `${TIMELINE_TOTAL_WIDTH + 200}px`,
                }}
              >
                {/* Sticky Header */}
                <div className="sticky top-0 z-30 flex bg-surface-dark border-b border-white/10 shadow-md">
                  <div className="w-48 px-4 py-3 border-r border-white/10 text-xs font-bold text-white/50 uppercase tracking-wider sticky left-0 bg-surface-dark z-40">
                    Phòng chiếu
                  </div>
                  <div
                    className="flex items-center h-12 relative"
                    style={{ width: `${TIMELINE_TOTAL_WIDTH}px` }}
                  >
                    {HOUR_MARKS.map((h, i) => (
                      <div
                        key={h}
                        className="text-xs font-bold text-white/30 border-l border-white/5 h-full flex items-center pl-2"
                        style={{ width: `${HOUR_WIDTH_PX}px` }}
                      >
                        {i < HOUR_MARKS.length - 1 ? `${h}:00` : ""}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Body */}
                {loading ? (
                  <div className="p-10 flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </div>
                ) : groupedData.length === 0 ? (
                  <div className="p-20 text-center text-white/30 italic">
                    Rạp này chưa có cấu hình phòng chiếu (hoặc không tìm thấy
                    phòng).
                  </div>
                ) : (
                  groupedData.map((row) => (
                    <TimelineRow
                      key={row.id}
                      room={row}
                      items={row.items}
                      onEdit={handleOpenEdit}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <ShowtimeModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isEdit={isEditMode}
        data={formData}
        setData={setFormData}
        movies={movies}
        rooms={rooms}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={modalLoading}
      />
    </div>
  );
};

export default ShowtimesManagement;
