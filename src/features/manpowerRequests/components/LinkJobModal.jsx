import {useMemo, useState} from "react";
import {Plus} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import useJobOptions from "../../jobs/hooks/useJobOptions";

const LinkJobModal = ({request, position, onClose, onSubmit, onCreateJob}) => {
    const {jobs, loading} = useJobOptions();

    // parehong bansa lang, at hindi Closed (ganito rin ang tinatanggap ng backend)
    const options = useMemo(
        () =>
            jobs
            .filter((job) => job.country === request.country && job.status !== "Closed")
            .map((job) => ({value: job.id, label: job.title, hint: job.country})),
        [jobs, request.country]
    );

    const [jobId, setJobId] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!jobId) {
            setErrors({job_opening_id: ["Please select a job opening."]});
            return;
        }

        setSubmitting(true);
        setErrors({});
        setFormError("");

        try {
            const result = await onSubmit(Number(jobId));

            if (!result.ok) {
                setErrors(result.errors ?? {});
                setFormError(
                    Object.keys(result.errors ?? {}).length
                        ? ""
                        : result.message ?? "Something went wrong. Please try again."
                );
            }
        } catch (error) {
            setFormError(error.message ?? "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            size="md"
            eyebrow="Link to Job Opening"
            title={position.position}
            subtitle={`${position.number_required} needed · ${request.business_name}`}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => onCreateJob(position)}
                        disabled={submitting}
                    >
                        <Plus size={16} />
                        Create New Job
                    </Button>
                    <Button type="submit" loading={submitting}>
                        Link to Job
                    </Button>
                </>
            }
        >
            <div className="space-y-5 p-5 sm:p-6">
                {formError && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError}
                    </Text>
                )}

                <Text size="sm" className="leading-6 text-gray-600">
                    The employer will be attached to the job opening. Total Vacancies of the job is not changed.
                </Text>

                <div>
                    <Text size="xs" weight="medium" className="mb-1.5 uppercase tracking-wide text-gray-400">
                        Job Opening in {request.country} *
                    </Text>
                    <SearchableSelect
                        value={jobId}
                        onChange={(value) => {
                            setJobId(value);
                            setErrors({});
                        }}
                        options={options}
                        loading={loading}
                        placeholder="Select a job opening"
                        searchPlaceholder="Search job title..."
                        emptyText={`No open job in ${request.country}. Create a new one.`}
                    />
                    {errors.job_opening_id?.[0] && (
                        <Text size="sm" className="mt-1.5 text-red-600">
                            {errors.job_opening_id[0]}
                        </Text>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default LinkJobModal;
