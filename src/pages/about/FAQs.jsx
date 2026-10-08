import {useState} from "react";
import {ChevronDown} from "lucide-react";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const faqs = [
    {
        id: 1,
        question: "How can I apply for an overseas job?",
        answer: "You can browse our available job openings and submit your application through our online application process.",
    },
    {
        id: 2,
        question: "Do I need experience to apply?",
        answer: "Requirements vary depending on the position. Please review the qualifications and requirements listed on each job opening.",
    },
    {
        id: 3,
        question: "How will I know if my application is successful?",
        answer: "Our recruitment team will provide updates regarding your application and inform you about the next steps when applicable.",
    },
    {
        id: 4,
        question: "Can I apply for more than one position?",
        answer: "Yes. You may apply for positions that match your qualifications and experience, subject to the requirements of each opportunity.",
    },
    {
        id: 5,
        question: "How can employers request manpower?",
        answer: "Employers can submit a manpower request through our Employer's section and provide the required information about their hiring needs.",
    },
];

const FAQs = () => {
    const [openId, setOpenId] = useState(null);

    const toggleFaq = (id) => {
        setOpenId((current) => (current === id ? null : id));
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            About Us
                        </Text>

                        <Heading as="h1" className="text-white">
                            Frequently Asked Questions
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            Find answers to common questions about our recruitment services and application process.
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
                    <div className="space-y-4">
                        {faqs.map((faq) => {
                            const isOpen = openId === faq.id;

                            return (
                                <Card
                                    key={faq.id}
                                    className="overflow-hidden p-0 transition-shadow duration-300 hover:shadow-md"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(faq.id)}
                                        className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                                    >
                                        <Text weight="semibold" className="text-[#062B4A]">
                                            {faq.question}
                                        </Text>

                                        <ChevronDown
                                            size={21}
                                            className={`shrink-0 text-[#062B4A] transition-transform duration-300 ${
                                                isOpen ? "rotate-180" : ""
                                            }`}
                                        />
                                    </button>

                                    <div
                                        className={`grid transition-all duration-300 ${
                                            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                                                <Text className="leading-7 text-gray-600">{faq.answer}</Text>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FAQs;
