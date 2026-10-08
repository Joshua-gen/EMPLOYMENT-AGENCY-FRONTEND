import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Heading from "../ui/Heading";
import Text from "../ui/Text";
import bgImage from "../../assets/images/bg-3.jfif";

const headerVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const gridVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const cardVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const AnnouncementSection = () => {
    const navigate = useNavigate();

    const announcements = [
        {
            id: 1,
            title: "New overseas job opportunities are now available.",
            description:
                "Check our latest job openings and find an opportunity that matches your skills and experience.",
            date: "October 7, 2026",
            type: "Job Opportunity",
        },
        {
            id: 2,
            title: "Online applications are now open.",
            description:
                "Qualified applicants can now submit their applications online for our available overseas positions.",
            date: "October 5, 2026",
            type: "Recruitment Update",
        },
        {
            id: 3,
            title: "New recruitment opportunities are available.",
            description:
                "Explore the latest employment opportunities and start your application with our recruitment team.",
            date: "October 3, 2026",
            type: "Agency Update",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-28 sm:px-6 sm:pb-36 lg:px-8 lg:pb-44">
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5" />

            {/* Background Image Layer */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="Background Pattern"
                    className="h-full w-full object-cover object-bottom opacity-25"
                />
            </div>

            {/* CONTENT CONTAINER - MAY MB-12/16 PARA LALONG MAS MAY CLEARANCE SA CURVE */}
            <div className="relative z-10 mx-auto max-w-7xl mb-8 sm:mb-12">
                <motion.div
                    className="mb-8"
                    initial="hidden"
                    whileInView="visible"
                    variants={headerVariants}
                    viewport={{once: true, amount: 0.3}}
                >
                    <Text size="sm" weight="semibold" className="uppercase tracking-[0.15em] text-[#EFE8A5]">
                        Latest Updates
                    </Text>

                    <Heading as="h1" className="mt-2 text-white">
                        Announcements
                    </Heading>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    variants={gridVariants}
                    viewport={{once: true, amount: 0.2}}
                >
                    {announcements.map((announcement) => (
                        <motion.div
                            key={announcement.id}
                            variants={cardVariants}
                            whileHover={{y: -6}}
                            transition={{duration: 0.2}}
                            className="h-full"
                        >
                            <Card className="h-full border-0 p-0 shadow-lg transition-shadow duration-300 hover:shadow-xl">
                                <div className="flex h-full flex-col p-6 sm:p-7">
                                    <div className="flex items-center justify-between gap-4">
                                        <span className="rounded-full bg-[#062B4A]/10 px-3 py-1 text-xs font-semibold text-[#062B4A]">
                                            {announcement.type}
                                        </span>

                                        <Text size="xs" weight="medium" className="text-gray-500">
                                            {announcement.date}
                                        </Text>
                                    </div>

                                    <Heading as="h3" className="mt-6">
                                        {announcement.title}
                                    </Heading>

                                    <Text size="base" className="mt-4 flex-1 leading-7 text-gray-600">
                                        {announcement.description}
                                    </Text>

                                    <Button
                                        variant="primary"
                                        size="md"
                                        className="mt-6 w-full"
                                        onClick={() => navigate("/recruitment/jobs")}
                                    >
                                        View Openings
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-none">
                <svg
                    className="relative block h-12 w-full text-white sm:h-20 lg:h-28"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,120 C300,30 900,30 1200,120 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default AnnouncementSection;
