import React, { createContext, useState, useContext, useEffect } from "react";
import SummaryApi from "../common/index.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- HÀM LOGIN ---
  const login = async (email, password) => {
    try {
      const response = await fetch(SummaryApi.login.url, {
        method: SummaryApi.login.method,
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      // Kiểm tra dựa trên cấu trúc JSON bạn cung cấp
      if (result.success) {
        // 1. Lưu token vào localStorage để dùng cho các request sau
        localStorage.setItem("token", result.data.accessToken);

        // 2. Lưu thông tin user vào State
        // Lưu ý: Nếu backend trả về ít thông tin, bạn chỉ lưu tạm role để redirect
        // Sau đó gọi hàm fetchUserDetails để lấy full info nếu cần
        setUser({
          role: result.data.role,
          // Thêm các thông tin khác nếu backend trả về (vd: result.data.name)
        });

        // Trả về kết quả để trang Login xử lý chuyển hướng
        return {
          success: true,
          message: result.message,
          role: result.data.role,
        };
      } else {
        return {
          success: false,
          message: result.message || "Đăng nhập thất bại",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Lỗi kết nối server",
      };
    }
  };

  // --- HÀM LẤY THÔNG TIN USER (Dùng khi F5 trang) ---
  const fetchUserDetails = async () => {
    const token = localStorage.getItem("token");

    // Nếu không có token thì thôi, ko gọi API
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Gọi API myInfo để lấy lại thông tin user từ token
      const response = await fetch(SummaryApi.myInfo.url, {
        method: SummaryApi.myInfo.method,
        headers: {
          // Gửi kèm token lên header
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data); // Cập nhật lại user vào context
      } else {
        // Token hết hạn hoặc không hợp lệ -> Xóa đi
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.log("Error fetch user details", error);
    } finally {
      setLoading(false);
    }
  };

  // Gọi fetchUserDetails 1 lần khi App vừa chạy
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, fetchUserDetails, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook để dùng nhanh ở các component khác
export const useAuth = () => useContext(AuthContext);
