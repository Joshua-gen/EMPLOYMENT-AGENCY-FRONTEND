import {useState} from "react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../shared/components/Modal";

// request.possible_employers galing sa GET /manpower-requests/{id} (Pending lang)
const ApproveRequestModal = ({request, onClose, onSubmit}) => {
    const possible = request.possible_employers ?? [];

    // may posibleng tugma: dapat pumili si admin. Wala: default na gumawa ng bago.
    const [choice, setChoice] = useState(possible.length ? null : "new");
    const [remarks, setRemarks] = useState("");
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (choice === null) {
            setFormError("Select an existing employer or choose to create a new one.");
            return;
        }

        setSubmitting(true);
        setErrors({});
        setFormError("");

        try {
            const result = await onSubmit(
                choice === "new" ? {create_employer: true, remarks} : {employer_id: choice, remarks}
            );

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

    const optionClass = (active, disabled = false) =>
        `flex items-start gap-3 rounded-lg border p-4 ${
            active ? "border-[#062B4A] bg-[#062B4A]/5" : "border-gray-200"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`;

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            size="lg"
            eyebrow="Approve Request"
            title={request.business_name}
            subtitle={`${request.reference ?? ""} · ${request.country}`}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        Approve Request
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
                    Link this request to an employer record. Approving does not create a job opening. You will link each
                    position to a job afterwards.
                </Text>

                {possible.length > 0 && (
                    <Text size="sm" className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-900">
                        {possible.length} similar employer{possible.length === 1 ? "" : "s"} found. Check before
                        creating a new one.
                    </Text>
                )}

                <div className="space-y-2">
                    {possible.map((employer) => {
                        const sameCountry = employer.country === request.country;

                        return (
                            <label key={employer.id} className={optionClass(choice === employer.id, !sameCountry)}>
                                <input
                                    type="radio"
                                    name="employer-choice"
                                    className="mt-1"
                                    disabled={!sameCountry}
                                    checked={choice === employer.id}
                                    onChange={() => setChoice(employer.id)}
                                />
                                <div className="min-w-0">
                                    <Text size="sm" weight="semibold" className="text-gray-900">
                                        Link to {employer.name}
                                    </Text>
                                    <Text size="xs" className="mt-0.5 break-words text-gray-500">
                                        {[employer.country, employer.license_no, employer.contact_email]
                                        .filter(Boolean)
                                        .join(" · ")}
                                    </Text>
                                    {!sameCountry && (
                                        <Text size="xs" className="mt-1 text-red-600">
                                            Different country. This request is for {request.country}.
                                        </Text>
                                    )}
                                </div>
                            </label>
                        );
                    })}

                    <label className={optionClass(choice === "new")}>
                        <input
                            type="radio"
                            name="employer-choice"
                            className="mt-1"
                            checked={choice === "new"}
                            onChange={() => setChoice("new")}
                        />
                        <div>
                            <Text size="sm" weight="semibold" className="text-gray-900">
                                Create new employer
                            </Text>
                            <Text size="xs" className="mt-0.5 text-gray-500">
                                Uses the business and contact details of this request.
                            </Text>
                        </div>
                    </label>
                </div>

                {errors.employer_id?.[0] && (
                    <Text size="sm" className="text-red-600">
                        {errors.employer_id[0]}
                    </Text>
                )}

                <Textarea
                    label="Remarks"
                    name="remarks"
                    placeholder="Optional approval notes..."
                    rows={3}
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    error={errors.remarks?.[0]}
                />
            </div>
        </Modal>
    );
};

export default ApproveRequestModal;
