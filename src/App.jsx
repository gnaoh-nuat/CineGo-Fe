import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./utils/ScrollToTop";

function App() {
  ScrollToTop();

  const location = useLocation();
  const navigate = useNavigate();

  // Redirect VNPAY return queries to dedicated handler
  useEffect(() => {
    const hasTxnRef = location.search.includes("vnp_TxnRef=");
    if (hasTxnRef && location.pathname !== "/payment/return") {
      navigate(`/payment/return${location.search}`, { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  return (
    <>
      {/* ToastContainer: Nơi hiển thị các popup thông báo góc màn hình */}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Outlet />
    </>
  );
}

export default App;
