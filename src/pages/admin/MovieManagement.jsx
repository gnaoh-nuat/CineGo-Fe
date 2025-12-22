import React, { useEffect, useState, useRef } from 'react';
import StatCard from '@/components/admin/StatCard';
import MovieTable from '@/components/admin/MovieTable';
import AddNewButton from '@/components/admin/AddNewButton';
import MovieFormModal from '@/components/admin/MovieFormModal';
import SearchBar from '@/components/admin/SearchBar';
import prepareDataToSubmit from '@/components/admin/prepareDataToSubmit';
import { getStatusInfo, sortMoviesByStatus, paginate } from '@/components/admin/movieHelpers';
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const [selectedMovie, setSelectedMovie] = useState(null); // Lưu thông tin phim đang sửa

  // State lưu trữ thống kê
  const [stats, setStats] = useState({
    total: 0,
    nowPlaying: 0,
    comingSoon: 0,
    stopped: 0
  });

  const [pagination, setPagination] = useState({
    page: 1,
    size: 10,
    totalPages: 0,
    totalItems: 0
  });

  // Hàm lấy số lượng theo status
  const getCountByStatus = async (status) => {
    try {
      const url = status 
        ? `${SummaryApi.getMovies.url}?status=${status}&size=1` 
        : `${SummaryApi.getMovies.url}?size=1`;
      
      const response = await authenticatedFetch(url);
      const dataResponse = await response.json();
      return dataResponse.success ? dataResponse.data.totalItems : 0;
    } catch (error) {
      return 0;
    }
  };

  // Hàm tổng hợp thống kê
  const fetchAllStats = async () => {
    const [total, now, coming] = await Promise.all([
      getCountByStatus(null),            // Tổng số
      getCountByStatus("NOW_PLAYING"),   // Đang chiếu
      getCountByStatus("COMING_SOON"),   // Sắp chiếu
    ]);

    setStats({
      total,
      nowPlaying: now,
      comingSoon: coming,
      stopped: total - (now + coming) // Tính toán số lượng ngừng chiếu (nếu có)
    });
  };

  // If true, fetch all pages, sort globally by status, then paginate client-side
  const GLOBAL_PRIORITY_SORT = true;
  // Safety cap to avoid fetching an excessive number of pages
  const MAX_PAGES_TO_AGGREGATE = 50;

  // Accept optional search parameter; when searching we prefer server-side pagination
  const fetchMovies = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const useAggregate = GLOBAL_PRIORITY_SORT && !search; // only aggregate when not searching

      if (useAggregate) {
        // Fetch first page to learn totalPages and size
        const firstResp = await authenticatedFetch(`${SummaryApi.getMovies.url}?page=1&size=${pagination.size}`);
        const firstData = await firstResp.json();
        if (!firstData.success) {
          setMovies([]);
          setPagination({ page: 1, size: pagination.size, totalPages: 0, totalItems: 0 });
          return;
        }

        const totalPagesFromApi = firstData.data.totalPages ?? 1;
        if (totalPagesFromApi > MAX_PAGES_TO_AGGREGATE) {
          // Too many pages to aggregate safely; fall back to server-side pagination
          console.warn(`Too many pages (${totalPagesFromApi}) to aggregate client-side. Falling back to server pagination.`);
          // Fetch requested page from server (no search param here since useAggregate true)
          const resp = await authenticatedFetch(`${SummaryApi.getMovies.url}?page=${page}&size=${pagination.size}`);
          const data = await resp.json();
          if (data.success) {
            setMovies(sortMoviesByStatus(data.data.items));
            setPagination({
              page: data.data.page,
              size: data.data.size,
              totalPages: data.data.totalPages,
              totalItems: data.data.totalItems,
            });
          }
          return;
        }

        // Aggregate all pages
        let allItems = [...firstData.data.items];
        for (let p = 2; p <= totalPagesFromApi; p++) {
          const resp = await authenticatedFetch(`${SummaryApi.getMovies.url}?page=${p}&size=${pagination.size}`);
          const data = await resp.json();
          if (data.success) allItems.push(...data.data.items);
        }

        // Sort globally and then paginate locally
        const sorted = sortMoviesByStatus(allItems);
        const pageData = paginate(sorted, page, pagination.size);
        setMovies(pageData.items);
        setPagination({ page: pageData.page, size: pageData.size, totalPages: pageData.totalPages, totalItems: pageData.totalItems });
      } else {
        // Server-side pagination (use search param if provided)
        let url = `${SummaryApi.getMovies.url}?page=${page}&size=${pagination.size}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        const response = await authenticatedFetch(url);
        const dataResponse = await response.json();
        if (dataResponse.success) {
          setMovies(sortMoviesByStatus(dataResponse.data.items));
          setPagination({
            page: dataResponse.data.page,
            size: dataResponse.data.size,
            totalPages: dataResponse.data.totalPages,
            totalItems: dataResponse.data.totalItems
          });
        }
      }
    } catch (error) {
      console.error("Error fetching movies", error);
    } finally {
      setLoading(false);
    }
  };

  // Mở modal để thêm mới
  const handleAddNew = () => {
    setSelectedMovie(null); // Reset dữ liệu cũ
    setIsModalOpen(true);
  };

  // Mở modal để sửa
  const handleEdit = (movie) => {
    setSelectedMovie(movie); // Truyền dữ liệu phim được chọn
    setIsModalOpen(true);
  };

  const handleSaveMovie = async (rawFormData) => {
  const dataToSubmit = prepareDataToSubmit(rawFormData); // chuẩn hóa dữ liệu trước khi gửi

  try {
    const isEdit = !!selectedMovie; // Nếu có selectedMovie thì là sửa, ngược lại là thêm
    // 1. Cấu hình Request dựa trên chế độ
    const url = isEdit 
      ? `${SummaryApi.updateMovie.url}/${selectedMovie.id}` 
      : SummaryApi.createMovie.url;
    
    const method = isEdit ? "PUT" : "POST";

    // 2. Gọi API
    const response = await authenticatedFetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit), // Gửi dữ liệu đã được làm sạch
    });

    const result = await response.json();

    // 3. Xử lý các mã phản hồi (Status Codes)
    if (response.status === 201 || response.status === 200) {
      alert(isEdit ? "Cập nhật phim thành công!" : "Thêm phim mới thành công!");
      setIsModalOpen(false);
      fetchMovies(pagination.page); // Tải lại danh sách phim
      fetchAllStats(); // Cập nhật lại StatCard
    } 
    else if (response.status === 400) {
      alert("Lỗi: Thiếu các trường dữ liệu bắt buộc!");
    }
    else if (response.status === 409) {
      alert("Lỗi: Tên phim này đã tồn tại trong hệ thống!");
    }
    else if (response.status === 404) {
      alert("Lỗi: Không tìm thấy Đạo diễn, Diễn viên hoặc Thể loại tương ứng!");
    }
    else {
      alert("Có lỗi xảy ra: " + result.message);
    }
  } catch (error) {
    console.error("Lỗi kết nối API:", error);
    alert("Không thể kết nối tới server!");
  }
};

  const handleDelete = async (id, title) => {
    // 1. Hiển thị hộp thoại xác nhận với tên phim cụ thể
    const confirmDelete = window.confirm(`Bạn có chắc chắn muốn xóa phim "${title}"? Hành động này không thể hoàn tác.`);
    
    if (!confirmDelete) return;

    try {
      // 2. Gọi API DELETE
      const response = await authenticatedFetch(`${SummaryApi.deleteMovie.url}/${id}`, {
        method: SummaryApi.deleteMovie.method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      // 3. Xử lý phản hồi từ server
      if (response.status === 200 || result.success) {
        alert("Đã xóa phim thành công!");
        
        // 4. Cập nhật lại UI: Tải lại danh sách và số liệu thống kê
        fetchMovies(pagination.page); 
        fetchAllStats(); 
      } 
      else if (response.status === 404) {
        alert("Lỗi: Phim không tồn tại hoặc đã bị xóa trước đó.");
      } 
      else {
        alert("Xóa thất bại: " + (result.message || "Lỗi hệ thống"));
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện xóa phim:", error);
      alert("Không thể kết nối đến máy chủ để thực hiện lệnh xóa.");
    }
  };


  const [searchQuery, setSearchQuery] = useState('');
  const isFirstSearchRun = useRef(true);

  useEffect(() => {
    fetchMovies(1, '');
    fetchAllStats(); // Gọi thống kê khi vào trang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFirstSearchRun.current) {
      isFirstSearchRun.current = false;
      return;
    }
    const t = setTimeout(() => {
      fetchMovies(1, searchQuery);
      setPagination(prev => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white">Danh sách Phim</h2>

        {/* Button Thêm phim mới + Search */}
        <div className="flex items-center gap-2">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm phim..."
          />

          <AddNewButton onClick={handleAddNew} label="Thêm phim mới" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Tổng số phim" 
          value={stats.total} 
          icon="movie" 
          color="primary" 
        />
        <StatCard 
          title="Đang chiếu" 
          value={stats.nowPlaying} 
          icon="play_circle" 
          color="success" 
        />
        <StatCard 
          title="Sắp chiếu" 
          value={stats.comingSoon} 
          icon="schedule" 
          color="warning" 
        />
        <StatCard 
          title="Ngừng chiếu" 
          value={stats.stopped} 
          icon="stop_circle" 
          color="gray" 
        />
      </div>

      {/* Bảng dữ liệu */}
      <MovieTable
        movies={movies}
        loading={loading}
        pagination={pagination}
        fetchMovies={(page) => fetchMovies(page, searchQuery)}
        getStatusInfo={getStatusInfo}

        onEdit={handleEdit}     // Truyền hàm sửa
        onDelete={handleDelete} // Truyền hàm xóa
      />

      <MovieFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveMovie}
        editData={selectedMovie} // Truyền dữ liệu vào modal 
      />
    </div>
  );
};

export default MovieManagement;