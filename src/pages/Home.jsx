import HeroSection from "../components/homesections/HeroSection";
import AnnouncementSection from "../components/homesections/AnnouncementSection";
import FeaturedJobsSection from "../components/homesections/FeaturedJobsSection";
import ServicesSection from "../components/homesections/ServicesSection";
import HowToApplySection from "../components/homesections/HowToApplySection";
import HomeCtaSection from "../components/homesections/HomeCtaSection";
import GlobalDeploymentSection from "../features/deployment/GlobalDeploymentSection";

const Home = () => {
    return (
        <div className="overflow-hidden">
            <HeroSection />
            <GlobalDeploymentSection />
            <FeaturedJobsSection />
            <AnnouncementSection />
            <ServicesSection />
            <HowToApplySection />
            <HomeCtaSection />
        </div>
    );
};

export default Home;
