import {ArrowUpRight, Globe2, HeartHandshake, Star} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const visionValues = [
    {
        icon: Globe2,
        title: "Global Reach",
        description: "Expand access to legitimate employment opportunities across international markets.",
    },
    {
        icon: HeartHandshake,
        title: "Trusted Connections",
        description: "Build lasting relationships between Filipino workers and reputable employers.",
    },
    {
        icon: Star,
        title: "Professional Excellence",
        description: "Deliver a recruitment experience centered on professionalism, integrity, and service.",
    },
];

const Vision = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            About Us
                        </Text>

                        <Heading as="h1" className="text-white">
                            Our Vision
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            To become a trusted bridge between Filipino talent and meaningful employment opportunities
                            around the world.
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
                        <Heading as="h2">What We Strive For</Heading>

                        <Text className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600">
                            Our vision guides the way we serve applicants, employers, and the communities we represent.
                        </Text>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {visionValues.map(({icon: Icon, title, description}) => (
                            <Card
                                key={title}
                                className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A] transition-all duration-300 group-hover:bg-[#062B4A] group-hover:text-white">
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

            <section className="px-5 pb-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Card className="border-0 bg-[#062B4A] text-center shadow-lg">
                        <ArrowUpRight className="mx-auto mb-4 text-[#EFE8A5]" size={30} />

                        <Heading as="h2" className="text-white">
                            Building Better Opportunities
                        </Heading>

                        <Text className="mx-auto mt-4 max-w-2xl leading-7 text-white/75">
                            We continue to work toward creating meaningful connections that help Filipino workers pursue
                            opportunities beyond borders.
                        </Text>

                        <Button
                            variant="secondary"
                            size="lg"
                            className="mt-7"
                            onClick={() => (window.location.href = "/recruitment/jobs")}
                        >
                            Explore Job Openings
                        </Button>
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default Vision;
