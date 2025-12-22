import React, { useEffect, useState } from "react";
import StatCard from "../../components/admin/StatCard";
// import RevenueChart from "../../components/admin/RevenueChart";
// import TopMovies from "../../components/admin/TopMovies";
import SummaryApi from '@/common';
import { authenticatedFetch } from '@/utils/helper';

export default function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_revenue: null,
    tickets_sold: null,
    food_revenue: null,
    new_users: null,
    ticket_revenue: null,
  });

  const formatVND = (value) => value == null ? '—' : new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const resp = await authenticatedFetch(SummaryApi.getDashboardStats.url);
        const result = await resp.json();
        if (result?.success) setDashboard(result.data || {});
        else console.error('Failed to load dashboard stats', result);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white">
          Tổng quan hệ thống
        </h2>
      </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Doanh thu tổng"
        value={formatVND(dashboard.total_revenue)}
        icon="payments"
        trend="+12%"
        color="success"
      />

      <StatCard
        title="Vé bán ra"
        value={dashboard.tickets_sold == null ? '—' : new Intl.NumberFormat('vi-VN').format(dashboard.tickets_sold)}
        icon="confirmation_number"
        trend="+5%"
        color="blue"
      />

      <StatCard
        title="Doanh thu F&B"
        value={formatVND(dashboard.food_revenue)}
        icon="fastfood"
        trend="+8%"
        color="orange"
      />

      <StatCard
        title="User mới"
        value={dashboard.new_users == null ? '—' : new Intl.NumberFormat('vi-VN').format(dashboard.new_users)}
        icon="person_add"
        trend="+22%"
        color="purple"
      />
    </div>

      {/* <RevenueChart /> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopMovies />
      </div> */}
    </div>
  );
}