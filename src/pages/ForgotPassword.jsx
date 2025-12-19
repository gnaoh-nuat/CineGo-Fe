import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SummaryApi from "../common";

// Import Layout & Components
import AuthLayout from "../components/User/Auth/AuthLayout";
import AuthInput from "../components/User/Auth/AuthInput";

// Icons
import {
  MdEmail,
  MdVpnKey,
  MdLock,
  MdArrowBack,
  MdVerifiedUser,
} from "react-icons/md";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [loading, setLoading] = useState(false);

  // State dữ liệu
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // --- BƯỚC 1: GỬI EMAIL ---
  const handleSendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.forgotPassword.url, {
        method: SummaryApi.forgotPassword.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        setStep(2);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC THỰC OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();

      console.log("Verify OTP Result:", result); // Debug

      if (result.success) {
        toast.success(result.message);

        // Lấy token từ response (kiểm tra kỹ cấu trúc trả về)
        const token = result.data?.resetToken || result.resetToken;

        if (token) {
          setResetToken(token);
          setStep(3);
        } else {
          toast.error("Lỗi hệ thống: Không tìm thấy Token xác thực.");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 3: ĐẶT LẠI MẬT KHẨU (ĐÃ SỬA PAYLOAD) ---
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (!resetToken) {
      toast.error("Phiên xác thực hết hạn. Vui lòng thử lại.");
      setStep(1);
      return;
    }

    setLoading(true);

    // SỬA LỖI 400: Đổi tên trường cho khớp với backend (giống form Register)
    const payload = {
      resetToken: resetToken,
      password: newPassword, // Đổi từ newPassword -> password
      confirm_password: confirmPassword, // Đổi từ confirmPassword -> confirm_password
    };

    console.log("Sending Reset Payload:", payload); // Debug payload

    try {
      const response = await fetch(SummaryApi.resetPassword.url, {
        method: SummaryApi.resetPassword.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (result.success) {
        toast.success("Đặt lại mật khẩu thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        console.error("Reset Error:", result);
        toast.error(result.message || "Không thể đặt lại mật khẩu.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  // --- Render Steps ---
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendEmail} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm">
                Nhập email để nhận mã OTP xác thực.
              </p>
            </div>
            <AuthInput
              label="Email"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<MdEmail className="text-xl" />}
            />
            <button
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              type="submit"
            >
              {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
            </button>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm">
                Mã OTP đã gửi đến <b>{email}</b>.
              </p>
            </div>
            <AuthInput
              label="Mã OTP"
              id="otp"
              name="otp"
              placeholder="Nhập mã 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              icon={<MdVpnKey className="text-xl" />}
            />
            <button
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              type="submit"
            >
              {loading ? "Đang kiểm tra..." : "Xác thực OTP"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-primary hover:underline"
              >
                Gửi lại mã?
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-white/60 text-sm">Thiết lập mật khẩu mới.</p>
            </div>
            <AuthInput
              label="Mật khẩu mới"
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              icon={<MdLock className="text-xl" />}
            />
            <AuthInput
              label="Nhập lại mật khẩu"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<MdVerifiedUser className="text-xl" />}
            />
            <button
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg font-bold text-white bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              type="submit"
            >
              {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title="Quên mật khẩu"
      subtitle={
        step === 3
          ? "Bước 3: Đặt lại mật khẩu"
          : step === 2
          ? "Bước 2: Xác thực OTP"
          : "Bước 1: Nhập Email"
      }
    >
      {renderStepContent()}

      <div className="mt-8 pt-6 border-t border-white/10 text-center">
        <Link
          to="/login"
          className="text-sm font-medium text-white/60 hover:text-white transition-colors inline-flex items-center gap-2 group"
        >
          <MdArrowBack className="text-lg transition-transform group-hover:-translate-x-1" />
          Quay lại đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
