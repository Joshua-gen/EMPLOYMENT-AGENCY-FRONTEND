import {Routes, Route} from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import OurServices from "../pages/OurServices";
import Recruitment from "../pages/Recruitment";
import Employers from "../pages/Employers";
import ContactUs from "../pages/ContactUs";
import Dashboard from "../pages/Dashboard";
import ComponentPlayground from "../pages/ComponentPlayground";
import Mission from "../pages/about/Mission";
import Vision from "../pages/about/Vision";
import History from "../pages/about/History";
import FAQs from "../pages/about/FAQs";
import Gallery from "../pages/about/Gallery";
import JobOpenings from "../pages/recruitment/JobOpenings";
import JobDetails from "../pages/recruitment/JobDetails";
import RecruitmentApply from "../pages/recruitment/RecruitmentApply";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Website */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />
                <Route path="/about/mission" element={<Mission />} />
                <Route path="/about/vision" element={<Vision />} />
                <Route path="/about/history" element={<History />} />
                <Route path="/about/faqs" element={<FAQs />} />
                <Route path="/about/gallery" element={<Gallery />} />

                <Route path="/our-services" element={<OurServices />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/recruitment/jobs" element={<JobOpenings />} />
                <Route path="/recruitment/jobs/:id" element={<JobDetails />} />
                <Route path="/recruitment/apply" element={<RecruitmentApply />} />
                <Route path="/recruitment/apply/:jobId" element={<RecruitmentApply />} />

                <Route path="/employers" element={<Employers />} />
                <Route path="/contactus" element={<ContactUs />} />
                <Route path="/component-test" element={<ComponentPlayground />} />
            </Route>

            {/* Admin / Employer */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
