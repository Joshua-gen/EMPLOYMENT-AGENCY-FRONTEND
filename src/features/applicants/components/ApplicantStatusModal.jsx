import {useState} from "react";
import Button from "../../../components/ui/Button";
import Select from "../../../components/ui/Select";
import Text from "../../../components/ui/Text";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../shared/components/Modal";
import {getStageOptions} from "../utils";

const ApplicantStatusModal = ({applicant, onClose, onSubmit}) => {
    const [form, setForm] = useState({status: applicant.status, remarks: applicant.remarks ?? ""});
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const {name, value} = event.target;
        setForm((current) => ({...current, [name]: value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setFormError("");

        const result = await onSubmit({status: form.status, remarks: form.remarks.trim()});
        setSubmitting(false);

        if (result.ok) {
            onClose();
            return;
        }

        setErrors(result.errors ?? {});
        setFormError(
            Object.keys(result.errors ?? {}).length ? "" : result.message ?? "Something went wrong. Please try again."
        );
    };

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            eyebrow="Manage Application"
            title="Update Applicant"
            subtitle={`${applicant.name} · ${applicant.reference}`}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        Save Changes
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

                <Select
                    label="Recruitment Stage"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    options={getStageOptions(applicant)}
                    error={errors.status?.[0]}
                    required
                />

                {!applicant.employer && (
                    <Text size="xs" className="-mt-2 text-gray-500">
                        Interview at mga susunod na stage ay available lang kapag may na-assign nang employer.
                    </Text>
                )}

                <Textarea
                    label="Remarks / Internal Notes"
                    name="remarks"
                    rows={4}
                    value={form.remarks}
                    onChange={handleChange}
                    placeholder="Add review notes, missing requirements, interview feedback..."
                    error={errors.remarks?.[0]}
                />
            </div>
        </Modal>
    );
};

export default ApplicantStatusModal;
