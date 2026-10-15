import {useMemo, useState} from "react";
import {
    Search,
    Users,
    Clock3,
    CheckCircle2,
    XCircle,
    FileText,
    Eye,
    Check,
    X,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    BriefcaseBusiness,
    MapPin,
    CalendarDays,
    Building2,
    UserRound,
    MessageSquareText,
    ArrowRight,
    Plus,
} from "lucide-react";

const REQUEST_STATUSES = [
    {label: "All Requests", value: "All", icon: FileText},
    {label: "Pending Review", value: "Pending", icon: Clock3},
    {label: "Approved", value: "Approved", icon: CheckCircle2},
    {label: "Rejected", value: "Rejected", icon: XCircle},
    {label: "Converted to Job", value: "Converted", icon: BriefcaseBusiness},
];

const INITIAL_REQUESTS = [
    {
        id: "MR-2026-001",
        employer: "Pacific Manufacturing Co.",
        contactPerson: "Robert Dela Cruz",
        email: "robert@example.com",
        phone: "09171234567",
        position: "Factory Worker",
        country: "Taiwan",
        vacancies: 25,
        salary: "NT$28,000 - NT$32,000",
        employmentType: "Full-time",
        dateRequested: "2026-10-01",
        deadline: "2026-11-15",
        status: "Pending",
        requirements: "At least high school graduate. Willing to work on shifting schedules.",
        remarks: "",
        convertedJobId: null,
    },
    {
        id: "MR-2026-002",
        employer: "Global Workforce Solutions",
        contactPerson: "Maria Santos",
        email: "maria@example.com",
        phone: "09182345678",
        position: "Warehouse Worker",
        country: "Japan",
        vacancies: 10,
        salary: "¥180,000 - ¥220,000",
        employmentType: "Full-time",
        dateRequested: "2026-10-02",
        deadline: "2026-11-30",
        status: "Approved",
        requirements: "Physically fit applicants. Previous warehouse experience is preferred.",
        remarks: "Request reviewed and approved.",
        convertedJobId: null,
    },
    {
        id: "MR-2026-003",
        employer: "Eastern Hospitality Group",
        contactPerson: "Angela Reyes",
        email: "angela@example.com",
        phone: "09193456789",
        position: "Hotel Housekeeping Staff",
        country: "United Arab Emirates",
        vacancies: 8,
        salary: "AED 1,800 - AED 2,200",
        employmentType: "Full-time",
        dateRequested: "2026-10-03",
        deadline: "2026-11-20",
        status: "Pending",
        requirements: "Experience in housekeeping is an advantage. Must be willing to work overseas.",
        remarks: "",
        convertedJobId: null,
    },
    {
        id: "MR-2026-004",
        employer: "Northstar Industrial Services",
        contactPerson: "Daniel Garcia",
        email: "daniel@example.com",
        phone: "09204567891",
        position: "Construction Worker",
        country: "Saudi Arabia",
        vacancies: 15,
        salary: "SAR 1,500 - SAR 2,000",
        employmentType: "Contract",
        dateRequested: "2026-10-04",
        deadline: "2026-12-01",
        status: "Rejected",
        requirements: "Must have relevant construction experience.",
        remarks: "Incomplete employer and job requirement information.",
        convertedJobId: null,
    },
    {
        id: "MR-2026-005",
        employer: "Sunrise Care Services",
        contactPerson: "Patricia Flores",
        email: "patricia@example.com",
        phone: "09215678912",
        position: "Caregiver",
        country: "Japan",
        vacancies: 12,
        salary: "¥190,000 - ¥240,000",
        employmentType: "Full-time",
        dateRequested: "2026-10-05",
        deadline: "2026-12-15",
        status: "Converted",
        requirements: "Relevant caregiving training or experience preferred.",
        remarks: "Approved and converted into a job opening.",
        convertedJobId: "JOB-2026-003",
    },
    {
        id: "MR-2026-006",
        employer: "Metro Logistics International",
        contactPerson: "Kevin Bautista",
        email: "kevin@example.com",
        phone: "09226789123",
        position: "Production Operator",
        country: "South Korea",
        vacancies: 20,
        salary: "₩2,300,000 - ₩2,700,000",
        employmentType: "Full-time",
        dateRequested: "2026-10-06",
        deadline: "2026-12-10",
        status: "Pending",
        requirements: "Must be able to follow production procedures and safety standards.",
        remarks: "",
        convertedJobId: null,
    },
    {
        id: "MR-2026-007",
        employer: "Blue Horizon Trading",
        contactPerson: "Sofia Castillo",
        email: "sofia@example.com",
        phone: "09237891234",
        position: "Hotel Staff",
        country: "Hong Kong",
        vacancies: 6,
        salary: "HK$12,000 - HK$15,000",
        employmentType: "Contract",
        dateRequested: "2026-10-07",
        deadline: "2026-12-20",
        status: "Approved",
        requirements: "Good communication skills and customer service orientation.",
        remarks: "Approved pending job opening creation.",
        convertedJobId: null,
    },
    {
        id: "MR-2026-008",
        employer: "Evergreen Food Industries",
        contactPerson: "Adrian Villanueva",
        email: "adrian@example.com",
        phone: "09248912345",
        position: "Food Production Worker",
        country: "Taiwan",
        vacancies: 18,
        salary: "NT$27,000 - NT$31,000",
        employmentType: "Full-time",
        dateRequested: "2026-10-08",
        deadline: "2026-12-22",
        status: "Pending",
        requirements: "Must follow hygiene and workplace safety requirements.",
        remarks: "",
        convertedJobId: null,
    },
];

