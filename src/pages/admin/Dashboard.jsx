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

<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    title="Doanh thu tổng"
    value="1.2 Tỷ VNĐ"
    icon="payments"
    trend="+12%"
    color="success"
  />

  <StatCard
    title="Vé bán ra"
    value="8,450"
    icon="confirmation_number"
    trend="+5%"
    color="blue"
  />

  <StatCard
    title="Doanh thu F&B"
    value="350 Tr VNĐ"
    icon="fastfood"
    trend="+8%"
    color="orange"
  />

  <StatCard
    title="User mới"
    value="125"
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