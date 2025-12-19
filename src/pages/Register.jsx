import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";

import AuthLayout from "../components/User/Auth/AuthLayout";
import AuthInput from "../components/User/Auth/AuthInput";

import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdLock,
  MdVerifiedUser,
} from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const Register = () => {
  const [data, setData] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.password !== data.confirm_password) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const response = await fetch(SummaryApi.register.url, {
        method: SummaryApi.register.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          confirm_password: data.confirm_password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  return (
    <AuthLayout
      title="Đăng ký"
      subtitle={
        <>
          Tạo tài khoản mới tại{" "}
          <span className="text-primary font-bold">CineGo</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          label="Họ và tên"
          id="full_name"
          name="full_name"
          placeholder="Nguyễn Văn A"
          value={data.full_name}
          onChange={handleOnChange}
          icon={<MdPerson className="text-xl" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <AuthInput
            label="Số điện thoại"
            id="phone"
            name="phone"
            type="tel"
            placeholder="0912 345 678"
            value={data.phone}
            onChange={handleOnChange}
            icon={<MdPhone className="text-xl" />}
          />
        </div>

        <AuthInput
          label="Mật khẩu"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={data.password}
          onChange={handleOnChange}
          icon={<MdLock className="text-xl" />}
        />

        <AuthInput
          label="Nhập lại mật khẩu"
          id="confirm_password"
          name="confirm_password"
          type="password"
          placeholder="••••••••"
          value={data.confirm_password}
          onChange={handleOnChange}
          icon={<MdVerifiedUser className="text-xl" />}
        />

        <div className="pt-2">
          <button
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/25 transform active:scale-[0.98]"
            type="submit"
          >
            Đăng ký
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-white/10">
        <p className="text-center text-sm text-white/60">
          Bạn đã có tài khoản?
          <Link
            to="/login"
            className="font-bold text-white hover:text-primary transition-colors ml-1"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>

      <div className="relative mt-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-surface-dark text-white/40">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors bg-white/5 group">
          <FcGoogle className="text-xl group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white/80">Google</span>
        </button>
        <button className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 transition-colors bg-white/5 group">
          <FaFacebook className="text-xl text-blue-500 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium text-white/80">Facebook</span>
        </button>
      </div>
    </AuthLayout>
  );
};

export default Register;
