import React from "react";

const ProvinceTable = ({ data, loading, onEdit, onDelete }) => {
  return (
    <div className="bg-surface-dark border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col min-h-[400px] animate-fade-in-up">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-xs uppercase tracking-wider text-white/50 border-b border-white/10">
              <th className="px-6 py-4 font-bold text-center w-24">ID</th>
              <th className="px-6 py-4 font-bold">Tên địa danh</th>
              <th className="px-6 py-4 font-bold text-right w-40">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {loading ? (
              // Skeleton Loading
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-6 w-8 bg-white/10 rounded mx-auto" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-32 bg-white/10 rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-8 w-16 bg-white/10 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-12 text-center text-white/40"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-4xl opacity-50">
                      location_off
                    </span>
                    <p>Không tìm thấy dữ liệu phù hợp.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-6 py-4 text-center">
                    <span className="text-white/40 font-mono text-xs bg-white/5 px-2 py-1 rounded">
                      #{item.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:border-primary/30 transition-all">
                        <span className="material-symbols-outlined text-xl">
                          location_city
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm group-hover:text-primary transition-colors">
                          {item.name}
                        </h4>
                        {item.cinemaCount > 0 && (
                          <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">
                              theater_comedy
                            </span>
                            {item.cinemaCount} cụm rạp
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button
                        onClick={() => onEdit(item)}
                        className="size-9 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary text-white/70 flex items-center justify-center transition-colors"
                        title="Chỉnh sửa"
                      >
                        <span className="material-symbols-outlined text-lg">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="size-9 rounded-lg bg-white/5 hover:bg-danger/10 hover:text-danger text-white/70 flex items-center justify-center transition-colors"
                        title="Xóa"
                      >
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProvinceTable;
