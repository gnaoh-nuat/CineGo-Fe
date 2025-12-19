import React from "react";
import { MdPerson, MdLock } from "react-icons/md";

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    {
      id: "info",
      label: "Thông tin tài khoản",
      icon: <MdPerson className="text-xl" />,
    },
    {
      id: "password",
      label: "Đổi mật khẩu",
      icon: <MdLock className="text-xl" />,
    },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer rounded-r-lg border-l-4 transition-all duration-200 text-left ${
            activeTab === item.id
              ? "bg-white/5 text-white border-primary"
              : "text-white/60 hover:text-white hover:bg-white/5 border-transparent"
          }`}
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default ProfileSidebar;
