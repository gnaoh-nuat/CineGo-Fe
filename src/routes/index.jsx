// src/routes/index.jsx

import { createBrowserRouter } from "react-router-dom";
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

import Dashboard from "../pages/admin/Dashboard";

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
          { path: "movies", element: <MovieSearch /> },
          { path: "my-tickets", element: <MyTickets /> },
          { path: "movie/:id", element: <MovieDetail /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [{ index: true, element: <Dashboard /> }],
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
