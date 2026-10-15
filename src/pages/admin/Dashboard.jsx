import {
    Users,
    BriefcaseBusiness,
    Clock,
    UserCheck,
    CalendarDays,
    FileClock,
    Plane,
    ArrowUpRight,
    ArrowRight,
} from "lucide-react";
import {Link} from "react-router-dom";

const stats = [
    {
        label: "Total Applicants",
        value: "248",
        description: "All registered applicants",
        icon: Users,
        color: "bg-blue-50 text-blue-950",
    },
    {
        label: "Active Job Openings",
        value: "12",
        description: "Currently published jobs",
        icon: BriefcaseBusiness,
        color: "bg-indigo-50 text-indigo-700",
    },
    {
        label: "Pending Applications",
        value: "36",
        description: "Awaiting initial review",
        icon: Clock,
        color: "bg-amber-50 text-amber-700",
    },
    {
        label: "Shortlisted Applicants",
        value: "18",
        description: "Qualified for next steps",
        icon: UserCheck,
        color: "bg-emerald-50 text-emerald-700",
    },
    {
        label: "Applicants for Interview",
        value: "14",
        description: "Awaiting interview",
        icon: CalendarDays,
        color: "bg-violet-50 text-violet-700",
    },
    {
        label: "Applicants for Processing",
        value: "9",
        description: "Documents and requirements",
        icon: FileClock,
        color: "bg-orange-50 text-orange-700",
    },
    {
        label: "Deployed Applicants",
        value: "42",
        description: "Successfully deployed workers",
        icon: Plane,
        color: "bg-cyan-50 text-cyan-700",
    },
];

const recentApplications = [
    {
        id: "APP-2026-001",
        name: "Juan Dela Cruz",
        position: "Factory Worker",
        date: "Oct 06, 2026",
        status: "Under Review",
    },
    {
        id: "APP-2026-002",
        name: "Maria Santos",
        position: "Caregiver",
        date: "Oct 06, 2026",
        status: "Shortlisted",
    },
    {
        id: "APP-2026-003",
        name: "Pedro Reyes",
        position: "Welder",
        date: "Oct 05, 2026",
        status: "Interview",
    },
    {
        id: "APP-2026-004",
        name: "Ana Garcia",
        position: "Hotel Staff",
        date: "Oct 05, 2026",
        status: "Processing",
    },
];

const statusStyles = {
    "Under Review": "bg-amber-50 text-amber-700 ring-amber-600/20",
    Shortlisted: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Interview: "bg-violet-50 text-violet-700 ring-violet-600/20",
    Processing: "bg-blue-50 text-blue-950 ring-blue-600/20",
};

const Dashboard = () => {
    const currentDate = new Intl.DateTimeFormat("en-PH", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(new Date());

    return (
        <div className="min-h-screen bg-slate-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Page Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-950">Recruitment Management</p>

                        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Dashboard</h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Welcome to your admin dashboard. Here's an overview of your recruitment activities.
                        </p>
                    </div>
                </section>

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900">Recruitment Overview</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            A summary of your applicants and recruitment progress.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {stats.map((stat) => {
                            const Icon = stat.icon;

                            return (
                                <div
                                    key={stat.label}
                                    className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium leading-5 text-slate-500">{stat.label}</p>

                                            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                                                {stat.value}
                                            </h3>
                                        </div>

                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                                        >
                                            <Icon size={21} />
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t border-slate-100 pt-3">
                                        <p className="text-xs leading-5 text-slate-500">{stat.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Recent Applications */}
                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Latest submissions and their current recruitment status.
                            </p>
                        </div>

                        <Link
                            to="/dashboard/applicants"
                            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-blue-950 transition hover:border-blue-950 hover:bg-blue-950 hover:text-white"
                        >
                            View applicants
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[680px] text-left text-sm">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-slate-200">
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Application ID
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Applicant
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Position
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Date Applied
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {recentApplications.map((application) => (
                                    <tr key={application.id} className="transition-colors hover:bg-slate-50">
                                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-700">
                                            {application.id}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-950">
                                                    {application.name
                                                    .split(" ")
                                                    .slice(0, 2)
                                                    .map((part) => part[0])
                                                    .join("")}
                                                </div>

                                                <span className="font-semibold text-slate-800">{application.name}</span>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                            {application.position}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                                            {application.date}
                                        </td>

                                        <td className="whitespace-nowrap px-5 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
                                                    statusStyles[application.status] ??
                                                    "bg-slate-100 text-slate-600 ring-slate-500/20"
                                                }`}
                                            >
                                                {application.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">Displaying sample application records.</p>

                        <Link
                            to="/dashboard/applicants"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-950 hover:text-blue-700"
                        >
                            Manage applicants
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
