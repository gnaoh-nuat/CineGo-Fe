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

  // CRUD Movies - admin
  getMovies: {
    url: `${BASE_URL}/movies`,
    method: "get",
  },
  createMovie: {
    url: `${BASE_URL}/movies`,
    method: "post",
  },
  updateMovie: {
    url: `${BASE_URL}/movies`,
    method: "put",
  },
  deleteMovie: {
    url: `${BASE_URL}/movies`,
    method: "delete",
  },

  getMovieDetail: {
    url: `${BASE_URL}/movies`, // Khi gọi API cần nối thêm ID: url + '/' + id
    method: "get",
  },
  getMoviesByGenre: {
    url: `${BASE_URL}/movies/genre`, // query params: page, size, genre_id
    method: "get",
  },

  // Dashboard Stats (external service)
  getDashboardStats: {
    url: 'https://anjava.io.vn/v1/stats/dashboard',
    method: "get",
  },

  // CRUD People - admin
  getPeoples: {
    url: `${BASE_URL}/peoples`,
    method: "get",
  },
  getPeoplesDetail: {
    url: `${BASE_URL}/peoples`, // Khi gọi API cần nối thêm ID: url + '/' + id
    method: "get",
  },
  createPeoples: {
    url: `${BASE_URL}/peoples`,
    method: "post",
  },
  updatePeoples: {
    url: `${BASE_URL}/peoples`,
    method: "put",
  },
  deletePeoples: {
    url: `${BASE_URL}/peoples`,
    method: "delete",
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
  getUsers: {
    url: `${BASE_URL}/users`,
    method: "get",
  },
  createUser: {
    url: `${BASE_URL}/users`,
    method: "post",
  },
  deleteUser: {
    url: `${BASE_URL}/users`,
    method: "delete",
  },

  // Genre APIs
  getGenres: {
    url: `${BASE_URL}/genres`,
    method: "get",
  },
  getGenreDetail: {
    url: `${BASE_URL}/genres`,
    method: "get",
  },
  // CRUD for admin
  createGenre: {
    url: `${BASE_URL}/genres`,
    method: "post",
  },
  updateGenre: {
    url: `${BASE_URL}/genres`,
    method: "put",
  },
  deleteGenre: {
    url: `${BASE_URL}/genres`,
    method: "delete",
  },

  // Cinema APIs
  getCinemas: {
    url: `${BASE_URL}/cinemas`, // query: page, size, province_id
    method: "get",
  },
  getCinemaDetail: {
    url: `${BASE_URL}/cinemas`, // + '/{id}'
    method: "get",
  },
  getCinemaRooms: {
    url: `${BASE_URL}/cinema-rooms`, // + '/{id}'
    method: "get",
  },

  // Province APIs
  getProvinces: {
    url: `${BASE_URL}/provinces`, // query: page, size
    method: "get",
  },
  getProvinceDetail: {
    url: `${BASE_URL}/provinces`, // + '/{id}'
    method: "get",
  },

  // File upload APIs
  uploadImage: {
    url: `${BASE_URL}/files/upload/image`,
    method: "post",
  },
  uploadVideo: {
    url: `${BASE_URL}/files/upload/video`,
    method: "post",
  },

  // Food APIs
  getFoods: {
    url: `${BASE_URL}/foods`, // query: page, size, search
    method: "get",
  },
  createFood: {
    url: `${BASE_URL}/foods`,
    method: "post",
  },
  updateFood: {
    url: `${BASE_URL}/foods`,
    method: "put",
  },
  deleteFood: {
    url: `${BASE_URL}/foods`,
    method: "delete",
  },
  getFoodDetail: {
    url: `${BASE_URL}/foods`, // + '/{id}'
    method: "get",
  },

  // Order APIs
  createOrder: {
    url: `${BASE_URL}/orders`,
    method: "post",
  },
  orderVnpayReturn: {
    url: `${BASE_URL}/orders/vnpay-return`,
    method: "post",
  },
  getOrderHistory: {
    url: `${BASE_URL}/orders/history`,
    method: "get",
  },
  getOrderByBookingCode: {
    url: `${BASE_URL}/orders/booking`, // query: booking_code
    method: "get",
  },
  getOrderDetail: {
    url: `${BASE_URL}/orders`, // + '/{id}'
    method: "get",
  },

  // Seat APIs
  getSeatsByRoom: {
    url: `${BASE_URL}/seats/room`, // + '/{roomId}'
    method: "get",
  },
  getSeatDetail: {
    url: `${BASE_URL}/seats`, // + '/{id}'
    method: "get",
  },

  // Showtime APIs
  getShowtimes: {
    url: `${BASE_URL}/showtimes`, // query: movie_id, date, province_id, format
    method: "get",
  },
  getShowtimeSeats: {
    url: `${BASE_URL}/showtimes`, // + '/{showtimeId}/seats'
    method: "get",
  },

  // User detail
  getUserDetail: {
    url: `${BASE_URL}/users`, // + '/{id}'
    method: "get",
  },

  // Voucher APIs
  getVouchers: {
    url: `${BASE_URL}/vouchers`,
    method: "get",
  },
  createVoucher: {
    url: `${BASE_URL}/vouchers`,
    method: "post",
  },
  updateVoucher: {
    url: `${BASE_URL}/vouchers`,
    method: "put",
  },
  deleteVoucher: {
    url: `${BASE_URL}/vouchers`,
    method: "delete",
  },
  getMyVouchers: {
    url: `${BASE_URL}/vouchers/my-vouchers`,
    method: "get",
  },
  applyVoucher: {
    url: `${BASE_URL}/vouchers/apply`,
    method: "post",
  },
  getVoucherDetail: {
    url: `${BASE_URL}/vouchers`, // + '/{id}'
    method: "get",
  },
};

export default SummaryApi;
