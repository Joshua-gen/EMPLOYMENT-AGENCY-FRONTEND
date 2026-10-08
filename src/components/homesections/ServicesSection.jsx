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

const ServicesSection = () => {
    const navigate = useNavigate();

    const services = [
        {
            id: 1,
            title: "Overseas Recruitment",
            description: "We connect qualified Filipino workers with employment opportunities abroad.",
            icon: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: 2,
            title: "Applicant Assistance",
            description: "We guide applicants throughout the recruitment and application process.",
            icon: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop",
        },
        {
            id: 3,
            title: "Employer Services",
            description: "We assist employers in finding qualified manpower based on their requirements.",
            icon: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
        },
    ];

    return (
        <section className="relative px-5 pt-20 pb-28 sm:px-6 sm:pb-36 lg:px-8 lg:pb-44 bg-gray-50">
            <div className="relative z-10 mx-auto max-w-7xl mb-8 sm:mb-12">
                <motion.div
                    className="mx-auto mb-12 max-w-2xl text-center"
                    initial="hidden"
                    whileInView="visible"
                    variants={headerVariants}
                    viewport={{once: true, amount: 0.3}}
                >
                    <Text size="sm" weight="semibold" className="mb-2 uppercase tracking-[0.15em] text-[#062B4A]">
                        What We Offer
                    </Text>

                    <Heading as="h1">Our Services</Heading>

                    <Text size="base" className="mt-3 text-gray-600">
                        Reliable recruitment services for Filipino workers and international employers.
                    </Text>
                </motion.div>

                <motion.div
                    className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                    initial="hidden"
                    whileInView="visible"
                    variants={gridVariants}
                    viewport={{once: true, amount: 0.2}}
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={cardVariants}
                            whileHover={{y: -6}}
                            transition={{duration: 0.2}}
                            className="h-full"
                        >
                            <Card className="flex h-full flex-col justify-between overflow-hidden p-0 text-center transition-shadow duration-300 hover:shadow-xl">
                                <div className="-mx-6 -mt-6 mb-6 h-56 overflow-hidden rounded-t-lg">
                                    <img
                                        src={service.icon}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>

                                <div>
                                    <div className="p-6">
                                        <Heading as="h3" className="mt-2 text-xl font-bold">
                                            {service.title}
                                        </Heading>

                                        <Text size="base" className="mt-3 leading-7 text-gray-600">
                                            {service.description}
                                        </Text>
                                    </div>
                                </div>

                                <div className="px-6 pb-6 pt-2">
                                    <Button
                                        variant="ghost"
                                        size="md"
                                        className="w-full"
                                        onClick={() => navigate("/our-services")}
                                    >
                                        Learn More
                                    </Button>
                                </div>
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
                    <path d="M0,120 C300,30 900,30 1200,120 L1200,120 L0,120 Z"></path>
                </svg>
            </div>
        </section>
    );
};

export default ServicesSection;
