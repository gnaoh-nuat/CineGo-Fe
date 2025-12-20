import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

const AdminLayout = () => {
  return(
    <div className="flex h-screen w-full overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main  className="flex-1 overflow-y-auto bg-background-dark p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}



export default AdminLayout;

