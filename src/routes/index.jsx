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
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <Home /> },
          { path: "login", element: <Login /> },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [],
      },
    ],
  },
]);

export default router;
