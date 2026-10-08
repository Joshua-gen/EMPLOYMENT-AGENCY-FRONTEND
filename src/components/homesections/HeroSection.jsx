import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import heroImage from "../../assets/images/home-bg-5.gif";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

const containerVariants = {
    hidden: {opacity: 0},
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: {y: 25, opacity: 0},
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-[calc(100vh-56px)] overflow-hidden bg-[#062B4A]">
            {/* Background Image Layer */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <img
                    src={heroImage}
                    alt="Hero Background"
                    className="h-full w-full object-cover object-center opacity-60"
                />
            </div>

            {/* Dark Overlay for better text readability */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-black/40" />

            {/* Curve SVG */}
            <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full overflow-hidden leading-none">
                <svg
                    className="relative block h-10 w-full text-gray-50 sm:h-16 lg:h-20"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    fill="currentColor"
                >
                    <path d="M0,120 C300,30 900,30 1200,120 L1200,120 L0,120 Z"></path>
                </svg>
            </div>

            {/* Content Container (Tamang-tama lang ang spacing sa ibaba) */}
            <motion.div
                className="relative z-10 mx-auto flex min-h-[calc(100vh-56px)] max-w-7xl items-center px-5 pt-16 pb-20 sm:px-6 sm:pb-24 lg:px-8 lg:pb-28"
                initial="hidden"
                whileInView="visible"
                variants={containerVariants}
                viewport={{once: true, amount: 0.3}}
            >
                <div className="mx-auto max-w-5xl text-center">
                    <motion.div variants={itemVariants}>
                        <Text
                            size="sm"
                            weight="semibold"
                            className="mb-5 uppercase tracking-[0.2em] text-white sm:text-base"
                        >
                            Your Future Starts Here
                        </Text>
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                    >
                        Connecting
                        <br />
                        Filipino Workers
                        <br />
                        to Global Opportunities
                    </motion.h1>

                    <motion.div variants={itemVariants}>
                        <Text size="lg" weight="medium" className="mx-auto mt-8 max-w-2xl leading-7 text-white/90">
                            We connect qualified Filipino workers with trusted employment opportunities abroad.
                        </Text>
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full transition-transform duration-200 hover:-translate-y-0.5 sm:w-auto"
                            onClick={() => navigate("/recruitment/jobs")}
                        >
                            View Job Openings
                        </Button>

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
            </motion.div>
        </section>
    );
};

export default HeroSection;
