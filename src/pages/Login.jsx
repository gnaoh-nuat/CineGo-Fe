import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  // Xử lý khi nhập liệu
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gọi hàm login từ Context
    const response = await login(data.email, data.password);

    if (response.success) {
      toast.success(response.message);

      // --- LOGIC ĐIỀU HƯỚNG DỰA TRÊN ROLE ---
      if (response.role === "ADMIN") {
        navigate("/admin"); // Chuyển sang layout Admin
      } else {
        navigate("/"); // Chuyển sang trang chủ User
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    // Container chính phủ kín phần Outlet
    <div className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center">
      {/* Background Image & Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://assets.nflxext.com/ffe/siteui/vlv3/c38a2d52-138e-48a3-ab68-36787ece46b3/eeb03fc9-99bt-4d8e-1f5d-2b45155f3066/VN-en-20240101-popsignuptwoweeks-perspective_alpha_website_large.jpg')",
        }} // Thay link ảnh nền của bạn vào đây
      >
        <div className="absolute inset-0 bg-background-dark/80 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent"></div>
      </div>

      {/* Form Login */}
      <div className="relative z-10 w-full max-w-md px-6 animate-fade-in-up">
        <div className="bg-surface-dark border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 bg-[#1e1e1e]">
          {" "}
          {/* Đảm bảo màu nền tối */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Đăng nhập</h2>
            <p className="text-white/50 text-sm">
              Chào mừng bạn trở lại với CinemaPlus
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-white/80"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                {/* Icon Mail */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Nếu không dùng Google Icon Font, bạn có thể dùng SVG hoặc thư viện react-icons */}
                  <span className="text-white/40 text-[20px]">✉️</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={data.email}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  className="block text-sm font-medium text-white/80"
                  htmlFor="password"
                >
                  Mật khẩu
                </label>
                <Link
                  to="/forgot-password"
                  class="text-sm font-medium text-red-500 hover:text-white transition-colors"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                {/* Icon Lock */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-white/40 text-[20px]">🔒</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={data.password}
                  onChange={handleOnChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-[#ea2a33] hover:bg-[#ea2a33]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2a33] transition-all shadow-lg shadow-primary/25 transform active:scale-[0.98]"
              type="submit"
            >
              Đăng nhập
            </button>
          </form>
          {/* Footer Form */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-white/60">
              Bạn chưa có tài khoản?
              <Link
                to="/register"
                className="font-bold text-white hover:text-[#ea2a33] transition-colors ml-1"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
