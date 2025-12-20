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
