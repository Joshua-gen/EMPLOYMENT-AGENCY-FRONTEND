import {useState, useEffect} from "react";
import {NavLink, Link, useLocation, useNavigate} from "react-router-dom";
import {
    LayoutDashboard,
    BriefcaseBusiness,
    Users,
    Building2,
    Handshake,
    Globe,
    LogOut,
    Plane,
    Menu,
    X,
    Megaphone,
} from "lucide-react";
import useAuth from "../../features/auth/hooks/useAuth";

const navigation = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        label: "Job Management",
        path: "/dashboard/jobs",
        icon: BriefcaseBusiness,
    },
    {
        label: "Applicant Management",
        path: "/dashboard/applicants",
        icon: Users,
    },
    {
        label: "Employer Management",
        path: "/dashboard/employers",
        icon: Handshake,
    },
    {
        label: "Manpower Request Management",
        path: "/dashboard/manpower-request-management",
        icon: Building2,
    },
    {
        label: "Announcements",
        path: "/dashboard/announcements",
        icon: Megaphone,
    },
];

const AdminSidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const location = useLocation();
    const {logout} = useAuth();

    const navigate = useNavigate();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);

        try {
            await logout();
        } catch {
            // Continue to login even if the server request fails.
        } finally {
            setLoggingOut(false);
            navigate("/employers/login", {replace: true});
        }
    };

    useEffect(() => {
        setIsOpen(false);
    }, [location.pathname]);

    return (
        <>
            {/* Mobile Header */}
            <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
                <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white">
                        <Plane size={20} />
                    </div>

                    <div className="min-w-0">
                        <h1 className="truncate font-bold text-slate-900">OFW Agency</h1>
                        <p className="text-xs text-slate-500">Admin Panel</p>
                    </div>
                </Link>

                <div className="ml-2 flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen((open) => !open)}
                        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                        aria-expanded={isOpen}
                        className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100"
                    >
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Overlay */}
            {isOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar overlay"
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out md:sticky md:top-0 md:z-auto md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Branding */}
                <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-5">
                    <Link to="/dashboard" className="flex min-w-0 flex-1 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white">
                            <Plane size={22} />
                        </div>

                        <div className="min-w-0">
                            <h1 className="font-bold text-slate-900">OFW Agency</h1>
                            <p className="text-xs text-slate-500">Admin Panel</p>
                        </div>
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close sidebar"
                        className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-100 md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
                    <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Main Menu</p>

                    {navigation.map(({label, path, icon: Icon}) => (
                        <NavLink
                            key={path}
                            to={path}
                            end
                            className={({isActive}) =>
                                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-blue-950 text-white"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`
                            }
                        >
                            <Icon size={19} />
                            <span>{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Links */}
                <div className="space-y-1 border-t border-slate-200 p-3">
                    <Link
                        to="/"
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-slate-100"
                    >
                        <Globe size={19} />
                        View Public Website
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <LogOut size={19} />
                        {loggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
