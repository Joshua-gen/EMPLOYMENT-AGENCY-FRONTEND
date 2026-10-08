import {Target, Users, ShieldCheck, Globe2} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const missionPoints = [
    {
        icon: Users,
        title: "Connect Filipino Talent",
        description:
            "Help qualified Filipino workers find employment opportunities that match their skills and experience.",
    },
    {
        icon: ShieldCheck,
        title: "Promote Trusted Recruitment",
        description: "Provide a professional and transparent recruitment experience for applicants and employers.",
    },
    {
        icon: Globe2,
        title: "Create Global Opportunities",
        description: "Build connections between Filipino workers and legitimate employment opportunities abroad.",
    },
];

const Mission = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            About Us
                        </Text>

                        <Heading as="h1" className="text-white">
                            Our Mission
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            To connect qualified Filipino workers with trusted employment opportunities while providing
                            a professional and transparent recruitment experience.
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
                    <div className="grid gap-6 md:grid-cols-3">
                        {missionPoints.map(({icon: Icon, title, description}) => (
                            <Card
                                key={title}
                                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A] transition-colors duration-300 group-hover:bg-[#062B4A] group-hover:text-white">
                                    <Icon size={24} />
                                </div>

                                <Heading as="h3" className="mb-3">
                                    {title}
                                </Heading>

                                <Text className="leading-7 text-gray-600">{description}</Text>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Mission;
