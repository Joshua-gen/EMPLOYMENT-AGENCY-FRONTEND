import {useState} from "react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../shared/components/Modal";

const RejectRequestModal = ({request, onClose, onSubmit}) => {
    const [remarks, setRemarks] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setFormError("");

        try {
            const result = await onSubmit(remarks.trim());

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
            eyebrow="Reject Request"
            title={request.business_name}
            subtitle={request.reference}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        Reject Request
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

                <Textarea
                    label="Reason"
                    name="remarks"
                    required
                    placeholder="Explain why this request is rejected..."
                    rows={4}
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    error={errors.remarks?.[0]}
                />
            </div>
        </Modal>
    );
};

export default RejectRequestModal;
