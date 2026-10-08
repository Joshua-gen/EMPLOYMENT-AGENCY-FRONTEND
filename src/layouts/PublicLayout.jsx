import {Outlet} from "react-router-dom";
import PublicNavbar from "../components/layout/PublicNavbar";
import PublicFooter from "../components/layout/PublicFooter";

const PublicLayout = () => {
    return (
        <div className="public-layout">
            <PublicNavbar />

            <main className="public-content">
                <Outlet />
            </main>

            <PublicFooter />
        </div>
    );
};

export default PublicLayout;
