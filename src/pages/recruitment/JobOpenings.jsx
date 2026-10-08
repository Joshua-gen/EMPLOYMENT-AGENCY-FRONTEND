import {useMemo, useState} from "react";
import {CalendarDays, ChevronLeft, ChevronRight, Globe2, Search, X} from "lucide-react";
import {useNavigate} from "react-router-dom";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Text from "../../components/ui/Text";

const PAGE_SIZE = 3; // palitan kung ilan ang gusto mo per page

const jobs = [
    {
        id: 1,
        title: "Factory Worker",
        country: "Taiwan",
        deadline: "October 30, 2026",
        status: "Open",
    },
    {
        id: 2,
        title: "Warehouse Worker",
        country: "Taiwan",
        deadline: "November 5, 2026",
        status: "Open",
    },
    {
        id: 3,
        title: "Production Operator",
        country: "South Korea",
        deadline: "November 15, 2026",
        status: "Open",
    },
    {
        id: 4,
        title: "Caregiver",
        country: "Japan",
        deadline: "November 20, 2026",
        status: "Open",
    },
];

const JobOpenings = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [country, setCountry] = useState("All");
    const [page, setPage] = useState(1);

    // kunin automatically yung mga country mula sa jobs
    const countries = useMemo(() => ["All", ...new Set(jobs.map((job) => job.country))], []);

    const filteredJobs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return jobs.filter((job) => {
            const matchesSearch = job.title.toLowerCase().includes(query);
            const matchesCountry = country === "All" || job.country === country;

            return matchesSearch && matchesCountry;
        });
    }, [search, country]);

    const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const paginatedJobs = filteredJobs.slice(startIndex, startIndex + PAGE_SIZE);

    const hasActiveFilters = search !== "" || country !== "All";

    const handleSearch = (value) => {
        setSearch(value);
        setPage(1);
    };

    const handleCountry = (value) => {
        setCountry(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setCountry("All");
        setPage(1);
    };

    return (
        <main className="min-h-screen bg-gray-50">
            <section className="relative overflow-hidden bg-[#062B4A] px-5 pt-16 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
                <div className="relative z-10 mx-auto max-w-7xl">
                    <div className="mx-auto max-w-3xl text-center">
                        <Text size="sm" weight="semibold" className="mb-4 uppercase tracking-[0.18em] text-[#EFE8A5]">
                            Recruitment
                        </Text>

                        <Heading as="h1" className="text-white">
                            Job Openings
                        </Heading>

                        <Text size="lg" className="mt-5 leading-8 text-white/80">
                            Explore our available overseas employment opportunities and find a position that matches
                            your qualifications.
                        </Text>
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
                <div className="mx-auto max-w-5xl">
                    <div className="mb-8">
                        <Heading as="h2">Available Positions</Heading>

                        <Text className="mt-2 text-gray-600">Browse our current overseas job opportunities.</Text>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Search job title..."
                                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition focus:border-[#062B4A] focus:ring-2 focus:ring-[#062B4A]/20"
                            />
                        </div>

                        <select
                            value={country}
                            onChange={(e) => handleCountry(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-[#062B4A] focus:ring-2 focus:ring-[#062B4A]/20 sm:w-52"
                        >
                            {countries.map((c) => (
                                <option key={c} value={c}>
                                    {c === "All" ? "All Countries" : c}
                                </option>
                            ))}
                        </select>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#062B4A] transition hover:bg-[#062B4A]/5"
                            >
                                <X size={16} />
                                Clear
                            </button>
                        )}
                    </div>

                    <Text size="sm" className="mb-4 text-gray-500">
                        {filteredJobs.length === 0
                            ? "No positions found"
                            : `Showing ${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, filteredJobs.length)} of ${
                                  filteredJobs.length
                              } position${filteredJobs.length > 1 ? "s" : ""}`}
                    </Text>

                    {/* Job list */}
                    {paginatedJobs.length > 0 ? (
                        <div className="space-y-5">
                            {paginatedJobs.map((job) => (
                                <Card
                                    key={job.id}
                                    className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                        <div className="min-w-0">
                                            <div className="mb-3 flex items-center gap-3">
                                                <Heading as="h3">{job.title}</Heading>

                                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                                    {job.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Globe2 size={17} className="text-[#062B4A]" />

                                                    <Text size="sm">{job.country}</Text>
                                                </div>

                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <CalendarDays size={17} className="text-[#062B4A]" />

                                                    <Text size="sm">Application Deadline: {job.deadline}</Text>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate(`/recruitment/jobs/${job.id}`)}
                                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-[#062B4A] bg-white px-5 py-2.5 text-sm font-semibold text-[#062B4A] transition-all duration-200 hover:bg-[#062B4A] hover:text-white"
                                        >
                                            View Details
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <div className="py-10 text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#062B4A]/10 text-[#062B4A]">
                                    <Search size={26} />
                                </div>

                                <Heading as="h3" className="mb-2">
                                    No matching positions
                                </Heading>

                                <Text className="text-gray-600">Try a different keyword or country.</Text>
                            </div>
                        </Card>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                            <button
                                type="button"
                                onClick={() => setPage(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[#062B4A] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            {Array.from({length: totalPages}, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPage(n)}
                                    aria-current={n === currentPage ? "page" : undefined}
                                    className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold transition ${
                                        n === currentPage
                                            ? "border-[#062B4A] bg-[#062B4A] text-white"
                                            : "border-gray-300 bg-white text-[#062B4A] hover:bg-gray-100"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => setPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-300 bg-white text-[#062B4A] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                                aria-label="Next page"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </nav>
                    )}
                </div>
            </section>
        </main>
    );
};

export default JobOpenings;
