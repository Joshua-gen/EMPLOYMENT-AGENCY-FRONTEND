import HeroSection from "../components/homesections/HeroSection";
import AnnouncementSection from "../components/homesections/AnnouncementSection";
import FeaturedJobsSection from "../components/homesections/FeaturedJobsSection";
import ServicesSection from "../components/homesections/ServicesSection";
import HowToApplySection from "../components/homesections/HowToApplySection";
import HomeCtaSection from "../components/homesections/HomeCtaSection";

const Home = () => {
    return (
        <div className="overflow-hidden">
            <HeroSection />
            <FeaturedJobsSection />
            <AnnouncementSection />
            <ServicesSection />
            <HowToApplySection />
            <HomeCtaSection />
        </div>
    );
};

export default Home;
