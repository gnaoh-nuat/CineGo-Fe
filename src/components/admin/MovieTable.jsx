import React from 'react';

// Generic table component that supports movie-specific UI by default
export default function MovieTable({
  movies, // legacy prop name
  items, // generic items prop
  loading,
  pagination,
  fetchMovies,
  getStatusInfo,
  onEdit,
  onDelete,
  renderRow, // optional - custom row renderer: (item) => <td>...</td>
  headers // optional - array of header labels
}) {
  const data = items ?? movies ?? [];

  const renderDefaultMovieRow = (movie) => {
    const status = getStatusInfo ? getStatusInfo(movie.status) : { color: 'success', label: 'Đang chiếu' };
    const statusClasses = status.color === 'success'
      ? 'bg-success/10 text-success border-success/20'
      : status.color === 'warning'
        ? 'bg-warning/10 text-warning border-warning/20'
        : 'bg-transparent text-gray-400 border-transparent';

    return (
      <>
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
          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusClasses}`}>
            {status.label}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            <button 
              onClick={() => onEdit && onEdit(movie)}
              className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors" 
              title="Chỉnh sửa"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button 
              onClick={() => onDelete && onDelete(movie.id, movie.title)}
              className="h-8 w-8 rounded-full bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors" 
              title="Xóa"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </td>
      </>
    );
  };

  return (
    <div className="rounded-3xl bg-surface-dark border border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-surface-light/50 text-xs uppercase font-bold">
            <tr>
              {(headers && headers.length > 0) ? (
                headers.map((h, idx) => (
                  <th key={idx} className={`px-6 py-4 ${idx === headers.length - 1 ? 'text-right' : ''} ${idx === 0 ? 'text-center' : ''}`}>{h}</th>
                ))
              ) : (
                <>
                <th className="px-6 py-4 text-center">ID</th>
                <th className="px-6 py-4">Phim</th>
                <th className="px-6 py-4 text-center">Thời lượng</th>
                <th className="px-6 py-4">Đạo diễn</th>
                <th className="px-6 py-4">Ngày phát hành</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={headers?.length || 7} className="p-10 text-center">Đang tải dữ liệu...</td></tr>
            ) : data.map((item) => (
              <tr key={item.id} className="hover:bg-white/5 group">
                {renderRow ? renderRow(item, { onEdit, onDelete }) : renderDefaultMovieRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-white/5">
        <span className="text-xs text-gray-500">Tổng cộng {pagination.totalItems}</span>
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
