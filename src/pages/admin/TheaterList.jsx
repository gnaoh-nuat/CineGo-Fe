import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import { getPaginationRange } from "../../utils/helper";
import CinemaFilter from "../../components/admin/TheaterList/CinemaFilter";
import CinemaTable from "../../components/admin/TheaterList/CinemaTable";
import CinemaFormModal from "../../components/admin/TheaterList/CinemaFormModal";

const TheaterList = () => {
  // --- Data States ---
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [provinceOptions, setProvinceOptions] = useState([]);

  // --- Filter States ---
  const [provinceId, setProvinceId] = useState("");
  const [search, setSearch] = useState("");

  // --- Modal States ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const token = localStorage.getItem("accessToken");

  // 1. Fetch Provinces
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await fetch(
          `${SummaryApi.getProvinces.url}?page=1&size=200`
        );
        const data = await res.json();
        if (data?.success) setProvinceOptions(data?.data?.items || []);
      } catch (err) {
        console.error("Load provinces failed", err);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Fetch Cinemas
  const fetchCinemas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, size });
      if (provinceId) params.append("province_id", provinceId);
      if (search) params.append("search", search);

      const res = await fetch(
        `${SummaryApi.getCinemas.url}?${params.toString()}`
      );
      const data = await res.json();

      if (data?.success) {
        setCinemas(data?.data?.items || []);
        setTotalPages(data?.data?.totalPages || 1);
      } else {
        setCinemas([]);
      }
    } catch (err) {
      console.error("Load cinemas failed", err);
      setCinemas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, provinceId, search]);

  // --- Handlers ---
  const handleCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleEdit = (cinema) => {
    setEditing(cinema);
    setModalOpen(true);
  };

  const handleDelete = async (cinema) => {
    if (!cinema?.id || !window.confirm(`Xóa rạp "${cinema.name}"?`)) return;
    setDeletingId(cinema.id);
    try {
      const res = await fetch(`${SummaryApi.deleteCinema.url}/${cinema.id}`, {
        method: SummaryApi.deleteCinema.method,
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.success) {
        fetchCinemas();
      } else {
        alert(data?.message || "Xóa thất bại");
      }
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    // Container chính: Full chiều cao, Flex cột
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] w-full bg-background-dark text-white font-display">
      {/* Header: Sticky top, không bị đè */}
      <div className="h-20 shrink-0 border-b border-white/10 bg-background-dark/90 backdrop-blur-md flex items-center justify-between px-6 md:px-8 z-20">
        <div>
          <p className="text-xs uppercase tracking-[0.08em] text-white/50 mb-1 font-semibold">
            Quản lý hệ thống
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Danh sách Rạp
          </h1>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Thêm rạp
        </button>
      </div>

      {/* Content: Scroll riêng biệt */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
        {/* Component Filter */}
        <CinemaFilter
          search={search}
          setSearch={setSearch}
          provinceId={provinceId}
          setProvinceId={setProvinceId}
          provinceOptions={provinceOptions}
          setPage={setPage}
        />

        {/* Component Table */}
        <div className="bg-surface-dark border border-white/10 rounded-3xl overflow-hidden shadow-xl animate-fade-in-up">
          <CinemaTable
            cinemas={cinemas}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-2 animate-fade-in-up pb-8">
            {getPaginationRange(page, totalPages).map((item, idx) => {
              if (item === "DOTS")
                return (
                  <span key={idx} className="px-3 py-1 text-white/40">
                    ...
                  </span>
                );
              return (
                <button
                  key={idx}
                  onClick={() => setPage(item)}
                  className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-all ${
                    item === page
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Component Modal */}
      {modalOpen && (
        <CinemaFormModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          editingCinema={editing}
          provinces={provinceOptions}
          onSuccess={() => {
            setModalOpen(false);
            fetchCinemas();
          }}
          token={token}
        />
      )}
    </div>
  );
};

export default TheaterList;