const STATUS_STYLES = {
    Pending: "bg-amber-100 text-amber-800",
    Approved: "bg-emerald-100 text-emerald-800",
    Rejected: "bg-red-100 text-red-700",
    Converted: "bg-blue-100 text-blue-800",
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const ManpowerRequestManagement = () => {
    const [requests, setRequests] = useState(INITIAL_REQUESTS);
    const [activeTab, setActiveTab] = useState("All");
    const [search, setSearch] = useState("");
    const [countryFilter, setCountryFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [reviewRequest, setReviewRequest] = useState(null);
    const [reviewRemarks, setReviewRemarks] = useState("");
    const [showJobForm, setShowJobForm] = useState(false);
    const [jobRequest, setJobRequest] = useState(null);
    const [jobForm, setJobForm] = useState({
        title: "",
        employer: "",
        country: "",
        vacancies: "",
        salary: "",
        deadline: "",
        employmentType: "Full-time",
        description: "",
    });

    const countries = useMemo(() => [...new Set(requests.map((request) => request.country))].sort(), [requests]);

    const counts = useMemo(() => {
        const result = {
            All: requests.length,
            Pending: 0,
            Approved: 0,
            Rejected: 0,
            Converted: 0,
        };

        requests.forEach((request) => {
            result[request.status] = (result[request.status] || 0) + 1;
        });

        return result;
    }, [requests]);

    const filteredRequests = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return requests.filter((request) => {
            const matchesTab = activeTab === "All" || request.status === activeTab;

            const matchesCountry = countryFilter === "All" || request.country === countryFilter;

            const matchesSearch =
                !keyword ||
                [request.id, request.employer, request.contactPerson, request.position, request.country].some((value) =>
                    value.toLowerCase().includes(keyword)
                );

            return matchesTab && matchesCountry && matchesSearch;
        });
    }, [requests, activeTab, countryFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filteredRequests.length / perPage));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedRequests = filteredRequests.slice((safePage - 1) * perPage, safePage * perPage);

    const updateRequest = (id, updates) => {
        setRequests((previous) => previous.map((request) => (request.id === id ? {...request, ...updates} : request)));

        setSelectedRequest((previous) => (previous?.id === id ? {...previous, ...updates} : previous));
    };

    const changeTab = (tab) => {
        setActiveTab(tab);
        setCurrentPage(1);
    };

    const openReview = (request) => {
        setReviewRequest(request);
        setReviewRemarks(request.remarks || "");
    };

    const submitReview = (status) => {
        if (!reviewRequest) return;

        updateRequest(reviewRequest.id, {
            status,
            remarks: reviewRemarks.trim(),
        });

        setReviewRequest(null);
    };

    const openJobForm = (request) => {
        setJobRequest(request);
        setJobForm({
            title: request.position,
            employer: request.employer,
            country: request.country,
            vacancies: String(request.vacancies),
            salary: request.salary,
            deadline: request.deadline,
            employmentType: request.employmentType,
            description: request.requirements,
        });
        setSelectedRequest(null);
        setShowJobForm(true);
    };

    const convertToJob = (event) => {
        event.preventDefault();

        if (!jobRequest) return;

        // TODO: Replace with POST request to the Laravel Job Openings API.
        const jobId = `JOB-${new Date().getFullYear()}-${String(
            requests.filter((request) => request.convertedJobId).length + 1
        ).padStart(3, "0")}`;

        updateRequest(jobRequest.id, {
            status: "Converted",
            remarks: `Converted into job opening ${jobId}.`,
            convertedJobId: jobId,
        });

        setShowJobForm(false);
        setJobRequest(null);
    };

    const approveRequest = (request) => {
        updateRequest(request.id, {
            status: "Approved",
            remarks: request.remarks || "Manpower request approved.",
        });
    };

    const rejectRequest = (request) => {
        const reason = window.prompt(`Enter a reason for rejecting ${request.id}:`, request.remarks || "");

        if (reason === null) return;

        updateRequest(request.id, {
            status: "Rejected",
            remarks: reason.trim() || "Request rejected.",
        });
    };

    const renderPagination = () => {
        const pages = Array.from({length: totalPages}, (_, index) => index + 1);

        return (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>
                        Showing{" "}
                        <strong className="text-slate-800">
                            {filteredRequests.length === 0 ? 0 : (safePage - 1) * perPage + 1}
                            {"–"}
                            {Math.min(safePage * perPage, filteredRequests.length)}
                        </strong>{" "}
                        of <strong className="text-slate-800">{filteredRequests.length}</strong> requests
                    </span>

                    <select
                        value={perPage}
                        onChange={(event) => {
                            setPerPage(Number(event.target.value));
                            setCurrentPage(1);
                        }}
                        aria-label="Requests per page"
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-900"
                    >
                        <option value={5}>5 / page</option>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                    </select>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        disabled={safePage === 1}
                        onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                        aria-label="Previous page"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronLeft size={17} />
                    </button>

                    {pages.map((page) => (
                        <button
                            type="button"
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium ${
                                safePage === page ? "bg-blue-950 text-white" : "text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        type="button"
                        disabled={safePage === totalPages}
                        onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                        aria-label="Next page"
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <ChevronRight size={17} />
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            {/* Page heading */}
            <div className="mb-7">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-900">Recruitment</p>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Manpower Requests</h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                    Review employer staffing requests, approve or reject submissions, and convert approved requests into
                    job openings.
                </p>
            </div>

            {/* Summary cards */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        label: "Total Requests",
                        value: counts.All,
                        icon: FileText,
                        iconStyle: "bg-blue-50 text-blue-900",
                    },
                    {
                        label: "Pending Review",
                        value: counts.Pending,
                        icon: Clock3,
                        iconStyle: "bg-amber-50 text-amber-700",
                    },
                    {
                        label: "Approved",
                        value: counts.Approved,
                        icon: CheckCircle2,
                        iconStyle: "bg-emerald-50 text-emerald-700",
                    },
                    {
                        label: "Converted to Jobs",
                        value: counts.Converted,
                        icon: BriefcaseBusiness,
                        iconStyle: "bg-violet-50 text-violet-700",
                    },
                ].map((card) => {
                    const Icon = card.icon;

                    return (
                        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconStyle}`}
                                >
                                    <Icon size={20} />
                                </div>
                            </div>
                            <p className="mt-4 text-3xl font-bold text-slate-900">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Status tabs */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                    <h2 className="font-semibold text-slate-900">Request Status</h2>
                    <p className="mt-1 text-sm text-slate-500">Filter requests by their current review status.</p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {REQUEST_STATUSES.map((tab) => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.value;

                        return (
                            <button
                                type="button"
                                key={tab.value}
                                onClick={() => changeTab(tab.value)}
                                className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                                    active
                                        ? "border-blue-950 bg-blue-950 text-white"
                                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs ${
                                        active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {counts[tab.value] ?? 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Requests table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            {activeTab === "All"
                                ? "All Manpower Requests"
                                : activeTab === "Pending"
                                ? "Pending Requests"
                                : activeTab === "Converted"
                                ? "Converted Job Requests"
                                : `${activeTab} Requests`}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review request details and take the appropriate action.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1 sm:min-w-64">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search employer, request ID..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={countryFilter}
                                onChange={(event) => {
                                    setCountryFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                aria-label="Filter by country"
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm outline-none focus:border-blue-900 sm:w-auto"
                            >
                                <option value="All">All Countries</option>
                                {countries.map((country) => (
                                    <option key={country} value={country}>
                                        {country}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={15}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-4 font-semibold">Request</th>
                                <th className="px-5 py-4 font-semibold">Employer</th>
                                <th className="px-5 py-4 font-semibold">Position</th>
                                <th className="px-5 py-4 font-semibold">Vacancies</th>
                                <th className="px-5 py-4 font-semibold">Date Requested</th>
                                <th className="px-5 py-4 font-semibold">Status</th>
                                <th className="px-5 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {paginatedRequests.map((request) => (
                                <tr key={request.id} className="transition hover:bg-slate-50/70">
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900">{request.id}</p>
                                        <p className="mt-1 text-xs text-slate-500">{request.country}</p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-medium text-slate-800">{request.employer}</p>
                                        <p className="mt-1 text-xs text-slate-500">{request.contactPerson}</p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-medium text-slate-800">{request.position}</p>
                                        <p className="mt-1 text-xs text-slate-500">{request.employmentType}</p>
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-slate-900">{request.vacancies}</span>
                                        <span className="ml-1 text-slate-500">positions</span>
                                    </td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                        {formatDate(request.dateRequested)}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                STATUS_STYLES[request.status]
                                            }`}
                                        >
                                            {request.status === "Converted" ? "Converted to Job" : request.status}
                                        </span>
                                        {request.convertedJobId && (
                                            <p className="mt-1 text-xs text-blue-900">{request.convertedJobId}</p>
                                        )}
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                title="View request details"
                                                onClick={() => setSelectedRequest(request)}
                                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            {request.status === "Pending" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        title="Approve request"
                                                        onClick={() => approveRequest(request)}
                                                        className="rounded-lg border border-slate-200 p-2 text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        title="Reject request"
                                                        onClick={() => rejectRequest(request)}
                                                        className="rounded-lg border border-slate-200 p-2 text-red-600 hover:border-red-200 hover:bg-red-50"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            )}

                                            {request.status === "Approved" && (
                                                <button
                                                    type="button"
                                                    title="Convert to job opening"
                                                    onClick={() => openJobForm(request)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-900"
                                                >
                                                    <Plus size={14} />
                                                    Create Job
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedRequests.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-5 py-16 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <FileText size={22} className="text-slate-400" />
                                        </div>
                                        <p className="font-semibold text-slate-800">No manpower requests found</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Try another search term, country, or status.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {renderPagination()}
            </div>

            {/* Request details modal */}
            {selectedRequest && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedRequest(null);
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Manpower Request
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedRequest.position}</h2>
                                <p className="mt-1 text-sm text-slate-500">{selectedRequest.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedRequest(null)}
                                aria-label="Close details"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-950 text-white">
                                        <Building2 size={21} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{selectedRequest.employer}</p>
                                        <p className="mt-1 text-sm text-slate-500">{selectedRequest.contactPerson}</p>
                                    </div>
                                </div>
                                <span
                                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                                        STATUS_STYLES[selectedRequest.status]
                                    }`}
                                >
                                    {selectedRequest.status}
                                </span>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {[
                                    {
                                        label: "Contact Email",
                                        value: selectedRequest.email,
                                        icon: UserRound,
                                    },
                                    {
                                        label: "Contact Number",
                                        value: selectedRequest.phone,
                                        icon: Users,
                                    },
                                    {
                                        label: "Destination Country",
                                        value: selectedRequest.country,
                                        icon: MapPin,
                                    },
                                    {
                                        label: "Vacancies",
                                        value: `${selectedRequest.vacancies} positions`,
                                        icon: Users,
                                    },
                                    {
                                        label: "Salary Range",
                                        value: selectedRequest.salary,
                                        icon: BriefcaseBusiness,
                                    },
                                    {
                                        label: "Employment Type",
                                        value: selectedRequest.employmentType,
                                        icon: FileText,
                                    },
                                    {
                                        label: "Date Requested",
                                        value: formatDate(selectedRequest.dateRequested),
                                        icon: CalendarDays,
                                    },
                                    {
                                        label: "Application Deadline",
                                        value: formatDate(selectedRequest.deadline),
                                        icon: CalendarDays,
                                    },
                                ].map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div key={item.label} className="flex gap-3">
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                <Icon size={17} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-slate-500">{item.label}</p>
                                                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                                                    {item.value || "—"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div>
                                <h3 className="mb-2 font-semibold text-slate-900">Job Requirements / Notes</h3>
                                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
                                    {selectedRequest.requirements || "No requirements provided."}
                                </p>
                            </div>

                            <div>
                                <h3 className="mb-2 flex items-center gap-2 font-semibold text-slate-900">
                                    <MessageSquareText size={17} className="text-blue-900" />
                                    Review Remarks
                                </h3>
                                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-600">
                                    {selectedRequest.remarks || "No review remarks yet."}
                                </p>
                            </div>

                            {selectedRequest.convertedJobId && (
                                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-800">
                                        Job Opening Created
                                    </p>
                                    <p className="mt-1 font-bold text-blue-950">{selectedRequest.convertedJobId}</p>
                                    <p className="mt-1 text-sm text-blue-800">
                                        This request has already been converted.
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row">
                                {selectedRequest.status === "Pending" && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const request = selectedRequest;
                                                setSelectedRequest(null);
                                                openReview(request);
                                            }}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                        >
                                            <FileText size={16} />
                                            Review Request
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                approveRequest(selectedRequest);
                                                setSelectedRequest(null);
                                            }}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                                        >
                                            <Check size={16} />
                                            Approve Request
                                        </button>
                                    </>
                                )}

                                {selectedRequest.status === "Approved" && (
                                    <button
                                        type="button"
                                        onClick={() => openJobForm(selectedRequest)}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                                    >
                                        <BriefcaseBusiness size={16} />
                                        Convert to Job Opening
                                        <ArrowRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Review / rejection modal */}
            {reviewRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Request Review
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">{reviewRequest.employer}</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {reviewRequest.id} · {reviewRequest.position}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReviewRequest(null)}
                                aria-label="Close review"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="rounded-xl bg-slate-50 p-4">
                                <p className="text-sm text-slate-500">Requested vacancies</p>
                                <p className="mt-1 text-2xl font-bold text-slate-900">{reviewRequest.vacancies}</p>
                                <p className="mt-1 text-sm text-slate-600">
                                    {reviewRequest.position} · {reviewRequest.country}
                                </p>
                            </div>

                            <label htmlFor="review-remarks" className="block text-sm font-semibold text-slate-700">
                                Review Remarks
                                <textarea
                                    id="review-remarks"
                                    rows={4}
                                    value={reviewRemarks}
                                    onChange={(event) => setReviewRemarks(event.target.value)}
                                    placeholder="Add approval notes or explain why the request is rejected..."
                                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-normal outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                                />
                            </label>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => submitReview("Rejected")}
                                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50"
                            >
                                Reject Request
                            </button>
                            <button
                                type="button"
                                onClick={() => submitReview("Approved")}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                            >
                                <Check size={16} />
                                Approve Request
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Convert approved request into a job opening */}
            {showJobForm && jobRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
                    <form
                        onSubmit={convertToJob}
                        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Job Management
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">Create Job Opening</h2>
                                <p className="mt-1 text-sm text-slate-500">Based on approved request {jobRequest.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowJobForm(false);
                                    setJobRequest(null);
                                }}
                                aria-label="Close job form"
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="job-title"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Job Title *
                                </label>
                                <input
                                    id="job-title"
                                    required
                                    value={jobForm.title}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            title: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="job-employer"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Employer *
                                </label>
                                <input
                                    id="job-employer"
                                    required
                                    value={jobForm.employer}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            employer: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="job-country"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Destination Country *
                                </label>
                                <input
                                    id="job-country"
                                    required
                                    value={jobForm.country}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            country: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="job-vacancies"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Number of Vacancies *
                                </label>
                                <input
                                    id="job-vacancies"
                                    type="number"
                                    min="1"
                                    required
                                    value={jobForm.vacancies}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            vacancies: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="job-salary"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Salary Range *
                                </label>
                                <input
                                    id="job-salary"
                                    required
                                    value={jobForm.salary}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            salary: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="job-employment-type"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Employment Type *
                                </label>
                                <select
                                    id="job-employment-type"
                                    required
                                    value={jobForm.employmentType}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            employmentType: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Part-time">Part-time</option>
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="job-deadline"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Application Deadline *
                                </label>
                                <input
                                    id="job-deadline"
                                    type="date"
                                    required
                                    value={jobForm.deadline}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            deadline: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="job-description"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Job Description / Requirements
                                </label>
                                <textarea
                                    id="job-description"
                                    rows={4}
                                    value={jobForm.description}
                                    onChange={(event) =>
                                        setJobForm((previous) => ({
                                            ...previous,
                                            description: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-900"
                                />
                            </div>

                            <div className="sm:col-span-2 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm leading-5 text-blue-900">
                                The job details are pre-filled from the approved request. Review them before creating
                                the job opening. Connect this form to Job Management's API when the backend is
                                available.
                            </div>
                        </div>

                        <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowJobForm(false);
                                    setJobRequest(null);
                                }}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                            >
                                <Plus size={16} />
                                Create Job Opening
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ManpowerRequestManagement;
