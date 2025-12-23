import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common"; // Đảm bảo đường dẫn import đúng
import { authenticatedFetch, toUpperSafe } from "../../utils/helper"; // Helper tách dấu và xử lý chuỗi

// Form mặc định
const defaultForm = { name: "" };

/**
 * Modal Thêm / Sửa Tỉnh Thành
 */
const ProvinceModal = ({ open, onClose, onSubmit, initial }) => {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm({ name: initial?.name || "" });
    }
  }, [initial, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.warn("Vui lòng nhập tên Tỉnh / Thành");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 transition-all">
      <div className="bg-surface-dark border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-fade-in-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-1">
              {initial ? "Cập nhật" : "Tạo mới"}
            </p>
            <h3 className="text-xl font-bold text-white">Tỉnh / Thành phố</h3>
          </div>
          <button
            onClick={onClose}
            className="size-9 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase">
              Tên địa danh
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
              className="w-full bg-background-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/20"
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              autoFocus
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
          >
            Huỷ bỏ
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {initial ? "Lưu thay đổi" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Trang Quản lý Tỉnh Thành
 */
const Provinces = () => {
  // Data States
  const [allProvinces, setAllProvinces] = useState([]); // Lưu toàn bộ data để search client-side
  const [loading, setLoading] = useState(false);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Fetch Data (Load all once for client-side search)
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      // Gọi API lấy số lượng lớn (hoặc tất cả) để xử lý tìm kiếm ở client
      const res = await authenticatedFetch(
        `${SummaryApi.getProvinces.url}?page=1&size=200`
      );
      const data = await res.json();

      if (data?.success) {
        const rawItems = data.data?.items || [];
        // Map data chuẩn
        const normalized = rawItems.map((p) => ({
          id: p.id,
          name: p.name,
          cinemaCount: p.cinema_count || 0,
        }));
        setAllProvinces(normalized);
      } else {
        setAllProvinces([]);
        toast.error("Không tải được dữ liệu.");
      }
    } catch (err) {
      console.error("Fetch provinces error", err);
      toast.error("Lỗi kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  // 2. Logic Tìm kiếm & Phân trang (Client-side)
  const filteredData = useMemo(() => {
    if (!search.trim()) return allProvinces;
    const keyword = toUpperSafe(search);
    return allProvinces.filter((item) =>
      toUpperSafe(item.name).includes(keyword)
    );
  }, [search, allProvinces]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [page, filteredData, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  // Reset trang về 1 khi search thay đổi
  useEffect(() => {
    setPage(1);
  }, [search]);

  // 3. Handlers
  const handleOpenCreate = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setModalOpen(true);
  };

  const handleSave = async (formData) => {
    const payload = { name: formData.name.trim() };
    const isEdit = !!editingItem;

    try {
      const url = isEdit
        ? `${SummaryApi.updateProvince.url}/${editingItem.id}`
        : SummaryApi.createProvince.url;
      const method = isEdit
        ? SummaryApi.updateProvince.method
        : SummaryApi.createProvince.method;

      const res = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data?.success) {
        toast.success(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
        setModalOpen(false);
        fetchProvinces(); // Reload data
      } else {
        toast.error(data?.message || "Thao tác thất bại.");
      }
    } catch (err) {
      console.error("Save error", err);
      toast.error("Đã xảy ra lỗi.");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa "${item.name}"?`)) return;

    try {
      const res = await authenticatedFetch(
        `${SummaryApi.deleteProvince.url}/${item.id}`,
        { method: SummaryApi.deleteProvince.method }
      );
      const data = await res.json();

      if (data?.success) {
        toast.success("Đã xóa thành công.");
        fetchProvinces();
      } else {
        toast.error(data?.message || "Xóa thất bại.");
      }
    } catch (err) {
      console.error("Delete error", err);
      toast.error("Lỗi khi xóa.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background-dark text-white font-display">
      {/* Header Page */}
      <div className="h-20 border-b border-white/10 bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 sticky top-0 z-20">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/50 font-bold mb-1">
            Quản lý hệ thống
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Tỉnh / Thành phố
          </h2>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 active:scale-95 group"
        >
          <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">
            add
          </span>
          Thêm mới
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* Search Bar */}
        <div className="mb-6 max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-primary transition-colors">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-dark border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-white/30 shadow-sm"
              placeholder="Tìm kiếm tỉnh thành..."
              type="text"
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-surface-dark border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col min-h-[400px]">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02] text-xs uppercase tracking-wider text-white/50 border-b border-white/10">
                  <th className="px-6 py-4 font-bold text-center w-24">ID</th>
                  <th className="px-6 py-4 font-bold">Tên địa danh</th>
                  <th className="px-6 py-4 font-bold text-right w-40">
                    Thao tác
                  </th>
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
                ) : paginatedData.length === 0 ? (
                  // Empty State
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-12 text-center text-white/40 flex flex-col items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">
                        location_off
                      </span>
                      <p>Không tìm thấy dữ liệu phù hợp.</p>
                    </td>
                  </tr>
                ) : (
                  // Data Rows
                  paginatedData.map((item) => (
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
                            {/* Chỉ hiển thị nếu có rạp, bỏ text "Chưa có rạp" */}
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
                            onClick={() => handleOpenEdit(item)}
                            className="size-9 rounded-lg bg-white/5 hover:bg-primary/10 hover:text-primary text-white/70 flex items-center justify-center transition-colors"
                            title="Chỉnh sửa"
                          >
                            <span className="material-symbols-outlined text-lg">
                              edit
                            </span>
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
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

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="p-4 border-t border-white/10 flex items-center justify-between bg-white/[0.02]">
              <span className="text-xs text-white/50">
                Hiển thị{" "}
                <b className="text-white">{(page - 1) * pageSize + 1}</b> -{" "}
                <b className="text-white">
                  {Math.min(page * pageSize, filteredData.length)}
                </b>{" "}
                trong tổng <b className="text-white">{filteredData.length}</b>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="size-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_left
                  </span>
                </button>
                <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-white">
                  {page}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="size-8 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <span className="material-symbols-outlined text-sm">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ProvinceModal
        open={modalOpen}
        initial={editingItem}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
      />
    </div>
  );
};

export default Provinces;
