import {useState} from "react";
import {Plus, Search} from "lucide-react";
import Pagination from "../../shared/components/Pagination";
import {jobApi} from "../../features/jobs/api/jobApi";
import JobDetailsModal from "../../features/jobs/components/JobDetailsModal";
import JobFormModal from "../../features/jobs/components/JobFormModal";
import JobSummaryCards from "../../features/jobs/components/JobSummaryCards";
import JobTable from "../../features/jobs/components/JobTable";
import useJobs from "../../features/jobs/hooks/useJobs";

const JobManagement = () => {
    const {
        jobs,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStatus,
        setPage,
        setPerPage,
        createJob,
        updateJob,
        changeStatus,
        deleteJob,
    } = useJobs();

    const [modal, setModal] = useState(null); // "create" | "edit" | "details"
    const [selectedJob, setSelectedJob] = useState(null);
    const [actionError, setActionError] = useState("");

    const openCreate = () => {
        setSelectedJob(null);
        setModal("create");
    };

    const openEdit = (job) => {
        setSelectedJob(job);
        setModal("edit");
    };

    const openDetails = (job) => {
        setSelectedJob(job);
        setModal("details");
        // kunin ang pinakabagong data (GET /jobs/{id})
        jobApi
        .get(job.id)
        .then((res) => setSelectedJob(res.data))
        .catch(() => {});
    };

    const closeModal = () => {
        setModal(null);
        setSelectedJob(null);
    };

    const handleStatus = async (job, status) => {
        setActionError("");
        const result = await changeStatus(job.id, status);
        if (!result.ok) setActionError(result.message);
    };

    const handleDelete = async (job) => {
        if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;

        setActionError("");
        const result = await deleteJob(job.id);
        if (!result.ok) setActionError(result.message);
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-blue-950">Recruitment Management</p>
                        <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">Job Management</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Create and manage job openings, details, and publication status.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-blue-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-900"
                    >
                        <Plus size={18} />
                        Create Job Opening
                    </button>
                </section>

                {(error || actionError) && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{actionError || error}</p>
                )}

                <JobSummaryCards summary={summary} />

                {/* Table */}
                <section className="overflow-visible rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 p-5">
                        <h2 className="font-bold text-slate-900">Job Openings</h2>
                        <p className="mt-1 text-sm text-slate-500">View, search, and manage available positions.</p>

                        <div className="mt-5 flex flex-col gap-3 md:flex-row">
                            <div className="relative min-w-0 flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="search"
                                    value={filters.search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search title, employer, or country..."
                                    className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10"
                                />
                            </div>

                            <select
                                value={filters.status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-950 md:w-44"
                            >
                                <option value="All">All Statuses</option>
                                <option value="Published">Published</option>
                                <option value="Draft">Draft</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>
                    </div>

                    <JobTable
                        jobs={jobs}
                        loading={loading}
                        onView={openDetails}
                        onEdit={openEdit}
                        onStatus={handleStatus}
                        onDelete={handleDelete}
                    />

                    <Pagination meta={meta} onPageChange={setPage} onPerPageChange={setPerPage} />
                </section>
            </div>

            {(modal === "create" || modal === "edit") && (
                <JobFormModal
                    mode={modal}
                    job={selectedJob}
                    onClose={closeModal}
                    onSubmit={modal === "create" ? createJob : (data) => updateJob(selectedJob.id, data)}
                />
            )}

            {modal === "details" && selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={closeModal} onEdit={openEdit} />
            )}
        </div>
    );
};

export default JobManagement;
