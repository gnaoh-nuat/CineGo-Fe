import StatCard from "../../components/admin/StatCard";
// import RevenueChart from "../../components/admin/RevenueChart";
// import TopMovies from "../../components/admin/TopMovies";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black text-white">
          Tổng quan hệ thống
        </h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Doanh thu tổng" value="1.2 Tỷ VNĐ" />
        <StatCard title="Vé bán ra" value="8,450" />
        <StatCard title="F&B" value="350 Tr VNĐ" />
        <StatCard title="User mới" value="125" />
      </div>

      {/* <RevenueChart /> */}

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TopMovies />
      </div> */}
    </div>
  );
}