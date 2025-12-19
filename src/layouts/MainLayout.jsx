import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/User/Header";
import Footer from "../components/User/Footer";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display">
      <Header />

      <main className="flex-grow w-full pt-20">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
