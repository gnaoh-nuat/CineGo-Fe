import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import Login from "../pages/Login";
import Home from "../pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // === NHÁNH USER & PUBLIC (Chứa trang Login) ===
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "", element: <Home /> },
          { path: "login", element: <Login /> },
        ],
      },

      // === NHÁNH ADMIN (Riêng biệt) ===
      {
        path: "admin",
        element: <AdminLayout />,
        children: [{}],
      },
    ],
  },
]);

export default router;
