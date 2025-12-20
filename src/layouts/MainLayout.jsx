import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";

const MainLayout = () => {
  return (
    // Đã thay đổi:
    // 1. bg-background-light -> bg-background-dark (Luôn dùng màu #121212)
    // 2. text-slate-900 -> text-white (Luôn dùng chữ trắng trên nền tối)
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-sans">
      <Header />

      <main className="flex-grow w-full pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
