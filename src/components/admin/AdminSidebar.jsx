// src/components/admin/AdminSidebar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useMemo, useState } from "react";

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMovieRoute = useMemo(
    () =>
      location.pathname.startsWith("/admin/movies") ||
      location.pathname.startsWith("/admin/genres") ||
      location.pathname.startsWith("/admin/people"),
    [location.pathname]
  );

  const isTheaterRoute = useMemo(
    () =>
      location.pathname.startsWith("/admin/theaters") ||
      location.pathname.startsWith("/admin/rooms") ||
      location.pathname.startsWith("/admin/provinces"),
    [location.pathname]
  );

  const [openMovieMenu, setOpenMovieMenu] = useState(isMovieRoute);
  const [openTheaterMenu, setOpenTheaterMenu] = useState(isTheaterRoute);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
    ${
      isActive
        ? "bg-primary text-white shadow-lg shadow-primary/20"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-background-dark/95 backdrop-blur p-6 overflow-y-auto">
      <h1 className="text-2xl font-black text-white mb-8 tracking-tight">
        CineAdmin
      </h1>

      <nav className="flex flex-col gap-2 flex-1">
        {/* Tổng quan (Dashboard) */}
        <NavLink to="/admin" end className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Tổng quan
        </NavLink>

        <NavLink to="/admin/behaviors" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">analytics</span>
          Hành vi
        </NavLink>

        {/* Menu Phim với toggle (accessible, keyboard-friendly) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMovieMenu((prev) => !prev)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              openMovieMenu || isMovieRoute
                ? "bg-white/5 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            aria-expanded={openMovieMenu || isMovieRoute}
          >
            <span className="material-symbols-outlined text-lg">
              movie_filter
            </span>
            <span className="flex-1 text-left">Phim</span>
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                openMovieMenu || isMovieRoute ? "rotate-180" : "rotate-0"
              }`}
            >
              expand_more
            </span>
          </button>

          {(openMovieMenu || isMovieRoute) && (
            <div className="pb-2 pt-1 space-y-1">
              <NavLink
                to="/admin/movies"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Danh sách phim
              </NavLink>
              <NavLink
                to="/admin/genres"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Thể loại
              </NavLink>
              <NavLink
                to="/admin/people"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Nghệ sĩ
              </NavLink>
            </div>
          )}
        </div>

        {/* Menu Rạp */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenTheaterMenu((prev) => !prev)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              openTheaterMenu || isTheaterRoute
                ? "bg-white/5 text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            aria-expanded={openTheaterMenu || isTheaterRoute}
          >
            <span className="material-symbols-outlined text-lg">
              theater_comedy
            </span>
            <span className="flex-1 text-left">Rạp</span>
            <span
              className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${
                openTheaterMenu || isTheaterRoute ? "rotate-180" : "rotate-0"
              }`}
            >
              expand_more
            </span>
          </button>

          {(openTheaterMenu || isTheaterRoute) && (
            <div className="pb-2 pt-1 space-y-1">
              <NavLink
                to="/admin/theaters"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Danh sách rạp
              </NavLink>
              <NavLink
                to="/admin/rooms"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Phòng chiếu
              </NavLink>
              <NavLink
                to="/admin/provinces"
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                    isActive
                      ? "text-primary font-bold bg-white/5"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                Tỉnh / Thành
              </NavLink>
            </div>
          )}
        </div>

        {/* Lịch chiếu */}
        <NavLink to="/admin/showtimes" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">
            calendar_month
          </span>
          Lịch chiếu
        </NavLink>

        {/* Đồ ăn */}
        <NavLink to="/admin/foods" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">fastfood</span>
          Đồ ăn
        </NavLink>

        {/* Voucher */}
        <NavLink to="/admin/vouchers" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">
            confirmation_number
          </span>
          Voucher
        </NavLink>

        {/* Check-in */}
        <NavLink to="/admin/checkin" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">
            qr_code_scanner
          </span>
          Check-in
        </NavLink>

        {/* Đơn hàng */}
        <NavLink to="/admin/orders" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">
            receipt_long
          </span>
          Đơn hàng
        </NavLink>

        {/* Người dùng */}
        <NavLink to="/admin/users" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">group</span>
          Người dùng
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-8 pt-6 border-t border-white/10">
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
