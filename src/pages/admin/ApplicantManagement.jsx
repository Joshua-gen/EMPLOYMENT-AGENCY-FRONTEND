import {useMemo, useRef, useState} from "react";
import {Inbox, Plane, Plus, Users} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Text from "../../components/ui/Text";
import ConfirmModal from "../../shared/components/ConfirmModal";
import Pagination from "../../shared/components/Pagination";
import SearchableSelect from "../../shared/components/SearchableSelect";
import StatCards from "../../shared/components/StatCards";
import useToast from "../../shared/hooks/useToast";
import {applicantApi} from "../../features/applicants/api/applicantApi";
import ApplicantDetailsModal from "../../features/applicants/components/ApplicantDetailsModal";
import ApplicantFormModal from "../../features/applicants/components/ApplicantFormModal";
import ApplicantStageTabs from "../../features/applicants/components/ApplicantStageTabs";
import ApplicantStatusModal from "../../features/applicants/components/ApplicantStatusModal";
import ApplicantTable from "../../features/applicants/components/ApplicantTable";
import AssignEmployerModal from "../../features/applicants/components/AssignEmployerModal";
import AssignJobModal from "../../features/applicants/components/AssignJobModal";
import {STAGES, VIEW_OPTIONS} from "../../features/applicants/constants";
import useApplicants from "../../features/applicants/hooks/useApplicants";
import CountrySelect from "../../features/countries/components/CountrySelect";
import useJobOptions from "../../features/jobs/hooks/useJobOptions";

