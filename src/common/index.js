// src/common/index.js

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SummaryApi = {
  // Authentication APIs
  register: {
    url: `${BASE_URL}/auth/register`,
    method: "post",
  },
  login: {
    url: `${BASE_URL}/auth/login`,
    method: "post",
  },
  forgotPassword: {
    url: `${BASE_URL}/auth/forgot-password`,
    method: "post",
  },
  verifyOtp: {
    url: `${BASE_URL}/auth/forgot-password/verify-otp`,
    method: "post",
  },
  resetPassword: {
    url: `${BASE_URL}/auth/forgot-password/reset-password`,
    method: "post",
  },
  myInfo: {
    url: `${BASE_URL}/auth/myInfo`,
    method: "get",
  },
  changePassword: {
    url: `${BASE_URL}/auth/change-password`,
    method: "put",
  },

  // Movie APIs
  getMovies: {
    url: `${BASE_URL}/movies`,
    method: "get",
  },
  getMovieDetail: {
    url: `${BASE_URL}/movies`, // Khi gọi API cần nối thêm ID: url + '/' + id
    method: "get",
  },
  getMoviesByGenre: {
    url: `${BASE_URL}/movies/genre`, // query params: page, size, genre_id
    method: "get",
  },

  //People APIs
  getPeoples: {
    url: `${BASE_URL}/peoples`,
    method: "get",
  },
  getPeopleDetail: {
    url: `${BASE_URL}/peoples`, // Khi gọi API cần nối thêm ID: url + '/' + id
    method: "get",
  },

  // User APIs
  updateUser: {
    url: `${BASE_URL}/users`,
    method: "put",
  },
  uploadAvatar: {
    url: `${BASE_URL}/users/avatar`,
    method: "put",
  },
};

export default SummaryApi;
