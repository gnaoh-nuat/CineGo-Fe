import React, { useEffect, useState } from 'react';
import StatCard from '@/components/admin/StatCard';
import MovieTable from '@/components/admin/MovieTable';
import { getStatusInfo, sortMoviesByStatus, paginate } from '@/components/admin/movieHelpers';
import SummaryApi from '@/common';

const MovieManagement = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
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
      
      const response = await fetch(url);
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

  const fetchMovies = async (page = 1) => {
    setLoading(true);
    try {
      if (GLOBAL_PRIORITY_SORT) {
        // Fetch first page to learn totalPages and size
        const firstResp = await fetch(`${SummaryApi.getMovies.url}?page=1&size=${pagination.size}`);
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
          // Fetch requested page from server
          const resp = await fetch(`${SummaryApi.getMovies.url}?page=${page}&size=${pagination.size}`);
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
          const resp = await fetch(`${SummaryApi.getMovies.url}?page=${p}&size=${pagination.size}`);
          const data = await resp.json();
          if (data.success) allItems.push(...data.data.items);
        }

        // Sort globally and then paginate locally
        const sorted = sortMoviesByStatus(allItems);
        const pageData = paginate(sorted, page, pagination.size);
        setMovies(pageData.items);
        setPagination({ page: pageData.page, size: pageData.size, totalPages: pageData.totalPages, totalItems: pageData.totalItems });
      } else {
        // Server-side pagination (previous behavior)
        const response = await fetch(`${SummaryApi.getMovies.url}?page=${page}&size=${pagination.size}`);
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


  useEffect(() => {
    fetchMovies();
    fetchAllStats(); // Gọi thống kê khi vào trang
  }, []);

  // 2. Helper format trạng thái (extracted to src/components/admin/movieHelpers.js)

  return (
    <div className="mx-auto max-w-[96rem] space-y-8">
      {/* Header & Stats - Giữ nguyên giao diện cũ */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-black text-white">Danh sách Phim</h2>
        <button className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 font-bold text-white">
          <span className="material-symbols-outlined">add</span> Thêm phim mới
        </button>
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
        fetchMovies={fetchMovies}
        getStatusInfo={getStatusInfo}
      />
    </div>
  );
};

export default MovieManagement;