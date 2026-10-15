import {useMemo, useState} from "react";
import {
    Search,
    Users,
    FileText,
    Clock3,
    UserCheck,
    CalendarDays,
    CheckCircle2,
    Plane,
    XCircle,
    Eye,
    Pencil,
    MessageSquareText,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Filter,
    X,
    ExternalLink,
} from "lucide-react";

const STAGES = [
    {label: "All Applicants", value: "All", icon: Users},
    {label: "Submitted", value: "Submitted", icon: FileText},
    {label: "Under Review", value: "Under Review", icon: Clock3},
    {label: "Shortlisted", value: "Shortlisted", icon: UserCheck},
    {label: "Interview", value: "Interview", icon: CalendarDays},
    {label: "Selected", value: "Selected", icon: CheckCircle2},
    {label: "Processing", value: "Processing", icon: FileText},
    {label: "Deployed", value: "Deployed", icon: Plane},
    {label: "Rejected", value: "Rejected", icon: XCircle},
];

const PIPELINE = ["Submitted", "Under Review", "Shortlisted", "Interview", "Selected", "Processing", "Deployed"];

const INITIAL_APPLICANTS = [
    {
        id: "APP-2026-001",
        name: "Mark Anthony Santos",
        email: "mark.santos@example.com",
        phone: "09171234567",
        position: "Warehouse Worker",
        country: "Taiwan",
        date: "2026-10-01",
        status: "Submitted",
        documents: ["Resume", "Passport", "Valid ID"],
        remarks: "",
    },
    {
        id: "APP-2026-002",
        name: "Maria Angela Reyes",
        email: "maria.reyes@example.com",
        phone: "09182345678",
        position: "Factory Worker",
        country: "South Korea",
        date: "2026-10-02",
        status: "Under Review",
        documents: ["Resume", "Passport", "Medical Certificate"],
        remarks: "Initial documents received.",
    },
    {
        id: "APP-2026-003",
        name: "John Michael Cruz",
        email: "john.cruz@example.com",
        phone: "09193456789",
        position: "Production Operator",
        country: "Japan",
        date: "2026-10-02",
        status: "Shortlisted",
        documents: ["Resume", "Passport", "Valid ID"],
        remarks: "Qualified for initial interview.",
    },
    {
        id: "APP-2026-004",
        name: "Angelica Mae Garcia",
        email: "angelica.garcia@example.com",
        phone: "09204567891",
        position: "Caregiver",
        country: "Japan",
        date: "2026-10-03",
        status: "Interview",
        documents: ["Resume", "Passport", "Training Certificate"],
        remarks: "Interview scheduled. Confirm attendance.",
    },
    {
        id: "APP-2026-005",
        name: "Daniel Joseph Mendoza",
        email: "daniel.mendoza@example.com",
        phone: "09215678912",
        position: "Construction Worker",
        country: "Saudi Arabia",
        date: "2026-10-03",
        status: "Selected",
        documents: ["Resume", "Passport", "Valid ID"],
        remarks: "Selected by the employer.",
    },
    {
        id: "APP-2026-006",
        name: "Patricia Anne Flores",
        email: "patricia.flores@example.com",
        phone: "09226789123",
        position: "Hotel Staff",
        country: "United Arab Emirates",
        date: "2026-10-04",
        status: "Processing",
        documents: ["Resume", "Passport", "Medical Certificate"],
        remarks: "Processing pre-departure requirements.",
    },
    {
        id: "APP-2026-007",
        name: "Kevin Rafael Torres",
        email: "kevin.torres@example.com",
        phone: "09237891234",
        position: "Factory Worker",
        country: "Taiwan",
        date: "2026-10-04",
        status: "Deployed",
        documents: ["Resume", "Passport", "Employment Contract"],
        remarks: "Deployment completed.",
    },
    {
        id: "APP-2026-008",
        name: "Christine Joy Ramos",
        email: "christine.ramos@example.com",
        phone: "09248912345",
        position: "Domestic Worker",
        country: "Hong Kong",
        date: "2026-10-05",
        status: "Rejected",
        documents: ["Resume", "Passport"],
        remarks: "Does not meet the position requirements.",
    },
    {
        id: "APP-2026-009",
        name: "Ramon Luis Bautista",
        email: "ramon.bautista@example.com",
        phone: "09259012345",
        position: "Production Operator",
        country: "Japan",
        date: "2026-10-05",
        status: "Submitted",
        documents: ["Resume", "Valid ID"],
        remarks: "",
    },
    {
        id: "APP-2026-010",
        name: "Sofia Nicole Castillo",
        email: "sofia.castillo@example.com",
        phone: "09260123456",
        position: "Caregiver",
        country: "Japan",
        date: "2026-10-06",
        status: "Under Review",
        documents: ["Resume", "Passport"],
        remarks: "Passport copy needs verification.",
    },
    {
        id: "APP-2026-011",
        name: "Adrian Paul Villanueva",
        email: "adrian.villanueva@example.com",
        phone: "09271234567",
        position: "Warehouse Worker",
        country: "Taiwan",
        date: "2026-10-06",
        status: "Interview",
        documents: ["Resume", "Passport", "Valid ID"],
        remarks: "For final interview.",
    },
    {
        id: "APP-2026-012",
        name: "Beatrice Anne Lim",
        email: "beatrice.lim@example.com",
        phone: "09282345678",
        position: "Hotel Staff",
        country: "UAE",
        date: "2026-10-06",
        status: "Processing",
        documents: ["Resume", "Passport", "Medical Certificate"],
        remarks: "Awaiting completion of requirements.",
    },
];

