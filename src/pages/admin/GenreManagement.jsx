// src/pages/admin/GenreManagement.jsx
import React, { useEffect, useState, useRef } from 'react';
import MovieTable from '@/components/admin/MovieTable';
import GenreFormModal from '@/components/admin/GenreFormModal';
import SearchBar from '@/components/admin/SearchBar';
import SummaryApi from '@/common';
import AddNewButton from '@/components/admin/AddNewButton';
import { authenticatedFetch } from '@/utils/helper';

const GenreManagement = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, size: 10, totalPages: 0, totalItems: 0 });

  // Nguồn dữ liệu gốc từ API để thực hiện lọc và phân trang tại Client
  const [allGenres, setAllGenres] = useState([]);
  const isFirstSearchRun = useRef(true);

  // 1. Hàm lấy toàn bộ danh sách thể loại từ Backend
  const fetchGenres = async (page = 1) => {
    setLoading(true);
    try {
      // Chỉ fetch từ API nếu mảng allGenres đang trống
      if (allGenres.length === 0) {
        const response = await authenticatedFetch(SummaryApi.getGenres.url);
        const result = await response.json();
        
        // Truy xuất đúng đường dẫn data.genres từ JSON bạn cung cấp
        if (result.success && Array.isArray(result.data?.genres)) {
          setAllGenres(result.data.genres);
          processLocalData(result.data.genres, page);
        }
      } else {
        processLocalData(allGenres, page);
      }
    } catch (error) {
      console.error('Lỗi khi tải thể loại:', error);
    } finally {
      setLoading(false);
    }
  };

  // Force-fetch fresh genres from server and update state (used after mutations)
  const fetchAllGenresFromServer = async (page = 1) => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(SummaryApi.getGenres.url);
      const result = await response.json();
      if (result.success && Array.isArray(result.data?.genres)) {
        setAllGenres(result.data.genres);
        processLocalData(result.data.genres, page);
      } else {
        setAllGenres([]);
        processLocalData([], page);
      }
    } catch (error) {
      console.error('Error fetching genres from server:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Logic xử lý tìm kiếm và phân trang tại Client
  const processLocalData = (source, page) => {
    const term = searchQuery.trim().toLowerCase();
    const filtered = term 
      ? source.filter(g => g.name.toLowerCase().includes(term)) 
      : source;

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / pagination.size) || 1;
    const start = (page - 1) * pagination.size;
    const items = filtered.slice(start, start + pagination.size);

    setGenres(items);
    setPagination(prev => ({ ...prev, page, totalPages, totalItems }));
  };

  useEffect(() => {
    fetchAllGenresFromServer(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Debounce tìm kiếm để tăng hiệu năng
  useEffect(() => {
    if (isFirstSearchRun.current) {
      isFirstSearchRun.current = false;
      return;
    }
    const t = setTimeout(() => processLocalData(allGenres, 1), 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // 4. Xử lý Thêm/Sửa
  const handleSaveGenre = async (rawData) => {
    try {
      const isEdit = !!selectedGenre;
      const url = isEdit ? `${SummaryApi.updateGenre.url}/${selectedGenre.id}` : SummaryApi.createGenre.url;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rawData),
      });

      if (response.ok) {
        alert(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalOpen(false);
        // Force refresh from server so UI updates immediately
        await fetchAllGenresFromServer(1);
      }
    } catch (error) {
      alert('Lỗi kết nối server.');
    }
  };

  // 5. Xử lý Xóa
  const handleDeleteGenre = async (id, name) => {
    if (!window.confirm(`Xóa thể loại "${name}"?`)) return;
    try {
      const response = await authenticatedFetch(`${SummaryApi.deleteGenre.url}/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // Force refresh from server so UI updates immediately
        await fetchAllGenresFromServer(1);
      }
    } catch (error) {
      alert('Không thể xóa thể loại.');
    }
  };

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Thể loại</h2>
        <div className="flex items-center gap-2">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Tìm kiếm thể loại..." />
          <AddNewButton onClick={() => { setSelectedGenre(null); setIsModalOpen(true); }} label="Thêm Thể loại" />
        </div>
      </div>

      {/* Tái sử dụng MovieTable với headers tùy chỉnh */}
      <MovieTable
        items={genres}
        loading={loading}
        pagination={pagination}
        fetchMovies={fetchGenres}
        headers={["ID", "Tên thể loại", "Hành động"]}
        renderRow={(genre) => (
          <>
            <td className="px-6 py-4 text-center font-mono text-gray-500 text-xs">{genre.id}</td>
            <td className="px-6 py-4">
              <span className="font-bold text-white group-hover:text-primary transition-colors">{genre.name}</span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button onClick={() => { setSelectedGenre(genre); setIsModalOpen(true); }} className="size-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => handleDeleteGenre(genre.id, genre.name)} className="size-8 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </td>
          </>
        )}
      />

      <GenreFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveGenre} editData={selectedGenre} />
    </div>
  );
};

export default GenreManagement;