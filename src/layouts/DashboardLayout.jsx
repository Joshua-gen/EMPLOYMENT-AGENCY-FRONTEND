import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import authService from "../features/auth/services/authService";
import AdminSidebar from "../components/layout/AdminSidebar";
import AdminTopbar from "../components/layout/AdminTopbar";

const DashboardLayout = () => {
    const [user, setUser] = useState(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const location = useLocation();

    useEffect(() => {
        let active = true;

        const verifyUser = async () => {
            try {
                const authenticatedUser = await authService.getUser();

                if (active) {
                    setUser(authenticatedUser ?? null);
                }
            } catch {
                if (active) {
                    setUser(null);
                }
            } finally {
                if (active) {
                    setCheckingAuth(false);
                }
            }
        };

        verifyUser();

        return () => {
            active = false;
        };
    }, []);

    if (checkingAuth) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-slate-600">Checking authentication...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/employers/login" state={{from: location}} replace />;
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar />

            <main className="flex min-w-0 flex-1 flex-col pt-16 md:pt-0">
                <AdminTopbar />

                <div className="min-w-0 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
