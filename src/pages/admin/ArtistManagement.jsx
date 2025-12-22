// src/pages/admin/ArtistManagement.jsx
import React, { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import MovieTable from '@/components/admin/MovieTable'; // Tái sử dụng logic Table
import ArtistFormModal from '@/components/admin/ArtistFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  
  const [stats, setStats] = useState({ total: 0, actors: 0, directors: 0 });
  const [pagination, setPagination] = useState({ page: 1, size: 10, totalPages: 0, totalItems: 0 });

  // 1. Lấy danh sách nghệ sĩ (Giả sử API tương tự Movie)
  const fetchArtists = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${SummaryApi.getMovies.url.replace('movies', 'artists')}?page=${page}&size=${pagination.size}`);
      const dataResponse = await response.json();
      if (dataResponse.success) {
        setArtists(dataResponse.data.items);
        setPagination(prev => ({ ...prev, ...dataResponse.data }));
      }
    } catch (error) {
      console.error("Error fetching artists", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
    // fetchStats(); // Gọi hàm lấy thống kê tương tự như phần Phim
  }, []);

  const handleAddNew = () => {
    setSelectedArtist(null);
    setIsModalOpen(true);
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
  };

  const handleDeleteArtist = async (id, name) => {
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa nghệ sĩ "${name}"? Hành động này không thể hoàn tác.`);
    if (!confirmDelete) return;

    try {
      const response = await authenticatedFetch(`${SummaryApi.deleteMovie.url.replace('movies', 'artists')}/${id}`, {
        method: SummaryApi.deleteMovie.method.toUpperCase(),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      if (response.status === 200 || result.success) {
        alert('Đã xóa nghệ sĩ thành công!');
        fetchArtists(pagination.page);
        // Optionally refresh stats
      } else if (response.status === 404) {
        alert('Lỗi: Nghệ sĩ không tồn tại hoặc đã bị xóa trước đó.');
      } else {
        alert('Xóa thất bại: ' + (result.message || 'Lỗi hệ thống'));
      }
    } catch (error) {
      console.error('Lỗi khi xóa nghệ sĩ:', error);
      alert('Không thể kết nối đến máy chủ để thực hiện lệnh xóa.');
    }
  };

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Nghệ sĩ</h2>
        <button 
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-primary hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-primary/20"
        >
          <span className="material-symbols-outlined">add</span> Thêm Nghệ sĩ Mới
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng số nghệ sĩ" value="324" icon="groups" color="primary" />
        <StatCard title="Diễn viên" value="280" icon="theater_comedy" color="blue" />
        <StatCard title="Đạo diễn" value="44" icon="videocam" color="purple" />
      </div>

      {/* Table Section */}
      <div className="">
        {/* Search Bar */}
        <div className="p-6 border-b border-white/5">
          <div className="relative w-full md:w-80">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
            <input 
              className="w-full bg-surface/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary outline-none transition-all" 
              placeholder="Tìm kiếm nghệ sĩ..." 
              type="text"
            />
          </div>
        </div>

        {/* Reuse generic MovieTable for artists by providing items + renderRow */}
        <MovieTable
          items={artists}
          loading={loading}
          pagination={pagination}
          fetchMovies={fetchArtists}
          headers={["Mã", "Ảnh", "Họ tên", "Loại", "Hành động"]}
          onEdit={handleEdit}
          onDelete={(id, name) => handleDeleteArtist(id, name)}
          renderRow={(artist) => (
            <>
              <td className="px-6 py-4 text-center font-mono text-xs text-gray-500">{artist.id}</td>
              <td className="px-6 py-4">
                <div 
                  className="size-12 rounded-lg bg-surface bg-center bg-cover border border-white/10"
                  style={{ backgroundImage: `url(${artist.image_url})` }}
                ></div>
              </td>
              <td className="px-6 py-4">
                <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">{artist.name}</h4>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                  artist.type === 'director' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                }`}>
                  {artist.type === 'director' ? 'Đạo diễn' : 'Diễn viên'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button onClick={() => handleEdit(artist)} className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button onClick={() => handleDeleteArtist(artist.id, artist.name)} className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </td>
            </>
          )}
        />
      </div>

      <ArtistFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editData={selectedArtist}
      />
    </div>
  );
};

export default ArtistManagement;