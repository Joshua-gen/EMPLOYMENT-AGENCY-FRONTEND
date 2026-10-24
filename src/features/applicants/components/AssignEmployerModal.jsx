import {useMemo, useState} from "react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import useJobOptions from "../../jobs/hooks/useJobOptions";

const AssignEmployerModal = ({applicant, onClose, onSubmit}) => {
    // lahat ng status (kasama Closed) para laging may employers data
    const {jobs, loading, error} = useJobOptions();

    const currentId = applicant.employer?.id ?? "";

    const [employerId, setEmployerId] = useState(currentId);
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // pinakabagong job data (may employers) -> fallback sa applicant.job
    const job = useMemo(
        () => jobs.find((item) => item.id === applicant.job?.id) ?? applicant.job,
        [jobs, applicant.job]
    );

    // employers LANG ng job opening ng applicant
    const options = useMemo(
        () => (job?.employers ?? []).map((employer) => ({value: employer.id, label: employer.name})),
        [job]
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFormError("");

        const result = await onSubmit(employerId);
        setSubmitting(false);

        if (result.ok) onClose();
        else setFormError(result.message ?? "Something went wrong. Please try again.");
    };

    const renderBody = () => {
        if (!applicant.job) {
            return (
                <Text size="sm" className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-800">
                    Wala pang job opening ang applicant na ito. I-assign muna sa job bago pumili ng employer.
                </Text>
            );
        }

        if (loading && options.length === 0) {
            return (
                <Text size="sm" className="text-gray-500">
                    Loading employers...
                </Text>
            );
        }

        if (options.length === 0) {
            return (
                <Text size="sm" className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-800">
                    Wala pang employer ang job opening na ito. Magdagdag muna sa Job Management (Edit Job).
                </Text>
            );
        }

        return (
            <>
                <SearchableSelect
                    id="assign-employer"
                    label="Employer"
                    required
                    value={employerId}
                    onChange={setEmployerId}
                    options={options}
                    placeholder="Select an employer"
                    searchPlaceholder="Search employer..."
                    emptyText="No employers"
                />

                <Text size="xs" className="text-gray-500">
                    Mga employer lang ng job opening na ito ang makikita rito.
                </Text>
            </>
        );
    };

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            eyebrow={applicant.employer ? "Change Employer" : "Placement"}
            title="Assign Employer"
            subtitle={`${applicant.name} · ${job?.title ?? ""}${job?.country ? ` · ${job.country}` : ""}`}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        loading={submitting}
                        disabled={!applicant.job || !employerId || employerId === currentId}
                    >
                        Assign Employer
                    </Button>
                </>
            }
        >
            {/* min-h para may espasyo ang dropdown sa loob ng modal */}
            <div className="min-h-72 space-y-4 p-5 sm:p-6">
                {(formError || error) && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError || error}
                    </Text>
                )}

                {renderBody()}
            </div>
        </Modal>
    );
};

export default AssignEmployerModal;
