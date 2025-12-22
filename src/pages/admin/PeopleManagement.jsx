import React, { useEffect, useState, useRef } from 'react';
import StatCard from '@/components/admin/StatCard';
import MovieTable from '@/components/admin/MovieTable';
import SearchBar from '@/components/admin/SearchBar';
import AddNewButton from '@/components/admin/AddNewButton';
import PeopleFormModal from '@/components/admin/PeopleFormModal';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const PeopleManagement = () => {
  const [people, setPeople] = useState([]);
  const [allPeople, setAllPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [pagination, setPagination] = useState({ 
    page: 1, 
    size: 10, 
    totalPages: 0, 
    totalItems: 0 
  });

  const [stats, setStats] = useState({ total: 0, actors: 0, directors: 0 });

  // 1. Hàm lấy danh sách nghệ sĩ từ Server (hỗ trợ phân trang và tìm kiếm)
  //    Khi tìm kiếm, API có thể không hỗ trợ tìm kiếm 'contains' => chúng ta
  //    fetch toàn bộ dữ liệu một lần và lọc cục bộ để hỗ trợ tìm kiếm "partial match".
  const processLocalData = (source, page = 1) => {
    const term = (searchQuery || '').trim().toLowerCase();
    const filtered = term ? source.filter(p => (p.name || '').toLowerCase().includes(term)) : source;

    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pagination.size));
    const start = (page - 1) * pagination.size;
    const items = filtered.slice(start, start + pagination.size);

    setPeople(items);
    setPagination(prev => ({ ...prev, page, size: pagination.size, totalPages, totalItems }));
  };

  const fetchAllPeopleFromServer = async () => {
    setLoading(true);
    try {
      const firstResp = await fetch(`${SummaryApi.getPeoples.url}?page=1&size=${pagination.size}`);
      const firstData = await firstResp.json();
      if (!firstData.success) {
        setAllPeople([]);
        setPeople([]);
        setPagination({ page: 1, size: pagination.size, totalPages: 0, totalItems: 0 });
        return;
      }

      let all = [...firstData.data.items];
      const totalPagesFromApi = firstData.data.totalPages ?? 1;
      for (let p = 2; p <= totalPagesFromApi; p++) {
        const resp = await fetch(`${SummaryApi.getPeoples.url}?page=${p}&size=${pagination.size}`);
        const d = await resp.json();
        if (d.success) all.push(...d.data.items);
      }

      setAllPeople(all);
      processLocalData(all, 1);
    } catch (error) {
      console.error("Lỗi khi tải danh sách nghệ sĩ (toàn bộ):", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPeople = async (page = 1, search = '') => {
    setLoading(true);
    try {
      if (search) {
        // Use client-side filtering for partial matches
        if (allPeople.length === 0) {
          await fetchAllPeopleFromServer();
        }
        processLocalData(allPeople.length ? allPeople : [], page);
        return;
      }

      // Normal server-side paginated fetch when not searching
      let url = `${SummaryApi.getPeoples.url}?page=${page}&size=${pagination.size}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setPeople(result.data.items);
        setPagination({
          page: result.data.page,
          size: result.data.size,
          totalPages: result.data.totalPages,
          totalItems: result.data.totalItems
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách nghệ sĩ:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Gọi song song 2 API để lấy số lượng
      const [actorRes, directorRes] = await Promise.all([
        fetch(`${SummaryApi.getPeoples.url}?size=1&type=ACTOR`),
        fetch(`${SummaryApi.getPeoples.url}?size=1&type=DIRECTOR`)
      ]);

      const actorResult = await actorRes.json();
      const directorResult = await directorRes.json();

      if (actorResult.success && directorResult.success) {
        setStats({
          total: actorResult.data.totalItems + directorResult.data.totalItems,
          actors: actorResult.data.totalItems,
          directors: directorResult.data.totalItems
        });
      }
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  // 2. Xử lý tìm kiếm với Debounce (400ms)
  const isFirstSearchRun = useRef(true);
  useEffect(() => {
  // Lần đầu tiên component mount
  if (isFirstSearchRun.current) {
    isFirstSearchRun.current = false;
    fetchPeople(1, ''); // Tải danh sách trang 1
    fetchStats();      // Tải số liệu thống kê cho StatCards
    return;
  }
  
  // Các lần thay đổi searchQuery tiếp theo (Debounce search)
  const t = setTimeout(() => {
    fetchPeople(1, searchQuery);
  }, 400);

  return () => clearTimeout(t);
}, [searchQuery]);

  // 3. Xử lý Thêm/Sửa Nghệ sĩ
  const handleSavePerson = async (formData) => {
    try {
      const isEdit = !!selectedPerson;
      const url = isEdit 
        ? `${SummaryApi.updatePeoples.url}/${selectedPerson.id}` 
        : SummaryApi.createPeoples.url;
      const method = isEdit ? 'PUT' : 'POST';

      // Map dữ liệu form sang body API (person_type thay vì type)
      const bodyData = {
        name: formData.name,
        person_type: formData.type,
        image_url: formData.image_url,
        bio: formData.bio
      };

      const response = await authenticatedFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      if (response.ok || result.success) {
        alert(isEdit ? 'Cập nhật thành công!' : 'Thêm mới thành công!');
        setIsModalOpen(false);
        // Tải lại dữ liệu mới nhất từ server
        fetchPeople(pagination.page, searchQuery);
      } else {
        alert('Thao tác thất bại: ' + result.message);
      }
    } catch (error) {
      console.error("Lỗi khi lưu nghệ sĩ:", error);
      alert('Không thể kết nối đến server.');
    }
  };

  // 4. Xử lý Xóa Nghệ sĩ
  const handleDeletePerson = async (id, name) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa nghệ sĩ "${name}"?`)) return;

    try {
      const response = await authenticatedFetch(`${SummaryApi.deletePeoples.url}/${id}`, {
        method: 'DELETE'
      }); 
      
      if (response.ok) {
        alert('Đã xóa nghệ sĩ thành công!');
        fetchPeople(pagination.page, searchQuery);
      }
    } catch (error) {
      console.error('Lỗi khi xóa nghệ sĩ:', error);
      alert('Lỗi hệ thống khi xóa.');
    }
  };

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white tracking-tight">Quản lý Nghệ sĩ</h2>

        <div className="flex items-center gap-2">
          <SearchBar 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            placeholder="Tìm kiếm nghệ sĩ..." 
          />
          <AddNewButton 
            onClick={() => { setSelectedPerson(null); setIsModalOpen(true); }} 
            label="Thêm Nghệ sĩ" 
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Tổng số nghệ sĩ" value={pagination.totalItems} icon="groups" color="primary" />
        <StatCard title="Diễn viên" value={stats.actors} icon="theater_comedy" color="blue" trend="N/A" />
        <StatCard title="Đạo diễn" value={stats.directors} icon="videocam" color="purple" trend="N/A" />
      </div>

      {/* Table Section */}
      <MovieTable
        items={people}
        loading={loading}
        pagination={pagination}
        fetchMovies={(page) => fetchPeople(page, searchQuery)}
        headers={["Mã", "Ảnh", "Họ tên", "Loại", "Hành động"]}
        renderRow={(person) => (
          <>
            <td className="px-6 py-4 text-center font-mono text-xs text-gray-500">{person.id}</td>
            <td className="px-6 py-4">
              <div 
                className="size-12 rounded-lg bg-surface bg-center bg-cover border border-white/10"
                style={{ backgroundImage: `url(${person.image_url})` }}
              ></div>
            </td>
            <td className="px-6 py-4">
              <h4 className="font-bold text-white text-base group-hover:text-primary transition-colors">
                {person.name}
              </h4>
            </td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                person.person_type === 'DIRECTOR' ? 'bg-warning/10 text-warning border-warning/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
              }`}>
                {person.person_type === 'DIRECTOR' ? 'Đạo diễn' : 'Diễn viên'}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2">
                <button 
                  onClick={() => { setSelectedPerson(person); setIsModalOpen(true); }} 
                  className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button 
                  onClick={() => handleDeletePerson(person.id, person.name)} 
                  className="size-8 rounded-lg hover:bg-red-500/10 hover:text-red-500 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </td>
          </>
        )}
      />

      <PeopleFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePerson}
        editData={selectedPerson}
      />
    </div>
  );
};

export default PeopleManagement;