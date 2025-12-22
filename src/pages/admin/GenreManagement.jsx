import React, { useEffect, useState } from 'react';
import MovieTable from '@/components/admin/MovieTable';
import GenreFormModal from '@/components/admin/GenreFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const GenreManagement = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const [pagination, setPagination] = useState({ page: 1, size: 10, totalPages: 0, totalItems: 0 });

  const fetchGenres = async (page = 1) => {
    setLoading(true);
    try {
      const response = await authenticatedFetch(`${SummaryApi.getGenres.url}?page=${page}&size=${pagination.size}`);
      const data = await response.json();
      if (data.success) {
        setGenres(data.data.items);
        setPagination(prev => ({ ...prev, ...data.data }));
      }
    } catch (error) {
      console.error('Error fetching genres', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleAddNew = () => {
    setSelectedGenre(null);
    setIsModalOpen(true);
  };

  const handleEdit = (genre) => {
    setSelectedGenre(genre);
    setIsModalOpen(true);
  };

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

      const result = await response.json();
      if (response.status === 200 || response.status === 201 || result.success) {
        alert(isEdit ? 'Cập nhật thể loại thành công!' : 'Thêm thể loại thành công!');
        setIsModalOpen(false);
        fetchGenres(pagination.page);
      } else if (response.status === 409) {
        alert('Lỗi: Thể loại đã tồn tại.');
      } else {
        alert('Có lỗi xảy ra: ' + (result.message || 'Lỗi hệ thống'));
      }
    } catch (error) {
      console.error('Error saving genre', error);
      alert('Không thể kết nối đến server.');
    }
  };

  const handleDeleteGenre = async (id, name) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa thể loại "${name}"? Hành động này không thể hoàn tác.`);
    if (!confirmDelete) return;

    try {
      const response = await authenticatedFetch(`${SummaryApi.deleteGenre.url}/${id}`, {
        method: SummaryApi.deleteGenre.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (response.status === 200 || result.success) {
        alert('Đã xóa thể loại thành công!');
        fetchGenres(pagination.page);
      } else if (response.status === 404) {
        alert('Lỗi: Thể loại không tồn tại.');
      } else {
        alert('Xóa thất bại: ' + (result.message || 'Lỗi hệ thống'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa thể loại:', error);
      alert('Không thể kết nối đến máy chủ.');
    }
  };

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Thể loại</h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input className="w-full bg-surface/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary outline-none transition-all" placeholder="Tìm kiếm thể loại..." type="text" />
          </div>
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined">add</span> Thêm Thể loại Mới
          </button>
        </div>
      </div>

      <MovieTable
        items={genres}
        loading={loading}
        pagination={pagination}
        fetchMovies={fetchGenres}
        headers={["Mã định danh", "Tên thể loại", "Hành động"]}
        onEdit={handleEdit}
        onDelete={(id, name) => handleDeleteGenre(id, name)}
        renderRow={(genre) => (
          <>
            <td className="px-6 py-4">
              <span className="font-mono text-gray-400">{genre.id}</span>
            </td>
            <td className="px-6 py-4">
              <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">{genre.name}</h4>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button title="Chỉnh sửa" onClick={() => handleEdit(genre)} className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button title="Xóa" onClick={() => handleDeleteGenre(genre.id, genre.name)} className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors">
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
