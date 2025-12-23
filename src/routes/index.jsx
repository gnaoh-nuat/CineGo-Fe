import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import About from "../pages/About";
import MovieDetail from "../pages/MovieDetail";
import MovieSearch from "../pages/MovieSearch";
import MyTickets from "../pages/MyTickets";
import Theaters from "../pages/Theaters";
import Booking from "../pages/Booking";
import SeatSelection from "../pages/SeatSelection";
import Payment from "../pages/Payment";
import PaymentResult from "../pages/PaymentResult";
import PaymentReturn from "../pages/PaymentReturn";

import Dashboard from "../pages/admin/Dashboard";
import TheaterList from "../pages/admin/TheaterList";
import CinemaRooms from "../pages/admin/CinemaRooms";
import Provinces from "../pages/admin/Provinces";
import MovieManagement from "../pages/admin/MovieManagement";
import PeopleManagement from "@/pages/admin/PeopleManagement";
import GenreManagement from "@/pages/admin/GenreManagement";
import UserManagement from "@/pages/admin/UserManagement";
import VoucherManagement from "@/pages/admin/VoucherManagement";
import FoodManagement from "@/pages/admin/FoodManagement";
import OrderManagement from "@/pages/admin/OrderManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
          { path: "register", element: <Register /> },
          { path: "forgot-password", element: <ForgotPassword /> },
          { path: "profile", element: <Profile /> },
          { path: "about", element: <About /> },
          { path: "theaters", element: <Theaters /> },
          { path: "movies", element: <MovieSearch /> },
          { path: "my-tickets", element: <MyTickets /> },
          { path: "movie/:id", element: <MovieDetail /> },
          { path: "booking/:id", element: <Booking /> },
          { path: "seat/:id", element: <SeatSelection /> },
          { path: "payment/:id", element: <Payment /> },
          { path: "payment/return", element: <PaymentReturn /> },
          { path: "payment/result", element: <PaymentResult /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "movies", element: <MovieManagement /> },
          { path: "genres", element: <GenreManagement /> },
          { path: "people", element: <PeopleManagement /> },
          { path: "theaters", element: <TheaterList /> },
          { path: "rooms", element: <CinemaRooms /> },
          { path: "provinces", element: <Provinces /> },
          { path: "showtimes", element: <div>Quản lý Lịch chiếu</div> },
          { path: "foods", element: <FoodManagement /> },
          { path: "vouchers", element: <VoucherManagement /> },
          { path: "checkin", element: <div>Check-in vé</div> },
          { path: "orders", element: <OrderManagement /> },
          { path: "users", element: <UserManagement /> },
        ],
      },
      {
        path: "*",
        element: (
          <div className="p-10 text-center">404 - Trang không tồn tại</div>
        ),
      },
    ],
  },
]);

export default router;
