import {ArrowLeft, BriefcaseBusiness, CalendarDays, Clock3, FileCheck2, Globe2, MapPin, Users} from "lucide-react";
import {useNavigate, useParams} from "react-router-dom";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const jobs = [
    {
        id: 1,
        title: "Factory Worker",
        country: "Taiwan",
        employer: "Available upon request",
        description:
            "Work in a manufacturing environment assisting with production, packaging, assembly, and other assigned factory operations.",
        qualifications: [
            "At least 18 years old",
            "Physically fit and capable of performing assigned duties",
            "Willing to work in a manufacturing environment",
            "Previous factory experience is an advantage",
        ],
        salary: "To be discussed",
        benefits: [
            "Employer-provided benefits subject to employment contract",
            "Overtime opportunities subject to employer requirements",
            "Other benefits based on the approved employment contract",
        ],
        vacancies: "Multiple",
        workingHours: "As specified in the employment contract",
        contractDuration: "As specified in the employment contract",
        workLocation: "Taiwan",
        requirements: [
            "Valid passport",
            "Updated resume or application form",
            "Required identification documents",
            "Medical examination when required",
            "Other documents required during processing",
        ],
        deadline: "October 30, 2026",
    },
    {
        id: 2,
        title: "Warehouse Worker",
        country: "Taiwan",
        employer: "Available upon request",
        description:
            "Assist with warehouse operations including receiving, sorting, organizing, packing, and preparing products for shipment.",
        qualifications: [
            "At least 18 years old",
            "Physically fit",
            "Able to perform warehouse-related duties",
            "Previous warehouse experience is an advantage",
        ],
        salary: "To be discussed",
        benefits: [
            "Employer-provided benefits subject to employment contract",
            "Overtime opportunities subject to employer requirements",
            "Other benefits based on the approved employment contract",
        ],
        vacancies: "Multiple",
        workingHours: "As specified in the employment contract",
        contractDuration: "As specified in the employment contract",
        workLocation: "Taiwan",
        requirements: [
            "Valid passport",
            "Updated resume or application form",
            "Required identification documents",
            "Medical examination when required",
            "Other documents required during processing",
        ],
        deadline: "November 5, 2026",
    },
    {
        id: 3,
        title: "Production Operator",
        country: "South Korea",
        employer: "Available upon request",
        description:
            "Perform production-related tasks while following workplace procedures, quality standards, and assigned operational requirements.",
        qualifications: [
            "At least 18 years old",
            "Physically fit",
            "Able to follow workplace instructions",
            "Relevant production experience is an advantage",
        ],
        salary: "To be discussed",
        benefits: [
            "Employer-provided benefits subject to employment contract",
            "Overtime opportunities subject to employer requirements",
            "Other benefits based on the approved employment contract",
        ],
        vacancies: "Multiple",
        workingHours: "As specified in the employment contract",
        contractDuration: "As specified in the employment contract",
        workLocation: "South Korea",
        requirements: [
            "Valid passport",
            "Updated resume or application form",
            "Required identification documents",
            "Medical examination when required",
            "Other documents required during processing",
        ],
        deadline: "November 15, 2026",
    },
    {
        id: 4,
        title: "Caregiver",
        country: "Japan",
        employer: "Available upon request",
        description:
            "Provide daily assistance and care while maintaining a safe, respectful, and supportive environment for the assigned individual.",
        qualifications: [
            "At least 18 years old",
            "Physically and mentally capable of performing caregiving duties",
            "Patient and responsible",
            "Caregiving experience or relevant training is an advantage",
        ],
        salary: "To be discussed",
        benefits: [
            "Employer-provided benefits subject to employment contract",
            "Overtime opportunities subject to employer requirements",
            "Other benefits based on the approved employment contract",
        ],
        vacancies: "Multiple",
        workingHours: "As specified in the employment contract",
        contractDuration: "As specified in the employment contract",
        workLocation: "Japan",
        requirements: [
            "Valid passport",
            "Updated resume or application form",
            "Required identification documents",
            "Medical examination when required",
            "Other documents required during processing",
        ],
        deadline: "November 20, 2026",
    },
];

