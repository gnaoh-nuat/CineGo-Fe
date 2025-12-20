import React from 'react';

export default function MovieTable({ movies, loading, pagination, fetchMovies, getStatusInfo }) {
  return (
    <div className="rounded-3xl bg-surface-dark border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-surface-light/50 text-xs uppercase font-bold">
            <tr>
              <th className="px-6 py-4 text-center">ID</th>
              <th className="px-6 py-4">Phim</th>
              <th className="px-6 py-4 text-center">Thời lượng</th>
              <th className="px-6 py-4">Đạo diễn</th>
              <th className="px-6 py-4">Ngày phát hành</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="7" className="p-10 text-center">Đang tải dữ liệu...</td></tr>
            ) : movies.map((movie) => {
              const status = getStatusInfo(movie.status);
              return (
                <tr key={movie.id} className="hover:bg-white/5 group">
                  <td className="px-6 py-4 text-center font-mono text-xs">{movie.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={movie.poster_urls?.[0]} 
                        className="h-12 w-10 rounded object-cover bg-gray-800"
                        alt={movie.title}
                      />
                      <div>
                        <span className="text-white font-bold block group-hover:text-primary">{movie.title}</span>
                        <span className="text-[10px] text-gray-500 uppercase">{movie.genres?.[0]?.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-white">{movie.duration_minutes} phút</td>
                  <td className="px-6 py-4">{movie.director?.name || "N/A"}</td>
                  <td className="px-6 py-4">{new Date(movie.release_date).toLocaleDateString('vi-VN')}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      status.color === 'success' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* Actions (edit/delete) can go here */}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Phân trang thực tế */}
      <div className="flex items-center justify-between p-4 border-t border-white/5">
        <span className="text-xs text-gray-500">Tổng cộng {pagination.totalItems} phim</span>
        <div className="flex gap-2">
           <button 
             onClick={() => fetchMovies(pagination.page - 1)}
             disabled={pagination.page === 1}
             className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30"
           >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
           </button>
           <span className="flex items-center px-3 text-xs font-bold text-white bg-primary rounded-full">
             {pagination.page}
           </span>
           <button 
             onClick={() => fetchMovies(pagination.page + 1)}
             disabled={pagination.page === pagination.totalPages}
             className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center disabled:opacity-30"
           >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
           </button>
        </div>
      </div>
    </div>
  );
}
