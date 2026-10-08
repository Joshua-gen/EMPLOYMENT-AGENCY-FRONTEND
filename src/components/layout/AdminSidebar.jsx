import {NavLink} from "react-router-dom";

const AdminSidebar = () => {
    const navigation = [
        {
            label: "Dashboard",
            path: "/dashboard",
        },
    ];

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-header">
                <h2>OFW AGENCY</h2>
                <span>Administration</span>
            </div>

            <nav className="sidebar-navigation">
                {navigation.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({isActive}) => (isActive ? "sidebar-link active" : "sidebar-link")}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button type="button">Logout</button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
