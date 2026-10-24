import {Routes, Route} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import OurServices from "../pages/OurServices";
import ContactUs from "../pages/ContactUs";
import ComponentPlayground from "../pages/ComponentPlayground";
import Mission from "../pages/about/Mission";
import Vision from "../pages/about/Vision";
import History from "../pages/about/History";
import FAQs from "../pages/about/FAQs";
import Gallery from "../pages/about/Gallery";
import JobOpenings from "../pages/recruitment/JobOpenings";
import JobDetails from "../pages/recruitment/JobDetails";
import RecruitmentApply from "../pages/recruitment/RecruitmentApply";
import ManpowerRequest from "../pages/ManpowerRequest";

import Dashboard from "../pages/admin/Dashboard";
import JobManagement from "../pages/admin/JobManagement";
import ApplicantManagement from "../pages/admin/ApplicantManagement";
import ManpowerRequestManagement from "../pages/admin/ManpowerRequestManagement";
import AnnouncementManagement from "../pages/admin/AnnouncementManagement";
import EmployerManagement from "../pages/admin/EmployerManagement";
import LoginPage from "../pages/LoginPage";

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/about/mission" element={<Mission />} />
                <Route path="/about/vision" element={<Vision />} />
                <Route path="/about/history" element={<History />} />
                <Route path="/about/faqs" element={<FAQs />} />
                <Route path="/about/gallery" element={<Gallery />} />

                <Route path="/our-services" element={<OurServices />} />
                <Route path="/recruitment/jobs" element={<JobOpenings />} />
                <Route path="/recruitment/jobs/:id" element={<JobDetails />} />
                <Route path="/recruitment/apply" element={<RecruitmentApply />} />
                <Route path="/recruitment/apply/:jobId" element={<RecruitmentApply />} />

                <Route path="/employers/login" element={<LoginPage />} />

                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/manpower-request" element={<ManpowerRequest />} />
                <Route path="/component-test" element={<ComponentPlayground />} />
            </Route>

            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/jobs" element={<JobManagement />} />
                <Route path="/dashboard/applicants" element={<ApplicantManagement />} />
                <Route path="/dashboard/employers" element={<EmployerManagement />} />
                <Route path="/dashboard/manpower-request-management" element={<ManpowerRequestManagement />} />
                <Route path="/dashboard/announcements" element={<AnnouncementManagement />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
