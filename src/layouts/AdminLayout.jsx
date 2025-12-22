import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-background-dark via-[#0f0f12] to-[#0d0d10]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-background-dark/60 p-4 md:p-8 backdrop-blur">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
