import {Building2, CalendarDays, Flag, Users} from "lucide-react";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const history = [
    {
        year: "Our Beginning",
        title: "Establishing Our Purpose",
        description:
            "The organization was established with the goal of helping Filipino workers access employment opportunities while supporting employers in finding qualified talent.",
        icon: Flag,
    },
    {
        year: "Growing Connections",
        title: "Building Employer Partnerships",
        description:
            "Through continuous recruitment efforts and employer relationships, the organization expanded its network and strengthened its recruitment services.",
        icon: Building2,
    },
    {
        year: "Expanding Opportunities",
        title: "Connecting More Filipino Workers",
        description:
            "The organization continued developing its services to make employment opportunities more accessible to qualified applicants.",
        icon: Users,
    },
    {
        year: "Today",
        title: "Moving Forward",
        description:
            "Today, we continue improving our recruitment services and building trusted connections between Filipino workers and employers.",
        icon: CalendarDays,
    },
];

const History = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            About Us
                        </Text>

                        <Heading as="h1" className="text-white">
                            Our History
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            Learn about our journey and how our commitment to connecting Filipino workers with
                            opportunities continues to grow.
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
                <div className="mx-auto max-w-4xl">
                    <div className="relative">
                        <div className="absolute left-6 top-0 hidden h-full w-px bg-[#062B4A]/15 sm:block" />

                        <div className="space-y-8">
                            {history.map(({year, title, description, icon: Icon}) => (
                                <div key={year} className="relative sm:pl-16">
                                    <div className="absolute left-0 top-1 hidden h-12 w-12 items-center justify-center rounded-full bg-[#062B4A] text-white shadow-md sm:flex">
                                        <Icon size={21} />
                                    </div>

                                    <Card className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                                        <Text
                                            size="sm"
                                            weight="bold"
                                            className="mb-2 uppercase tracking-[0.12em] text-[#4F7383]"
                                        >
                                            {year}
                                        </Text>

                                        <Heading as="h2" className="mb-3">
                                            {title}
                                        </Heading>

                                        <Text className="leading-7 text-gray-600">{description}</Text>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default History;
