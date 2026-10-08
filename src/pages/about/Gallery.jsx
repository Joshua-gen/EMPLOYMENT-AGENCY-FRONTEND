import {Image as ImageIcon} from "lucide-react";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const galleryItems = [
    {
        id: 1,
        title: "Recruitment Activities",
        category: "Recruitment",
        image: null,
    },
    {
        id: 2,
        title: "Applicant Orientation",
        category: "Applicants",
        image: null,
    },
    {
        id: 3,
        title: "Employer Partnerships",
        category: "Employers",
        image: null,
    },
    {
        id: 4,
        title: "Career Opportunities",
        category: "Opportunities",
        image: null,
    },
    {
        id: 5,
        title: "Recruitment Team",
        category: "Our Team",
        image: null,
    },
    {
        id: 6,
        title: "Community Activities",
        category: "Activities",
        image: null,
    },
];

const Gallery = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            About Us
                        </Text>

                        <Heading as="h1" className="text-white">
                            Gallery
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            Explore moments from our recruitment activities, partnerships, and community initiatives.
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
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {galleryItems.map((item) => (
                            <Card
                                key={item.id}
                                className="group overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-[#062B4A]/5">
                                    {item.image ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <ImageIcon size={42} strokeWidth={1.5} className="text-[#062B4A]/30" />
                                    )}

                                    <div className="absolute inset-0 bg-[#062B4A]/0 transition-colors duration-300 group-hover:bg-[#062B4A]/10" />
                                </div>

                                <div className="p-5">
                                    <Text
                                        size="xs"
                                        weight="bold"
                                        className="mb-2 uppercase tracking-[0.12em] text-[#4F7383]"
                                    >
                                        {item.category}
                                    </Text>

                                    <Heading as="h3">{item.title}</Heading>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Gallery;
