import {useMemo, useState} from "react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import DetailGrid from "../../../shared/components/DetailGrid";
import Modal from "../../../shared/components/Modal";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import {formatDate} from "../../../shared/utils/formatDate";
import useJobOptions from "../../jobs/hooks/useJobOptions";

const AssignJobModal = ({applicant, onClose, onSubmit}) => {
    const {jobs, loading, error} = useJobOptions({status: "Published"});

    const currentJobId = applicant.job?.id ?? "";
    const [jobId, setJobId] = useState(currentJobId);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const options = useMemo(() => jobs.map((job) => ({value: job.id, label: job.title, hint: job.country})), [jobs]);

    const selectedJob = jobs.find((job) => job.id === jobId);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFormError("");

        const result = await onSubmit(jobId);
        setSubmitting(false);

        if (result.ok) onClose();
        else setFormError(result.message ?? "Something went wrong. Please try again.");
    };

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            eyebrow={applicant.job ? "Change Job" : "Move to Job Opening"}
            title="Assign to Job"
            subtitle={`${applicant.name} · ${applicant.reference}`}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting} disabled={!jobId || jobId === currentJobId}>
                        Assign Job
                    </Button>
                </>
            }
        >
            {/* min-h para may espasyo ang dropdown sa loob ng modal */}
            <div className="min-h-80 space-y-4 p-5 sm:p-6">
                {applicant.job && (
                    <Text size="sm" className="text-gray-500">
                        Currently assigned to <strong className="text-gray-800">{applicant.job.title}</strong>
                        {applicant.employer && (
                            <>
                                {" "}
                                with <strong className="text-gray-800">{applicant.employer.name}</strong>. Mananatili
                                ang employer kung kasama ito sa bagong job, kung hindi ay mawawala.
                            </>
                        )}
                    </Text>
                )}

                {(formError || error) && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError || error}
                    </Text>
                )}

                <SearchableSelect
                    id="assign-job"
                    label="Job Opening"
                    required
                    value={jobId}
                    onChange={setJobId}
                    options={options}
                    loading={loading}
                    loadingText="Loading job openings..."
                    placeholder="Select a published job"
                    searchPlaceholder="Search job title or country..."
                    emptyText="No published job openings"
                />

                {selectedJob && (
                    <div className="rounded-xl bg-gray-50 p-4">
                        <DetailGrid
                            items={[
                                [
                                    "Employers",
                                    (selectedJob.employers ?? []).map((employer) => employer.name).join(", "),
                                ],
                                ["Country", selectedJob.country],
                                ["Salary Range", selectedJob.salary],
                                ["Vacancies", selectedJob.vacancies],
                                ["Deadline", formatDate(selectedJob.deadline)],
                            ]}
                        />
                    </div>
                )}

                <Text size="xs" className="text-gray-500">
                    Published job openings lang ang makikita rito.
                </Text>
            </div>
        </Modal>
    );
};

export default AssignJobModal;
