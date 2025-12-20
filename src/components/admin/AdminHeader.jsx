export default function AdminHeader() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-white/10 bg-background-dark/50 px-8 backdrop-blur-md">
      {/* Mobile left */}
      <div className="flex items-center gap-4 md:hidden">
        <button className="text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="text-lg font-bold text-white">CineAdmin</h2>
      </div>

      {/* Search */}
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
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full bg-surface-dark text-white hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background-dark"></span>
        </button>

        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-white">Admin Quản trị</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>

          <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-primary">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB90K3QwAqWAmwWUAv0gLg8IZ4oSInhoMfVgmPPysyLhgmkFzQG-Nmr6r63mVupGGwj8ZAAHYLI_vhXcFLLzD2SZLM522-X9E270K5c70mkeQWJrZDSTrXFIshFAKWn4FE8aB5g0YcjpjfMAI8D7_cxzUlnuZ1HaCeJyDGEFqYwyNeHiS7Z0oZRN4N-sXoFiQZd2xh6npqg8c1wftxrzzqbgL7OkIJC7C_JqRXMrHxHHP2i5YMfbO8632TSWSCluw2529kN9PC08rU"
              alt="Admin Avatar"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
