import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Text from "../ui/Text";
import bgImage from "../../assets/images/bg-2.jpg";

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

const HowToApplySection = () => {
    const navigate = useNavigate();

    const steps = [
        {
            number: "01",
            title: "Find a Job",
            description: "Browse our available overseas job opportunities.",
        },
        {
            number: "02",
            title: "Submit Your Application",
            description: "Complete the online application and provide the required information.",
        },
        {
            number: "03",
            title: "Application Review",
            description: "Our recruitment team reviews your qualifications and application.",
        },
        {
            number: "04",
            title: "Processing & Deployment",
            description: "Qualified applicants proceed through the necessary recruitment and deployment process.",
        },
    ];

    return (
        <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-20 pb-28 sm:px-6 sm:pb-36 lg:px-8 lg:pb-44">
            <div className="pointer-events-none absolute -right-20 -top-5 h-56 w-56 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5" />

            {/* Background Image */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src={bgImage}
                    alt="City Skyline Background"
                    className="h-full w-full object-cover object-bottom opacity-30"
                />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl mb-8 sm:mb-12">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    variants={headerVariants}
                    viewport={{once: true, amount: 0.3}}
                >
                    <Text size="sm" weight="semibold" className="mb-2 uppercase tracking-[0.15em] text-[#EFE8A5]">
                        Simple Process
                    </Text>

                    <Heading as="h1" className="text-white">
                        How to Apply
                    </Heading>

                    <Text size="base" className="mt-3 text-slate-300">
                        Follow these simple steps to begin your application.
                    </Text>
                </motion.div>

                <motion.div
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                    initial="hidden"
                    whileInView="visible"
                    variants={gridVariants}
                    viewport={{once: true, amount: 0.2}}
                >
                    {steps.map((step) => (
                        <motion.div
                            key={step.number}
                            variants={cardVariants}
                            whileHover={{y: -6}}
                            transition={{duration: 0.2}}
                            className="relative h-full"
                        >
                            <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-xl backdrop-blur-sm">
                                <Text size="2xl" weight="extrabold" className="text-[#EFE8A5]/50">
                                    {step.number}
                                </Text>

                                <Heading as="h3" className="mt-4 text-white">
                                    {step.title}
                                </Heading>

                                <Text size="base" className="mt-3 leading-6 text-slate-300">
                                    {step.description}
                                </Text>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="mt-10 text-center"
                    initial={{opacity: 0, y: 20}}
                    whileInView={{opacity: 1, y: 0}}
                    viewport={{once: true}}
                    transition={{duration: 0.5, delay: 0.4}}
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        className="w-full transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                        onClick={() => navigate("/recruitment/apply")}
                    >
                        Apply Online
                    </Button>
                </motion.div>
            </div>

            {/* Bottom Curve (Nasa bottom, nakasandok / pataas ang bunganga) */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-none">
                <svg
                    className="relative block h-12 w-full text-white sm:h-20 lg:h-28"
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

export default HowToApplySection;
