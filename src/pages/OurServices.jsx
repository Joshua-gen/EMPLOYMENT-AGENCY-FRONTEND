import {ArrowRight, BriefcaseBusiness, FileCheck2, Globe2, Headphones, Plane, Users} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Text from "../components/ui/Text";

const services = [
    {
        id: 1,
        icon: Users,
        title: "Recruitment Services",
        description:
            "We connect qualified Filipino workers with employment opportunities that match their skills, experience, and qualifications.",
        features: ["Candidate sourcing", "Applicant screening", "Qualification assessment"],
    },
    {
        id: 2,
        icon: BriefcaseBusiness,
        title: "Job Placement",
        description:
            "We help applicants find suitable employment opportunities with employers looking for qualified Filipino workers.",
        features: ["Job opportunity matching", "Employer requirements review", "Application assistance"],
    },
    {
        id: 3,
        icon: FileCheck2,
        title: "Application Assistance",
        description:
            "Our recruitment process helps applicants understand the requirements and steps involved in pursuing an overseas opportunity.",
        features: ["Application guidance", "Document requirements", "Recruitment process guidance"],
    },
    {
        id: 4,
        icon: Globe2,
        title: "Overseas Employment",
        description:
            "We provide access to employment opportunities abroad and help connect Filipino workers with international employers.",
        features: ["International opportunities", "Employer connections", "Overseas job matching"],
    },
    {
        id: 5,
        icon: Headphones,
        title: "Applicant Support",
        description:
            "We provide support throughout the recruitment process so applicants can better understand their application status and next steps.",
        features: ["Application updates", "Process guidance", "Applicant assistance"],
    },
    {
        id: 6,
        icon: Plane,
        title: "Pre-Deployment Assistance",
        description:
            "Qualified applicants receive guidance on the necessary steps and preparations before proceeding with their overseas employment.",
        features: ["Pre-deployment guidance", "Required preparations", "Process orientation"],
    },
];

const OurServices = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            What We Offer
                        </Text>

                        <Heading as="h1" className="text-white">
                            Our Services
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            We provide recruitment and employment support services designed to connect Filipino workers
                            with trusted opportunities abroad.
                        </Text>
                    </div>
                </div>

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
            </section>

            <section className="px-5 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 text-center">
                        <Heading as="h2">How We Can Help</Heading>

                        <Text className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
                            Explore our recruitment and employment services for applicants and international employers.
                        </Text>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {services.map(({id, icon: Icon, title, description, features}) => (
                            <Card
                                key={id}
                                className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A] transition-all duration-300 group-hover:bg-[#062B4A] group-hover:text-white">
                                    <Icon size={24} />
                                </div>

                                <Heading as="h3" className="mb-3">
                                    {title}
                                </Heading>

                                <Text className="leading-7 text-gray-600">{description}</Text>

                                <div className="mt-6 border-t border-gray-100 pt-5">
                                    <div className="space-y-3">
                                        {features.map((feature) => (
                                            <div key={feature} className="flex items-start gap-2.5">
                                                <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#062B4A]" />

                                                <Text size="sm" className="text-gray-600">
                                                    {feature}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="px-5 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <Card className="border-0 bg-[#062B4A] p-8 shadow-lg sm:p-10 lg:p-12">
                        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                            <div className="max-w-3xl">
                                <Text
                                    size="sm"
                                    weight="semibold"
                                    className="mb-3 uppercase tracking-[0.15em] text-[#EFE8A5]"
                                >
                                    Start Your Journey
                                </Text>

                                <Heading as="h2" className="text-white">
                                    Find an opportunity that matches your skills.
                                </Heading>

                                <Text className="mt-4 leading-7 text-white/75">
                                    Browse our available job opportunities and take the next step toward your career
                                    abroad.
                                </Text>
                            </div>

                            <Button
                                variant="secondary"
                                size="lg"
                                className="shrink-0"
                                onClick={() => navigate("/recruitment/jobs")}
                            >
                                View Job Openings
                                <ArrowRight size={19} />
                            </Button>
                        </div>
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default OurServices;
