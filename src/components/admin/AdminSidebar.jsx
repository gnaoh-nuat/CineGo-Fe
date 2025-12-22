// src/components/admin/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
    ${isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`;

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-background-dark p-6 overflow-y-auto">
      <h1 className="text-2xl font-black text-white mb-8 tracking-tight">CineAdmin</h1>

      <nav className="flex flex-col gap-2 flex-1">
        {/* Tổng quan (Dashboard) */}
        <NavLink to="/admin" end className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Tổng quan
        </NavLink>

        {/* Menu Phim với Dropdown */}
        <div className="group relative">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-400 group-hover:bg-white/5 group-hover:text-white transition cursor-pointer">
            <span className="material-symbols-outlined text-lg">movie_filter</span>
            <span className="flex-1">Phim</span>
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-180">
              expand_more
            </span>
          </div>

          <div className="hidden group-hover:block pb-2 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <NavLink to="/admin/movies" className={({ isActive }) => `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              Danh sách phim
            </NavLink>
            <NavLink to="/admin/genres" className={({ isActive }) => `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              Thể loại
            </NavLink>
            <NavLink to="/admin/people" className={({ isActive }) => `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              Nghệ sĩ
            </NavLink>
          </div>
        </div>

        {/* Rạp */}
        <NavLink to="/admin/theaters" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">theater_comedy</span>
          Rạp
        </NavLink>

        {/* Lịch chiếu */}
        <NavLink to="/admin/showtimes" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">calendar_month</span>
          Lịch chiếu
        </NavLink>

        {/* Đồ ăn */}
        <NavLink to="/admin/foods" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">fastfood</span>
          Đồ ăn
        </NavLink>

        {/* Voucher */}
        <NavLink to="/admin/vouchers" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">confirmation_number</span>
          Voucher
        </NavLink>

        {/* Check-in */}
        <NavLink to="/admin/checkin" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
          Check-in
        </NavLink>

        {/* Đơn hàng */}
        <NavLink to="/admin/orders" className={navLinkClass}>
          <span className="material-symbols-outlined text-lg">receipt_long</span>
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
          onClick={() => { logout(); navigate("/login"); }}
          className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;