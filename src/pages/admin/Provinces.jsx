import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import { authenticatedFetch, toUpperSafe } from "../../utils/helper";

// Import Components
import ProvinceTable from "../../components/admin/Provinces/ProvinceTable";
import ProvinceModal from "../../components/admin/Provinces/ProvinceModal";
import ProvinceFilter from "../../components/admin/Provinces/ProvinceFilter";

const Provinces = () => {
  // Data States
  const [allProvinces, setAllProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter & Pagination States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 1. Fetch Data
  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch(
        `${SummaryApi.getProvinces.url}?page=1&size=200`
      );
      const data = await res.json();

      if (data?.success) {
        const rawItems = data.data?.items || [];
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

  // 2. Logic Filter & Pagination
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
        fetchProvinces();
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
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <ProvinceFilter
          search={search}
          onSearchChange={setSearch}
          onAdd={handleOpenCreate}
        />

        <div className="flex flex-col gap-4">
          <ProvinceTable
            data={paginatedData}
            loading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />

          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="p-4 bg-surface-dark border border-white/10 rounded-2xl flex items-center justify-between animate-fade-in-up">
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
