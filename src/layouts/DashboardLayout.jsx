import {Outlet} from "react-router-dom";
import AdminSidebar from "../components/layout/AdminSidebar";

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">
            <AdminSidebar />

            <div className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Dashboard</h1>
                </header>

                <main className="dashboard-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
