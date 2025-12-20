import { NavLink } from "react-router-dom";

const menu = [
  { label: "Dashboard", icon: "dashboard", to: "/admin" },
  { label: "Phim", icon: "movie", to: "/admin/movies" },
  { label: "Đơn hàng", icon: "receipt_long", to: "/admin/orders" },
  { label: "Người dùng", icon: "group", to: "/admin/users" },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-white/10 bg-background-dark p-6">
      <h1 className="text-2xl font-black text-white mb-8">CineAdmin</h1>

      <nav className="flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
              ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="material-symbols-outlined text-lg">
              {item.icon}
            </span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
