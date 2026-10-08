import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Text from "../ui/Text";

const containerVariants = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const HomeCtaSection = () => {
    const navigate = useNavigate();

    return (
        <section className="px-5 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <motion.div
                    className="relative overflow-hidden rounded-2xl bg-[#062B4A] px-6 py-14 text-center shadow-lg sm:px-10"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{once: true, amount: 0.3}}
                    variants={containerVariants}
                >
                    <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/5" />

                    <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/5" />

                    <div className="relative">
                        <Text size="sm" weight="semibold" className="uppercase tracking-[0.15em] text-[#EFE8A5]">
                            Start Your Journey
                        </Text>

                        <Heading as="h1" className="mt-3 text-white">
                            Ready to find your next opportunity?
                        </Heading>

                        <Text size="base" className="mx-auto mt-4 max-w-2xl leading-7 text-gray-200">
                            Explore available positions and take the next step toward your overseas career.
                        </Text>

                        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                            <Button variant="secondary" size="lg" onClick={() => navigate("/recruitment/jobs")}>
                                View Job Openings
                            </Button>

                            <Button
                                variant="ghost"
                                size="lg"
                                className="border border-white/30 text-white hover:bg-white/10"
                                onClick={() => navigate("/contactus")}
                            >
                                Contact Us
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default HomeCtaSection;
