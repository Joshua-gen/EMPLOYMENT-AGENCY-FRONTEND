import {useState} from "react";
import {Plus} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Text from "../../components/ui/Text";
import ConfirmModal from "../../shared/components/ConfirmModal";
import Pagination from "../../shared/components/Pagination";
import useToast from "../../shared/hooks/useToast";
import CountrySelect from "../../features/countries/components/CountrySelect";
import {jobApi} from "../../features/jobs/api/jobApi";
import JobDetailsModal from "../../features/jobs/components/JobDetailsModal";
import JobFormModal from "../../features/jobs/components/JobFormModal";
import JobSummaryCards from "../../features/jobs/components/JobSummaryCards";
import JobTable from "../../features/jobs/components/JobTable";
import useJobs from "../../features/jobs/hooks/useJobs";

const STATUS_OPTIONS = [
    {value: "All", label: "All Statuses"},
    {value: "Published", label: "Published"},
    {value: "Draft", label: "Draft"},
    {value: "Closed", label: "Closed"},
];

const JobManagement = () => {
    const toast = useToast();

    const {
        jobs,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStatus,
        setCountry,
        setPage,
        setPerPage,
        createJob,
        updateJob,
        changeStatus,
        deleteJob,
    } = useJobs();

    const [modal, setModal] = useState(null); // "create" | "edit" | "details"
    const [selectedJob, setSelectedJob] = useState(null);
    const [jobToDelete, setJobToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

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
        jobApi
        .get(job.id)
        .then((res) => setSelectedJob(res.data))
        .catch(() => {});
    };

    const closeModal = () => {
        setModal(null);
        setSelectedJob(null);
    };

    // Ang form modal ang nagpapakita ng field errors, kaya toast lang ang success dito
    const handleCreate = async (data) => {
        const result = await createJob(data);
        if (result.ok) toast.success("Job opening created as draft.");
        return result;
    };

    const handleUpdate = async (data) => {
        const result = await updateJob(selectedJob.id, data);
        if (result.ok) toast.success("Job opening updated.");
        return result;
    };

    const handleStatus = async (job, status) => {
        const result = await changeStatus(job.id, status);

        if (result.ok) toast.success(`"${job.title}" is now ${status}.`);
        else toast.error(result.message, {title: "Status update failed"});
    };

    const handleDelete = (job) => setJobToDelete(job);

    const confirmDelete = async () => {
        setDeleting(true);

        const result = await deleteJob(jobToDelete.id);

        if (result.ok) toast.success(`"${jobToDelete.title}" was deleted.`);
        else toast.error(result.message, {title: "Delete failed"});

        setDeleting(false);
        setJobToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Text size="sm" weight="bold" className="uppercase tracking-[0.18em] text-[#4F7383]">
                            Recruitment Management
                        </Text>
                        <Heading as="h1" className="mt-1">
                            Job Management
                        </Heading>
                        <Text size="sm" className="mt-2 text-gray-500">
                            Create and manage job openings, details, and publication status.
                        </Text>
                    </div>

                    <Button type="button" onClick={openCreate}>
                        <Plus size={18} />
                        Create Job Opening
                    </Button>
                </section>

                {error && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </Text>
                )}

                <JobSummaryCards summary={summary} />

                {/* Table */}
                <Card className="overflow-visible !p-0">
                    <div className="border-b border-gray-100 p-5">
                        <Heading as="h2" className="text-lg">
                            Job Openings
                        </Heading>
                        <Text size="sm" className="mt-1 text-gray-500">
                            View, search, and manage available positions.
                        </Text>

                        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[1fr_220px_240px]">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search title or country..."
                                value={filters.search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            <Select
                                name="status"
                                value={filters.status}
                                onChange={(event) => setStatus(event.target.value)}
                                options={STATUS_OPTIONS}
                            />

                            <CountrySelect includeAll value={filters.country} onChange={setCountry} />
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

                    <Pagination
                        meta={meta}
                        perPage={filters.perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            </div>

            {(modal === "create" || modal === "edit") && (
                <JobFormModal
                    mode={modal}
                    job={selectedJob}
                    onClose={closeModal}
                    onSubmit={modal === "create" ? handleCreate : handleUpdate}
                />
            )}

            {modal === "details" && selectedJob && (
                <JobDetailsModal job={selectedJob} onClose={closeModal} onEdit={openEdit} />
            )}

            {jobToDelete && (
                <ConfirmModal
                    title="Delete Job Opening"
                    message={`Delete "${jobToDelete.title}"? This cannot be undone.`}
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onClose={() => setJobToDelete(null)}
                />
            )}
        </div>
    );
};

export default JobManagement;
