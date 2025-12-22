import { useAuth } from "../../context/AuthContext";

export default function AdminHeader() {
  const { user } = useAuth();

  const displayName = user?.full_name || user?.email || "Admin";
  const displayRole = user?.role || "Super Admin";
  const avatarUrl = user?.avatar || user?.image_url;
  const initials = (displayName || "A").charAt(0).toUpperCase();

  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-background-dark/50 px-8 backdrop-blur-md">
      {/* Mobile left */}
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-white">CineAdmin</h2>
      </div>

      {/* Search
      <div className="hidden md:flex flex-1 max-w-lg">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm phim, đơn hàng, khách hàng..."
            className="h-12 w-full rounded-full border-none bg-surface-dark pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
      </div> */}

      {/* Right: account info */}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">{displayName}</p>
            <p className="text-xs text-gray-400">{displayRole}</p>
          </div>

          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary bg-surface-dark flex items-center justify-center">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Admin Avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-white">{initials}</span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
