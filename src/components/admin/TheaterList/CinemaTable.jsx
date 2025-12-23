import React from "react";
import { formatDateTime } from "../../../utils/helper";

const CinemaTable = ({ cinemas, loading, onEdit, onDelete, deletingId }) => {
  if (loading) {
    return (
      <div className="p-8 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!cinemas.length) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-white/40">
        <span className="material-symbols-outlined text-5xl mb-2 opacity-50">
          theater_comedy
        </span>
        <p>Không tìm thấy rạp nào.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-white/[0.02] border-b border-white/10 text-xs uppercase tracking-wider text-white/50">
            <th className="px-6 py-4 font-semibold text-center w-20">ID</th>
            <th className="px-6 py-4 font-semibold">Thông tin Rạp</th>
            <th className="px-6 py-4 font-semibold">Địa chỉ</th>
            <th className="px-6 py-4 font-semibold w-32">Khu vực</th>
            <th className="px-6 py-4 font-semibold text-center w-24">Ảnh</th>
            <th className="px-6 py-4 font-semibold text-right w-32">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
          {cinemas.map((cinema) => {
            const primaryImg = cinema?.image_urls?.[0];
            return (
              <tr
                key={cinema.id}
                className="group hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4 text-center">
                  <span className="font-mono text-white/40">#{cinema.id}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 relative group-hover:border-primary/30 transition-colors">
                      {primaryImg ? (
                        <img
                          src={primaryImg}
                          alt={cinema.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20">
                          <span className="material-symbols-outlined">
                            image
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-white group-hover:text-primary transition-colors">
                        {cinema.name}
                      </h4>
                      <p className="text-xs text-white/40 mt-0.5">
                        Ngày tạo: {formatDateTime(cinema.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/70 max-w-xs">
                  <p
                    className="line-clamp-2 leading-relaxed"
                    title={cinema.address}
                  >
                    {cinema.address}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
                    {cinema?.Province?.name || "—"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-white/50 text-xs font-medium bg-white/5 px-2 py-1 rounded">
                    {cinema?.image_urls?.length || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => onEdit(cinema)}
                      className="size-9 rounded-lg bg-white/5 hover:bg-primary hover:text-white text-white/60 flex items-center justify-center transition-all shadow-sm"
                      title="Chỉnh sửa"
                    >
                      <span className="material-symbols-outlined text-lg">
                        edit
                      </span>
                    </button>
                    <button
                      disabled={deletingId === cinema.id}
                      onClick={() => onDelete(cinema)}
                      className="size-9 rounded-lg bg-white/5 hover:bg-danger hover:text-white text-white/60 flex items-center justify-center transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Xoá"
                    >
                      {deletingId === cinema.id ? (
                        <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-lg">
                          delete
                        </span>
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CinemaTable;