const JobDetails = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const job = jobs.find((item) => String(item.id) === String(id));

    if (!job) {
        return (
            <main className="min-h-screen bg-gray-50 px-5 py-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <Heading as="h1">Job Not Found</Heading>

                    <Text className="mt-3 text-gray-600">
                        The job opening you are looking for is no longer available.
                    </Text>

                    <Button variant="primary" size="md" className="mt-6" onClick={() => navigate("/recruitment/jobs")}>
                        <ArrowLeft size={18} />
                        Back to Job Openings
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative bg-[#062B4A] px-5 pt-16 pb-20 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <button
                        type="button"
                        onClick={() => navigate("/recruitment/jobs")}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors duration-200 hover:text-white"
                    >
                        <ArrowLeft size={18} />
                        Back to Job Openings
                    </button>

                    <div className="max-w-4xl">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            Job Opportunity
                        </Text>

                        <Heading as="h1" className="text-white">
                            {job.title}
                        </Heading>

                        <div className="mt-5 flex flex-col gap-3 text-white/80 sm:flex-row sm:gap-6">
                            <div className="flex items-center gap-2">
                                <Globe2 size={18} />
                                <Text>{job.country}</Text>
                            </div>

                            <div className="flex items-center gap-2">
                                <CalendarDays size={18} />
                                <Text>Deadline: {job.deadline}</Text>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none">
                    <svg
                        className="relative block w-full h-8 sm:h-12 text-gray-50"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        fill="currentColor"
                    >
                        <path d="M0,0 C300,90 900,90 1200,0 L1200,120 L0,120 Z"></path>
                    </svg>
                </div>
            </section>

            <section className="px-5 py-12 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_340px]">
                    <div className="space-y-6">
                        <Card>
                            <Heading as="h2" className="mb-4">
                                Job Description
                            </Heading>

                            <Text className="leading-7 text-gray-600">{job.description}</Text>
                        </Card>

                        <Card>
                            <Heading as="h2" className="mb-5">
                                Qualifications
                            </Heading>

                            <div className="space-y-3">
                                {job.qualifications.map((qualification) => (
                                    <div key={qualification} className="flex items-start gap-3">
                                        <FileCheck2 size={19} className="mt-1 shrink-0 text-[#062B4A]" />

                                        <Text className="leading-7 text-gray-600">{qualification}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <Heading as="h2" className="mb-5">
                                Benefits
                            </Heading>

                            <div className="space-y-3">
                                {job.benefits.map((benefit) => (
                                    <div key={benefit} className="flex items-start gap-3">
                                        <FileCheck2 size={19} className="mt-1 shrink-0 text-[#062B4A]" />

                                        <Text className="leading-7 text-gray-600">{benefit}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <Heading as="h2" className="mb-5">
                                Requirements
                            </Heading>

                            <div className="space-y-3">
                                {job.requirements.map((requirement) => (
                                    <div key={requirement} className="flex items-start gap-3">
                                        <FileCheck2 size={19} className="mt-1 shrink-0 text-[#062B4A]" />

                                        <Text className="leading-7 text-gray-600">{requirement}</Text>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div>
                        <Card className="sticky top-20">
                            <Heading as="h2" className="mb-6">
                                Job Information
                            </Heading>

                            <div className="space-y-5">
                                <div className="flex gap-3">
                                    <BriefcaseBusiness size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Employer
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.employer}</Text>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Globe2 size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Country
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.country}</Text>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <MapPin size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Work Location
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.workLocation}</Text>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Users size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Vacancies
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.vacancies}</Text>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Clock3 size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Working Hours
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.workingHours}</Text>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <CalendarDays size={19} className="mt-0.5 shrink-0 text-[#062B4A]" />

                                    <div>
                                        <Text size="sm" weight="semibold" className="text-gray-500">
                                            Contract Duration
                                        </Text>

                                        <Text className="mt-1 text-gray-800">{job.contractDuration}</Text>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-5">
                                    <Text size="sm" weight="semibold" className="text-gray-500">
                                        Salary
                                    </Text>

                                    <Text size="lg" weight="bold" className="mt-1 text-[#062B4A]">
                                        {job.salary}
                                    </Text>
                                </div>

                                <div className="rounded-xl bg-[#062B4A]/5 p-4">
                                    <Text size="sm" weight="semibold" className="text-[#062B4A]">
                                        Application Deadline
                                    </Text>

                                    <Text weight="bold" className="mt-1 text-gray-800">
                                        {job.deadline}
                                    </Text>
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full"
                                    onClick={() => navigate(`/recruitment/apply?job=${job.id}`)}
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default JobDetails;
