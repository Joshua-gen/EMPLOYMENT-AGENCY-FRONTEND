import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Text from "../ui/Text";

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

const FeaturedJobsSection = () => {
    const navigate = useNavigate();

    const jobs = [
        {
            id: 1,
            position: "Factory Worker",
            country: "Taiwan",
            vacancies: 20,
        },
        {
            id: 2,
            position: "Warehouse Worker",
            country: "Japan",
            vacancies: 10,
        },
        {
            id: 3,
            position: "Caregiver",
            country: "Saudi Arabia",
            vacancies: 15,
        },
    ];

    return (
        <section className="relative overflow-hidden bg-gray-50 px-5 pt-20 pb-28 sm:px-6 sm:pb-36 lg:px-8 lg:pb-44">
            <div className="relative z-10 mx-auto max-w-7xl">
                <motion.div
                    className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
                    initial="hidden"
                    whileInView="visible"
                    variants={headerVariants}
                    viewport={{once: true, amount: 0.3}}
                >
                    <div>
                        <Text size="sm" weight="semibold" className="mb-2 uppercase tracking-[0.15em] text-[#062B4A]">
                            Opportunities
                        </Text>

                        <Heading as="h1">Featured Job Openings</Heading>

                        <Text size="base" className="mt-3 max-w-2xl text-gray-600">
                            Explore some of our current overseas employment opportunities.
                        </Text>
                    </div>

                    <Button variant="ghost" size="md" onClick={() => navigate("/recruitment/jobs")}>
                        View All Jobs
                    </Button>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    variants={gridVariants}
                    viewport={{once: true, amount: 0.2}}
                >
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            variants={cardVariants}
                            whileHover={{y: -6}}
                            transition={{duration: 0.2}}
                        >
                            <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10">
                                    <span className="text-lg font-bold text-[#062B4A]">JOB</span>
                                </div>

                                <Heading as="h3">{job.position}</Heading>

                                <Text size="base" weight="medium" className="mt-2 text-gray-600">
                                    {job.country}
                                </Text>

                                <Text size="sm" className="mt-4 text-gray-500">
                                    Available vacancies: {job.vacancies}
                                </Text>

                                <Button
                                    variant="secondary"
                                    size="md"
                                    className="mt-6 w-full"
                                    onClick={() => navigate("/recruitment/jobs")}
                                >
                                    View Position
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-none">
                <svg
                    className="relative block h-12 w-full text-[#062B4A] sm:h-20 lg:h-28"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,0 Q600,120 1200,0 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default FeaturedJobsSection;
