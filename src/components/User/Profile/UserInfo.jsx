import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { MdCameraAlt, MdEdit } from "react-icons/md";

// Context & APIs
import { useAuth } from "../../../context/AuthContext";
import SummaryApi from "../../../common";

// Utils
import { getInitials, formatDateForInput } from "../../../utils/helper";

const UserInfo = () => {
  const { user, fetchUserDetails } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // State form data
  const [data, setData] = useState({
    full_name: "",
    phone: "",
    gender: "MALE",
    dob: "",
  });

  // Load dữ liệu user vào form và format ngày tháng bằng helper
  useEffect(() => {
    if (user) {
      setData({
        full_name: user.full_name || "",
        phone: user.phone || "",
        gender: user.gender || "MALE",
        dob: formatDateForInput(user.dob), // Sử dụng helper từ file utils
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // --- XỬ LÝ UPLOAD AVATAR ---
  const handleAvatarClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      return toast.error("Vui lòng chọn file ảnh!");
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Kích thước ảnh không được vượt quá 2MB");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(SummaryApi.uploadAvatar.url, {
        method: SummaryApi.uploadAvatar.method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (result.success || response.ok) {
        toast.success("Cập nhật ảnh đại diện thành công!");
        await fetchUserDetails();
      } else {
        toast.error(result.message || "Upload ảnh thất bại");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Lỗi kết nối khi upload ảnh");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // --- XỬ LÝ UPDATE THÔNG TIN ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!user?.id) return;
    setLoading(true);

    try {
      const response = await fetch(`${SummaryApi.updateUser.url}/${user.id}`, {
        method: SummaryApi.updateUser.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");
        await fetchUserDetails();
      } else {
        toast.error(result.message || "Cập nhật thất bại");
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
      <h2 className="text-xl font-bold text-white mb-6">Thông tin chung</h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* --- Avatar Section --- */}
        <div className="flex flex-col items-center gap-4 shrink-0">
          <div
            className={`relative group cursor-pointer ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
            onClick={handleAvatarClick}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="size-32 rounded-full overflow-hidden border-4 border-surface-dark ring-2 ring-white/10 shadow-xl bg-surface-dark flex items-center justify-center relative">
              {user?.image_url || user?.avatar ? (
                <img
                  src={user.image_url || user.avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/50">
                    {/* Sử dụng helper lấy chữ cái đầu */}
                    {getInitials(user?.full_name)}
                  </span>
                </div>
              )}

              {/* Overlay loading/hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                ) : (
                  <MdCameraAlt className="text-white text-3xl" />
                )}
              </div>
            </div>

            <button
              type="button"
              className="absolute bottom-1 right-1 size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border-2 border-surface-dark"
            >
              <MdEdit className="text-[16px]" />
            </button>
          </div>
          <p className="text-white/40 text-xs text-center">
            Cho phép: JPG, PNG <br /> Tối đa: 2MB
          </p>
        </div>

        {/* --- Form Section --- */}
        <form
          onSubmit={handleUpdate}
          className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-white/70">
              Họ và tên
            </label>
            <input
              name="full_name"
              value={data.full_name}
              onChange={handleChange}
              type="text"
              className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Giới tính
            </label>
            <div className="relative">
              <select
                name="gender"
                value={data.gender}
                onChange={handleChange}
                className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none cursor-pointer"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Ngày sinh
            </label>
            <input
              name="dob"
              value={data.dob}
              onChange={handleChange}
              type="date"
              className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors [color-scheme:dark]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={data.phone}
              onChange={handleChange}
              type="tel"
              className="w-full bg-background-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/70">Email</label>
            <input
              value={user?.email || ""}
              disabled
              type="email"
              className="w-full bg-background-dark/50 border border-white/5 rounded-lg px-4 py-3 text-white/50 cursor-not-allowed outline-none"
            />
          </div>

          <div className="md:col-span-2 pt-6 border-t border-white/5 mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
