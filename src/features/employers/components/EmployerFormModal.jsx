import {useState} from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import CountrySelect from "../../countries/components/CountrySelect";
import BusinessCategorySelect from "./BusinessCategorySelect";

const Field = ({label, required, error, children}) => (
    <div className="space-y-1.5">
        <Text as="span" size="sm" weight="medium" className="block text-gray-700">
            {label}
            {required && <span className="text-red-500"> *</span>}
        </Text>
        {children}
        {error && (
            <Text as="span" size="xs" className="block text-red-600">
                {error}
            </Text>
        )}
    </div>
);

const EmployerFormModal = ({employer = null, onClose, onSubmit}) => {
    const isEdit = Boolean(employer);

    const [form, setForm] = useState({
        name: employer?.name ?? "",
        business_category_id: employer?.business_category_id ?? "",
        country: employer?.country ?? "",
        address: employer?.address ?? "",
        license_no: employer?.license_no ?? "",
        website: employer?.website ?? "",
        contact_person: employer?.contact_person ?? "",
        contact_position: employer?.contact_position ?? "",
        contact_tel: employer?.contact_tel ?? "",
        contact_email: employer?.contact_email ?? "",
    });
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const setField = (name, value) => setForm((previous) => ({...previous, [name]: value}));
    const handleChange = (event) => setField(event.target.name, event.target.value);
    const fieldError = (name) => errors?.[name]?.[0];

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setFormError("");
        setErrors({});

        const payload = {
            ...form,
            business_category_id: form.business_category_id ? Number(form.business_category_id) : null,
        };

        const result = await onSubmit(payload);
        setSubmitting(false);

        if (result.ok) {
            onClose();
        } else {
            setErrors(result.errors ?? {});
            setFormError(result.message ?? "Something went wrong. Please try again.");
        }
    };

    return (
        <Modal
            as="form"
            size="xl"
            onSubmit={handleSubmit}
            eyebrow={isEdit ? "Edit Employer" : "New Employer"}
            title={isEdit ? employer.name : "Add Employer"}
            subtitle="Employers can be attached to multiple job openings."
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting} disabled={!form.name.trim()}>
                        {isEdit ? "Save Changes" : "Add Employer"}
                    </Button>
                </>
            }
        >
            {/* min-h para may espasyo ang dropdown sa loob ng modal */}
            <div className="min-h-[560px] space-y-6 p-5 sm:p-6">
                {formError && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError}
                    </Text>
                )}

                {/* Company */}
                <div className="space-y-4">
                    <Text weight="semibold" className="text-gray-900">
                        Company Information
                    </Text>

                    <Field label="Employer Name" required error={fieldError("name")}>
                        <Input
                            name="name"
                            placeholder="e.g. Al Noor Trading LLC"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </Field>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Business Category" error={fieldError("business_category_id")}>
                            <BusinessCategorySelect
                                id="employer-category"
                                value={form.business_category_id}
                                onChange={(value) => setField("business_category_id", value)}
                            />
                        </Field>

                        <Field label="License No." error={fieldError("license_no")}>
                            <Input
                                name="license_no"
                                placeholder="License number"
                                value={form.license_no}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Country" error={fieldError("country")}>
                            <CountrySelect value={form.country} onChange={(value) => setField("country", value)} />
                        </Field>

                        <Field label="Website" error={fieldError("website")}>
                            <Input
                                name="website"
                                placeholder="https://company.com"
                                value={form.website}
                                onChange={handleChange}
                            />
                        </Field>
                    </div>

                    <Field label="Address" error={fieldError("address")}>
                        <Input
                            name="address"
                            placeholder="Office address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </Field>
                </div>

                {/* Contact */}
                <div className="space-y-4">
                    <Text weight="semibold" className="text-gray-900">
                        Contact
                    </Text>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <Field label="Contact Person" error={fieldError("contact_person")}>
                            <Input
                                name="contact_person"
                                placeholder="Full name"
                                value={form.contact_person}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Position" error={fieldError("contact_position")}>
                            <Input
                                name="contact_position"
                                placeholder="e.g. HR Manager"
                                value={form.contact_position}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Telephone" error={fieldError("contact_tel")}>
                            <Input
                                name="contact_tel"
                                placeholder="+971 ..."
                                value={form.contact_tel}
                                onChange={handleChange}
                            />
                        </Field>

                        <Field label="Email" error={fieldError("contact_email")}>
                            <Input
                                type="email"
                                name="contact_email"
                                placeholder="hr@company.com"
                                value={form.contact_email}
                                onChange={handleChange}
                            />
                        </Field>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EmployerFormModal;
