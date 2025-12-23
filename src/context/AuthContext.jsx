import React, { createContext, useContext, useEffect, useState } from "react";
import SummaryApi from "../common"; // Import API config

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy thông tin User
  const fetchUserDetails = async () => {
    // Lấy token từ localStorage (hoặc cookie tùy cách bạn lưu)
    // Giả sử bạn lưu token trong localStorage với key là "accessToken"
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(SummaryApi.myInfo.url, {
        method: SummaryApi.myInfo.method,
        headers: {
          "content-type": "application/json",
          // Quan trọng: Gửi kèm Token vào Header
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token hết hạn hoặc không hợp lệ -> xóa token và kết thúc sớm
        console.warn("Auth token invalid/expired, logging out");
        setUser(null);
        localStorage.removeItem("accessToken");
        setLoading(false);
        return;
      }

      const result = await response.json();

      if (result.success) {
        // API trả về: { data: { user: { ... } } }
        setUser(result.data.user);
      } else {
        // Nếu token hết hạn hoặc lỗi, logout luôn
        console.error("Fetch user info failed:", result.message);
        setUser(null);
        localStorage.removeItem("accessToken");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Gọi API lấy thông tin ngay khi app khởi chạy
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Hàm Login
  const login = async (email, password) => {
    try {
      const response = await fetch(SummaryApi.login.url, {
        method: SummaryApi.login.method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.success) {
        // 1. Lưu token
        localStorage.setItem("accessToken", result.data.accessToken);

        // 2. Gọi API lấy thông tin chi tiết user ngay lập tức
        await fetchUserDetails();

        return {
          success: true,
          message: result.message,
          role: result.data.role,
        };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      return { success: false, message: "Lỗi kết nối server!" };
    }
  };

  // Hàm Register (Giữ nguyên hoặc cập nhật tùy logic)
  const register = async (email, password, full_name, phone) => {
    // ... logic đăng ký của bạn
    // Nếu API đăng ký trả về token luôn thì cũng xử lý tương tự login
    return { success: true, message: "Đăng ký thành công" }; // Placeholder
  };

  // Hàm Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, register, fetchUserDetails, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