const STATUS_STYLES = {
    Submitted: "bg-slate-100 text-slate-700",
    "Under Review": "bg-blue-100 text-blue-800",
    Shortlisted: "bg-violet-100 text-violet-800",
    Interview: "bg-amber-100 text-amber-800",
    Selected: "bg-emerald-100 text-emerald-800",
    Processing: "bg-cyan-100 text-cyan-800",
    Deployed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-700",
};

const EMPTY_FORM = {
    status: "Submitted",
    remarks: "",
};

const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const ApplicantManagement = () => {
    const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
    const [activeStage, setActiveStage] = useState("All");
    const [search, setSearch] = useState("");
    const [countryFilter, setCountryFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(5);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [editingApplicant, setEditingApplicant] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [showDocuments, setShowDocuments] = useState(false);

    const countries = useMemo(
        () => [...new Set(applicants.map((applicant) => applicant.country))].sort(),
        [applicants]
    );

    const stageCounts = useMemo(() => {
        const counts = {All: applicants.length};

        STAGES.forEach((stage) => {
            if (stage.value !== "All") {
                counts[stage.value] = applicants.filter((applicant) => applicant.status === stage.value).length;
            }
        });

        return counts;
    }, [applicants]);

    const filteredApplicants = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return applicants.filter((applicant) => {
            const matchesStage = activeStage === "All" || applicant.status === activeStage;

            const matchesCountry = countryFilter === "All" || applicant.country === countryFilter;

            const matchesSearch =
                !keyword ||
                [applicant.id, applicant.name, applicant.email, applicant.position, applicant.country].some((value) =>
                    value.toLowerCase().includes(keyword)
                );

            return matchesStage && matchesCountry && matchesSearch;
        });
    }, [applicants, activeStage, search, countryFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredApplicants.length / perPage));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedApplicants = filteredApplicants.slice((safePage - 1) * perPage, safePage * perPage);

    const updateApplicant = (id, updates) => {
        setApplicants((previous) =>
            previous.map((applicant) => (applicant.id === id ? {...applicant, ...updates} : applicant))
        );

        setSelectedApplicant((previous) => (previous?.id === id ? {...previous, ...updates} : previous));
    };

    const changeStage = (stage) => {
        setActiveStage(stage);
        setCurrentPage(1);
    };

    const openEdit = (applicant) => {
        setEditingApplicant(applicant);
        setForm({
            status: applicant.status,
            remarks: applicant.remarks || "",
        });
    };

    const saveChanges = (event) => {
        event.preventDefault();

        if (!editingApplicant) return;

        updateApplicant(editingApplicant.id, {
            status: form.status,
            remarks: form.remarks.trim(),
        });

        setEditingApplicant(null);
    };

    const rejectApplicant = (applicant) => {
        const confirmed = window.confirm(`Reject the application of ${applicant.name}?`);

        if (!confirmed) return;

        updateApplicant(applicant.id, {status: "Rejected"});
    };

    const getNextStage = (status) => {
        const index = PIPELINE.indexOf(status);

        if (index === -1 || index === PIPELINE.length - 1) return null;

        return PIPELINE[index + 1];
    };

    const renderPagination = () => {
        const pages = Array.from({length: totalPages}, (_, index) => index + 1);

        return (
            <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                    <span>
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                            {filteredApplicants.length === 0 ? 0 : (safePage - 1) * perPage + 1}
                            {"–"}
                            {Math.min(safePage * perPage, filteredApplicants.length)}
                        </span>{" "}
                        of <span className="font-semibold text-slate-800">{filteredApplicants.length}</span> applicants
                    </span>

                    <select
                        value={perPage}
                        onChange={(event) => {
                            setPerPage(Number(event.target.value));
                            setCurrentPage(1);
                        }}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-900"
                        aria-label="Rows per page"
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
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Previous page"
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
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Next page"
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
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-900">Recruitment</p>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Applicant Management
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
                        Review applicant records, manage recruitment stages, and track every application from submission
                        to deployment.
                    </p>
                </div>

                <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <Users size={19} className="text-blue-900" />
                    <div>
                        <p className="text-xs text-slate-500">Total Applicants</p>
                        <p className="text-lg font-bold text-slate-900">{applicants.length}</p>
                    </div>
                </div>
            </div>

            {/* Recruitment pipeline */}
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                    <h2 className="font-semibold text-slate-900">Recruitment Pipeline</h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Select a stage to view and manage applicants at that step.
                    </p>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    {STAGES.map((stage) => {
                        const Icon = stage.icon;
                        const isActive = activeStage === stage.value;

                        return (
                            <button
                                type="button"
                                key={stage.value}
                                onClick={() => changeStage(stage.value)}
                                className={`min-w-[125px] flex-1 rounded-xl border p-3 text-left transition ${
                                    isActive
                                        ? "border-blue-950 bg-blue-950 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-slate-50"
                                }`}
                            >
                                <div className="mb-3 flex items-center justify-between gap-2">
                                    <Icon size={17} className={isActive ? "text-blue-100" : "text-blue-900"} />
                                    <span className={`text-lg font-bold ${isActive ? "text-white" : "text-slate-900"}`}>
                                        {stageCounts[stage.value] ?? 0}
                                    </span>
                                </div>
                                <p className="whitespace-nowrap text-xs font-semibold">{stage.label}</p>
                            </button>
                        );
                    })}
                </div>

                {/* Stage progression reference */}
                <div className="mt-4 hidden items-center gap-2 overflow-x-auto border-t border-slate-100 pt-4 xl:flex">
                    {PIPELINE.map((stage, index) => (
                        <div key={stage} className="flex shrink-0 items-center gap-2">
                            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                {stage}
                            </span>
                            {index < PIPELINE.length - 1 && <ChevronRight size={14} className="text-slate-400" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Applicants table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            {activeStage === "All" ? "All Applicants" : activeStage}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">Review records and take action on applications.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative flex-1 sm:min-w-64">
                            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search name, ID, position..."
                                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                            />
                        </div>

                        <div className="relative">
                            <Filter
                                size={15}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <select
                                value={countryFilter}
                                onChange={(event) => {
                                    setCountryFilter(event.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-blue-900 sm:w-auto"
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
                                <th className="px-5 py-4 font-semibold">Applicant</th>
                                <th className="px-5 py-4 font-semibold">Position</th>
                                <th className="px-5 py-4 font-semibold">Country</th>
                                <th className="px-5 py-4 font-semibold">Date Applied</th>
                                <th className="px-5 py-4 font-semibold">Status</th>
                                <th className="px-5 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                            {paginatedApplicants.map((applicant) => (
                                <tr key={applicant.id} className="transition hover:bg-slate-50/70">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-sm font-bold text-white">
                                                {applicant.name
                                                .split(" ")
                                                .slice(0, 2)
                                                .map((part) => part[0])
                                                .join("")}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{applicant.name}</p>
                                                <p className="mt-1 text-xs text-slate-500">{applicant.id}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-medium text-slate-800">{applicant.position}</p>
                                        <p className="mt-1 text-xs text-slate-500">{applicant.email}</p>
                                    </td>

                                    <td className="px-5 py-4 text-slate-600">{applicant.country}</td>

                                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                        {formatDate(applicant.date)}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                STATUS_STYLES[applicant.status]
                                            }`}
                                        >
                                            {applicant.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <button
                                                type="button"
                                                title="View applicant details"
                                                onClick={() => setSelectedApplicant(applicant)}
                                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                title="Update status and remarks"
                                                onClick={() => openEdit(applicant)}
                                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            {applicant.status !== "Rejected" && applicant.status !== "Deployed" && (
                                                <button
                                                    type="button"
                                                    title="Reject applicant"
                                                    onClick={() => rejectApplicant(applicant)}
                                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {paginatedApplicants.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-16 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                            <Users size={22} className="text-slate-400" />
                                        </div>
                                        <p className="font-semibold text-slate-800">No applicants found</p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Try another search term or recruitment stage.
                                        </p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {renderPagination()}
            </div>

            {/* Applicant details modal */}
            {selectedApplicant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setSelectedApplicant(null);
                            setShowDocuments(false);
                        }
                    }}
                >
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Applicant Details
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">{selectedApplicant.name}</h2>
                                <p className="mt-1 text-sm text-slate-500">{selectedApplicant.id}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedApplicant(null);
                                    setShowDocuments(false);
                                }}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close details"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6 p-5 sm:p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    ["Email Address", selectedApplicant.email],
                                    ["Contact Number", selectedApplicant.phone],
                                    ["Applied Position", selectedApplicant.position],
                                    ["Destination Country", selectedApplicant.country],
                                    ["Date Applied", formatDate(selectedApplicant.date)],
                                ].map(([label, value]) => (
                                    <div key={label}>
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            {label}
                                        </p>
                                        <p className="mt-1 break-words font-medium text-slate-900">{value || "—"}</p>
                                    </div>
                                ))}

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                        Current Status
                                    </p>
                                    <span
                                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                                            STATUS_STYLES[selectedApplicant.status]
                                        }`}
                                    >
                                        {selectedApplicant.status}
                                    </span>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Submitted Documents</h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            Document list is sample data until connected to the backend.
                                        </p>
                                    </div>
                                    <FileText size={20} className="text-blue-900" />
                                </div>

                                <div className="space-y-2">
                                    {selectedApplicant.documents.map((document) => (
                                        <div
                                            key={document}
                                            className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-3"
                                        >
                                            <div className="flex min-w-0 items-center gap-3">
                                                <FileText size={18} className="shrink-0 text-slate-500" />
                                                <span className="text-sm font-medium text-slate-800">{document}</span>
                                            </div>
                                            <span className="shrink-0 text-xs text-amber-700">Review required</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setShowDocuments((value) => !value)}
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:underline"
                                >
                                    <ExternalLink size={15} />
                                    {showDocuments ? "Hide document review notes" : "Review documents"}
                                </button>

                                {showDocuments && (
                                    <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
                                        Actual file previews, downloads, and verification statuses can be connected to
                                        the document API later. No files are attached to this sample record.
                                    </div>
                                )}
                            </div>

                            <div className="rounded-xl border border-slate-200 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <MessageSquareText size={18} className="text-blue-900" />
                                    <h3 className="font-semibold text-slate-900">Recruitment Remarks</h3>
                                </div>
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-600">
                                    {selectedApplicant.remarks || "No remarks added yet."}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                <button
                                    type="button"
                                    onClick={() => {
                                        openEdit(selectedApplicant);
                                        setSelectedApplicant(null);
                                    }}
                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-950 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-900"
                                >
                                    <Pencil size={16} />
                                    Update Status / Remarks
                                </button>

                                {getNextStage(selectedApplicant.status) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const nextStatus = getNextStage(selectedApplicant.status);
                                            updateApplicant(selectedApplicant.id, {
                                                status: nextStatus,
                                            });
                                        }}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                                    >
                                        Move to {getNextStage(selectedApplicant.status)}
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit status / remarks modal */}
            {editingApplicant && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setEditingApplicant(null);
                        }
                    }}
                >
                    <form
                        onSubmit={saveChanges}
                        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="flex items-start justify-between border-b border-slate-200 p-5">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-900">
                                    Manage Application
                                </p>
                                <h2 className="mt-1 text-xl font-bold text-slate-900">Update Applicant</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {editingApplicant.name} · {editingApplicant.id}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingApplicant(null)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                                aria-label="Close edit form"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 p-5">
                            <div>
                                <label
                                    htmlFor="applicant-status"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Recruitment Stage
                                </label>
                                <select
                                    id="applicant-status"
                                    value={form.status}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            status: event.target.value,
                                        }))
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                                >
                                    {STAGES.filter((stage) => stage.value !== "All").map((stage) => (
                                        <option key={stage.value} value={stage.value}>
                                            {stage.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label
                                    htmlFor="applicant-remarks"
                                    className="mb-2 block text-sm font-semibold text-slate-700"
                                >
                                    Remarks / Internal Notes
                                </label>
                                <textarea
                                    id="applicant-remarks"
                                    rows={4}
                                    value={form.remarks}
                                    onChange={(event) =>
                                        setForm((previous) => ({
                                            ...previous,
                                            remarks: event.target.value,
                                        }))
                                    }
                                    placeholder="Add review notes, missing requirements, interview feedback..."
                                    className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
                                />
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-500">
                                Changes update this page's local state only. Backend persistence and status history can
                                be connected later.
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setEditingApplicant(null)}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-xl bg-blue-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ApplicantManagement;
