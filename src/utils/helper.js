// src/utils/helper.js

/**
 * Lấy ảnh thumbnail từ link YouTube
 * @param {string} url - Link YouTube (full hoặc short)
 * @returns {string|null} - Link ảnh thumbnail
 */
export const getYouTubeThumbnail = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;

  // Trả về ảnh chất lượng trung bình cao (mqdefault)
  return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
};

/**
 * Chuyển đổi phút sang định dạng "xh ym"
 * @param {number} minutes
 * @returns {string}
 */
export const formatDuration = (minutes) => {
  if (!minutes) return "N/A";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
};

/**
 * Lấy năm từ chuỗi ngày tháng
 * @param {string} dateString
 * @returns {number|string}
 */
export const getYear = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear();
};

/**
 * Nối mảng thể loại thành chuỗi
 * @param {Array} genresArray
 * @returns {string}
 */
export const getGenres = (genresArray) => {
  if (!genresArray || genresArray.length === 0) return "";
  return genresArray.map((g) => g.name).join(", ");
};

/**
 * Trả về style và text cho tag trạng thái phim
 * @param {string} status
 * @returns {object} { text, classes }
 */
export const getStatusTag = (status) => {
  if (status === "COMING_SOON") {
    return {
      text: "Sắp chiếu",
      classes: "bg-white/10 text-white border border-white/20 backdrop-blur-sm",
    };
  }
  return {
    text: "Đang chiếu",
    classes:
      "bg-primary/20 text-primary border border-primary/20 backdrop-blur-sm",
  };
};

/**
 * Dịch loại nghệ sĩ sang tiếng Việt
 * @param {string} type - ACTOR | DIRECTOR
 * @returns {string}
 */
export const getRoleName = (type) => {
  if (type === "DIRECTOR") return "Đạo diễn";
  if (type === "ACTOR") return "Diễn viên";
  return "Nghệ sĩ";
};

/**
 * Lấy chữ cái đầu của tên để làm Avatar mặc định
 * @param {string} name
 * @returns {string}
 */
export const getInitials = (name) => {
  if (!name) return "U";
  return name.charAt(0).toUpperCase();
};

/**
 * Chuyển đổi ngày (ISO string) sang định dạng YYYY-MM-DD cho input type="date"
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

/**
 * Format ngày hiển thị cho người dùng (dd/mm/yyyy)
 * @param {string} dateString
 * @returns {string}
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  } catch (error) {
    return dateString;
  }
};

/**
 * Lấy ảnh poster chính từ mảng url
 * @param {Array} posterUrls
 * @returns {string}
 */
export const getPrimaryPoster = (posterUrls) => {
  if (Array.isArray(posterUrls) && posterUrls.length > 0) {
    return posterUrls[0];
  }
  // Ảnh mặc định nếu không có poster
  return "https://via.placeholder.com/300x450?text=No+Image";
};

/**
 * Lấy tên thể loại đầu tiên (dùng cho thẻ card nhỏ)
 * @param {Array} genres
 * @returns {string}
 */
export const getFirstGenre = (genres) => {
  if (Array.isArray(genres) && genres.length > 0) {
    return genres[0].name;
  }
  return "Phim";
};

export const formatCurrency = (amount) => {
  const num = Number(amount);
  if (Number.isNaN(num)) return "0 đ";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export const mapOrderStatus = (status) => {
  const upper = (status || "").toUpperCase();
  switch (upper) {
    case "SUCCESSFUL":
      return {
        text: "Hoàn thành",
        badge: "bg-green-500/10 text-green-400 border border-green-500/30",
      };
    case "PROCESSING":
    case "PENDING":
      return {
        text: "Đang xử lý",
        badge: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
      };
    case "CANCELLED":
    case "CANCELED":
    case "FAILED":
      return {
        text: "Đã hủy",
        badge: "bg-red-500/10 text-red-400 border border-red-500/30",
      };
    default:
      return {
        text: "Khác",
        badge: "bg-white/10 text-white/70 border border-white/20",
      };
  }
};

/**
 * Sắp xếp danh sách phim theo tiêu chí.
 * @param {Array} items
 * @param {"POPULAR"|"TITLE_ASC"|"NEWEST"|"RATING"} sortBy
 * @returns {Array}
 */
export const sortMovies = (items, sortBy) => {
  const safeItems = Array.isArray(items) ? [...items] : [];
  switch (sortBy) {
    case "TITLE_ASC":
      return safeItems.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    case "NEWEST":
      return safeItems.sort(
        (a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0)
      );
    case "RATING":
      return safeItems;
    default:
      return safeItems;
  }
};

/**
 * Format điểm đánh giá (VD: 8.5)
 * @param {number} score
 * @returns {string}
 */
export const formatRating = (score) => {
  if (!score) return "N/A";
  return parseFloat(score).toFixed(1);
};

/**
 * Tạo mảng phân trang (VD: [1, 'DOTS', 4, 5, 6, 'DOTS', 10])
 * @param {number} currentPage
 * @param {number} totalPages
 * @returns {Array}
 */
export const getPaginationRange = (currentPage, totalPages) => {
  const delta = 1; // Số trang hiển thị 2 bên trang hiện tại
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("DOTS");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

// Chuẩn hóa chuỗi QR: nếu backend trả base64 thuần thì thêm prefix data URI
export const normalizeQrCode = (qr) => {
  if (!qr) return null;
  return qr.startsWith("data:") ? qr : `data:image/png;base64,${qr}`;
};

// Ghép danh sách ghế từ Tickets
export const formatSeats = (tickets = []) => {
  return tickets
    .map((t) => {
      const row = t?.Seat?.row;
      const number = t?.Seat?.number;
      if (row && number) return `${row}${number}`;
      if (number) return `${number}`;
      return t?.seat_id || "";
    })
    .filter(Boolean)
    .join(", ");
};

/**
 * hàm này sẽ lấy token từ localStorage, truyền vào trước khi chạy các hàm CRUD admin.
 * @param {RequestInfo} input
 * @param {RequestInit} init
 * @returns {Promise<Response>}
 */
export const authenticatedFetch = (input, init = {}) => {
  const token = localStorage.getItem("accessToken");
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(input, { ...init, headers });
};
