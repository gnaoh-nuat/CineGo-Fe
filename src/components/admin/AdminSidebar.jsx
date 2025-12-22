// src/components/admin/AdminSidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-background-dark p-6">
      <h1 className="text-2xl font-black text-white mb-8 tracking-tight">CineAdmin</h1>

      <nav className="flex flex-col gap-2">
        {/* Dashboard */}
        <NavLink
          to="/admin"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
            ${isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-lg">dashboard</span>
          Dashboard
        </NavLink>

        {/* Menu Phim với Dropdown khi Hover */}
        <div className="group relative">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-400 group-hover:bg-white/5 group-hover:text-white transition cursor-pointer">
            <span className="material-symbols-outlined text-lg">theaters</span>
            <span className="flex-1">Phim</span>
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-180">
              expand_more
            </span>
          </div>

          {/* Submenu container */}
          <div className="hidden group-hover:block pb-2 pt-1 animate-in fade-in slide-in-from-top-2 duration-200">
            <NavLink
              to="/admin/movies"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                  isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${window.location.pathname === '/admin/movies' ? 'bg-primary' : 'bg-white/20'}`}></span>
              Danh sách phim
            </NavLink>

            <NavLink
              to="/admin/genres"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                  isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${window.location.pathname === '/admin/genres' ? 'bg-primary' : 'bg-white/20'}`}></span>
              Thể loại
            </NavLink>

            <NavLink
              to="/admin/artists"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl pl-12 pr-4 py-2 text-sm transition-colors ${
                  isActive ? "text-primary font-bold bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <span className={`h-1.5 w-1.5 rounded-full transition-colors ${window.location.pathname === '/admin/actors' ? 'bg-primary' : 'bg-white/20'}`}></span>
              Nghệ sĩ
            </NavLink>
          </div>
        </div>

        {/* Các mục menu khác */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
            ${isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-lg">receipt_long</span>
          Đơn hàng
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
            ${isActive ? "bg-primary text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`
          }
        >
          <span className="material-symbols-outlined text-lg">group</span>
          Người dùng
        </NavLink>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6 border-t border-white/10">
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
}

export default AdminSidebar;