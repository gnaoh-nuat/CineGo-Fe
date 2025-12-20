import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
// Import các component mới
import AuthLayout from "../components/User/Auth/AuthLayout";
import AuthInput from "../components/User/Auth/AuthInput";
// Import icon
import { MdEmail, MdLock } from "react-icons/md";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login(data.email, data.password);

    if (response.success) {
      toast.success(response.message);
      if (response.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      toast.error(response.message);
    }
  };

  return (
    <AuthLayout
      title="Đăng nhập"
      subtitle={
        <>
          Chào mừng bạn trở lại với{" "}
          <span className="text-primary font-bold">CineGo</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <AuthInput
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="name@example.com"
          value={data.email}
          onChange={handleOnChange}
          icon={<MdEmail className="text-xl" />}
        />

        {/* Password */}
        <AuthInput
          label="Mật khẩu"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={data.password}
          onChange={handleOnChange}
          icon={<MdLock className="text-xl" />}
          rightElement={
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-primary hover:text-white transition-colors"
            >
              Quên mật khẩu?
            </Link>
          }
        />

        {/* Submit Button */}
        <button
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/25 transform active:scale-[0.98]"
          type="submit"
        >
          Đăng nhập
        </button>
      </form>

      {/* Footer Link */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-sm text-white/60">
          Bạn chưa có tài khoản?
          <Link
            to="/register"
            className="font-bold text-white hover:text-primary transition-colors ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
