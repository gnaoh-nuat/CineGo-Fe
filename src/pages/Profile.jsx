import React, { useState } from "react";
// Đã sửa đường dẫn import theo yêu cầu của bạn (lùi 1 cấp thư mục)
import ProfileSidebar from "../components/User/Profile/ProfileSidebar";
import UserInfo from "../components/User/Profile/UserInfo";
import ChangePassword from "../components/User/Profile/ChangePassword";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'password'

  return (
    // Giữ nền hiển thị ổn định và chỉ animate phần nội dung để tránh hiện tượng trắng thoáng qua
    <div className="px-6 py-10 min-h-[80vh] bg-background-dark text-white">
      <div className="max-w-6xl mx-auto animate-fade-in-up">
        {/* Page Header */}
        <div className="mb-8 border-l-4 border-primary pl-4">
          <h1 className="text-3xl font-bold text-white">Cài đặt tài khoản</h1>
          <p className="text-white/40 text-sm mt-1">
            Quản lý thông tin cá nhân và bảo mật
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Sidebar */}
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Right Content */}
          <div className="flex-grow w-full bg-surface-dark rounded-xl border border-white/10 shadow-2xl overflow-hidden min-h-[500px] p-6 md:p-10">
            {activeTab === "info" && <UserInfo />}
            {activeTab === "password" && <ChangePassword />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
