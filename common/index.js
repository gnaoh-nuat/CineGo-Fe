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
};

export default SummaryApi;