const ApplicantManagement = () => {
    const toast = useToast();

    const {
        applicants,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStage,
        setView,
        setJob,
        setCountry,
        setPage,
        setPerPage,
        createApplicant,
        updateApplicant,
        changeStatus,
        assignJob,
        assignEmployer,
    } = useApplicants();

    // lahat ng jobs (kahit Draft/Closed) para sa filter
    const {jobs, loading: jobsLoading} = useJobOptions();
    const jobFilterOptions = useMemo(
        () => jobs.map((job) => ({value: job.id, label: job.title, hint: job.country})),
        [jobs]
    );

    const [modal, setModal] = useState(null); // "create" | "details" | "status" | "assign" | "employer"
    const [selected, setSelected] = useState(null);
    const [toReject, setToReject] = useState(null);
    const [rejecting, setRejecting] = useState(false);

    // applicant na dederetso sa employer step pagkatapos mag-assign ng job
    const nextRef = useRef(null);

    const openModal = (name, applicant = null) => {
        nextRef.current = null;
        setSelected(applicant);
        setModal(name);
    };

    const closeModal = () => {
        const next = nextRef.current;
        nextRef.current = null;

        // chain: Assign Job -> Assign Employer
        if (next) {
            setSelected(next);
            setModal("employer");
            return;
        }

        setModal(null);
        setSelected(null);
    };

    const openDetails = (applicant) => {
        openModal("details", applicant);
        // kunin ang pinakabagong data kasama ang documents (GET /applicants/{id})
        applicantApi
        .get(applicant.id)
        .then((res) => setSelected(res.data))
        .catch(() => {});
    };

    const handleCreate = async (payload) => {
        const result = await createApplicant(payload);

        if (result.ok) {
            const {name, reference} = result.data ?? {};
            toast.success(`${name ?? "Applicant"} added${reference ? ` (${reference})` : ""}.`);
        }
        return result;
    };

    const handleUpdate = async (data) => {
        const result = await updateApplicant(selected.id, data);
        if (result.ok) toast.success("Applicant updated.");
        return result;
    };

    const handleAssign = async (jobId) => {
        const result = await assignJob(selected.id, jobId);

        if (result.ok) {
            toast.success(`${selected.name} assigned to "${result.data?.job?.title ?? "the job opening"}".`);

            if (selected.employer && !result.data?.employer) {
                toast.warning(`${selected.employer.name} was removed because it is not part of the new job.`);
            }

            if (result.data?.status && result.data.status !== selected.status) {
                toast.warning(`Status moved back to ${result.data.status} because the employer was removed.`);
            }

            // wala pang employer -> ituloy sa Assign Employer modal (bagong applicant data)
            if (result.data && !result.data.employer) {
                nextRef.current = result.data;
            }
        }
        return result;
    };

    const handleAssignEmployer = async (employerId) => {
        const result = await assignEmployer(selected.id, employerId);

        if (result.ok) {
            toast.success(`${selected.name} assigned to ${result.data?.employer?.name ?? "the employer"}.`);
        }
        return result;
    };

    const handleMoveNext = async (applicant, stage) => {
        const result = await changeStatus(applicant.id, stage);

        if (result.ok) {
            setSelected(result.data ?? {...applicant, status: stage});
            toast.success(`${applicant.name} moved to ${stage}.`);
        } else {
            toast.error(result.message, {title: "Status update failed"});
        }
    };

    const confirmReject = async () => {
        setRejecting(true);

        const result = await changeStatus(toReject.id, "Rejected");

        if (result.ok) toast.success(`${toReject.name} was rejected.`);
        else toast.error(result.message, {title: "Reject failed"});

        setRejecting(false);
        setToReject(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Text size="sm" weight="bold" className="uppercase tracking-[0.18em] text-[#4F7383]">
                            Recruitment
                        </Text>
                        <Heading as="h1" className="mt-1">
                            Applicant Management
                        </Heading>
                        <Text size="sm" className="mt-2 max-w-2xl text-gray-500">
                            Assign applicants to a job opening and an employer, and track every application from
                            submission to deployment.
                        </Text>
                    </div>

                    <Button type="button" onClick={() => openModal("create")}>
                        <Plus size={18} />
                        Add Applicant
                    </Button>
                </section>

                {error && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </Text>
                )}

                <StatCards
                    columns={3}
                    items={[
                        {label: "Total Applicants", value: summary.All, icon: Users, tone: "blue"},
                        {label: "Not Assigned Yet", value: summary.unassigned, icon: Inbox, tone: "amber"},
                        {label: "Deployed", value: summary.Deployed, icon: Plane, tone: "green"},
                    ]}
                />

                {/* Pipeline */}
                <Card>
                    <Heading as="h2" className="text-lg">
                        Recruitment Pipeline
                    </Heading>
                    <Text size="sm" className="mb-4 mt-1 text-gray-500">
                        Select a stage to view and manage applicants at that step.
                    </Text>

                    <ApplicantStageTabs stages={STAGES} active={filters.stage} counts={summary} onChange={setStage} />
                </Card>

                {/* Table */}
                <Card className="overflow-visible !p-0">
                    <div className="border-b border-gray-100 p-5">
                        <Heading as="h2" className="text-lg">
                            {filters.stage === "All" ? "All Applicants" : filters.stage}
                        </Heading>
                        <Text size="sm" className="mt-1 text-gray-500">
                            Review records and take action on applications.
                        </Text>

                        <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search name, ID, phone, job..."
                                value={filters.search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            <Select
                                name="view"
                                value={filters.view}
                                onChange={(event) => setView(event.target.value)}
                                options={VIEW_OPTIONS}
                            />

                            <SearchableSelect
                                value={filters.jobId}
                                onChange={setJob}
                                options={jobFilterOptions}
                                loading={jobsLoading}
                                allLabel="All Job Openings"
                                placeholder="Filter by job"
                                searchPlaceholder="Search job title or country..."
                                emptyText="No job openings"
                            />

                            <CountrySelect includeAll value={filters.country} onChange={setCountry} />
                        </div>
                    </div>

                    <ApplicantTable
                        applicants={applicants}
                        loading={loading}
                        onView={openDetails}
                        onEdit={(applicant) => openModal("status", applicant)}
                        onAssign={(applicant) => openModal("assign", applicant)}
                        onAssignEmployer={(applicant) => openModal("employer", applicant)}
                        onReject={setToReject}
                    />

                    <Pagination
                        meta={meta}
                        perPage={filters.perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            </div>

            {modal === "create" && <ApplicantFormModal onClose={closeModal} onSubmit={handleCreate} />}

            {modal === "details" && selected && (
                <ApplicantDetailsModal
                    applicant={selected}
                    onClose={closeModal}
                    onEdit={(applicant) => openModal("status", applicant)}
                    onAssign={(applicant) => openModal("assign", applicant)}
                    onAssignEmployer={(applicant) => openModal("employer", applicant)}
                    onMoveNext={handleMoveNext}
                />
            )}

            {modal === "status" && selected && (
                <ApplicantStatusModal applicant={selected} onClose={closeModal} onSubmit={handleUpdate} />
            )}

            {modal === "assign" && selected && (
                <AssignJobModal applicant={selected} onClose={closeModal} onSubmit={handleAssign} />
            )}

            {modal === "employer" && selected && (
                <AssignEmployerModal
                    key={selected.id + "-" + (selected.job?.id ?? "none")}
                    applicant={selected}
                    onClose={closeModal}
                    onSubmit={handleAssignEmployer}
                />
            )}

            {toReject && (
                <ConfirmModal
                    title="Reject Applicant"
                    message={`Reject the application of ${toReject.name}?`}
                    confirmLabel="Reject"
                    loading={rejecting}
                    onConfirm={confirmReject}
                    onClose={() => setToReject(null)}
                />
            )}
        </div>
    );
};

export default ApplicantManagement;
