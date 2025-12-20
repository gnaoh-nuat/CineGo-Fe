import React, { useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../../common"; //
import { MdInfoOutline, MdVisibility, MdVisibilityOff } from "react-icons/md";

// 1. Helper Component: Input Mật khẩu (Giữ nguyên vì đã tối ưu)
const PasswordInput = ({ label, name, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/70">{label}</label>
      <div className="relative">
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={show ? "text" : "password"}
          className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
          placeholder={placeholder}
          required
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 focus:outline-none"
        >
          {show ? <MdVisibilityOff /> : <MdVisibility />}
        </button>
      </div>
    </div>
  );
};

// 2. Main Component
const ChangePassword = () => {
  // Cập nhật State theo đúng tên trường API yêu cầu
  const [data, setData] = useState({
    currentPassword: "", // Sửa từ oldPassword -> currentPassword
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    if (data.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(SummaryApi.changePassword.url, {
        method: SummaryApi.changePassword.method, // PUT
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        // Gửi payload đúng chuẩn JSON bạn cung cấp
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Đổi mật khẩu thành công!");
        // Reset form về trạng thái ban đầu
        setData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(result.message || "Đổi mật khẩu thất bại");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in-up">
      <h2 className="text-xl font-bold text-white mb-6">Đổi mật khẩu</h2>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        {/* Note Box */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex items-start gap-3 mb-6">
          <MdInfoOutline className="text-primary text-xl shrink-0 mt-0.5" />
          <p className="text-sm text-white/80 leading-relaxed">
            Mật khẩu nên có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            để đảm bảo an toàn.
          </p>
        </div>

        {/* Mật khẩu hiện tại (currentPassword) */}
        <PasswordInput
          label="Mật khẩu hiện tại"
          name="currentPassword" // Name phải trùng với key trong state
          value={data.currentPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu hiện tại"
        />

        {/* Mật khẩu mới */}
        <PasswordInput
          label="Mật khẩu mới"
          name="newPassword"
          value={data.newPassword}
          onChange={handleChange}
          placeholder="Nhập mật khẩu mới"
        />

        {/* Xác nhận mật khẩu mới */}
        <PasswordInput
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu mới"
        />

        {/* Submit Button */}
        <div className="pt-6 border-t border-white/5 mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
