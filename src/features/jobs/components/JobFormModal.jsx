import {useState} from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../shared/components/Modal";
import CountrySelect from "../../countries/components/CountrySelect";

const FIELDS = [
    {name: "title", label: "Job Title", required: true, placeholder: "e.g. Factory Worker"},
    {name: "employer", label: "Employer", required: true, placeholder: "Hiring company"},
    {name: "country", label: "Country", required: true, type: "country"},
    {name: "vacancies", label: "Number of Vacancies", required: true, placeholder: "e.g. 10"},
    {name: "salary", label: "Salary Range", placeholder: "e.g. NT$ 28,000 - 35,000"},
    {name: "deadline", label: "Application Deadline", required: true, type: "date"},
    {
        name: "description",
        label: "Job Description",
        required: true,
        type: "textarea",
        resize: "vertical",
        placeholder: "Describe the duties and responsibilities...",
        full: true,
    },
];

const emptyForm = {title: "", employer: "", country: "", description: "", vacancies: "", salary: "", deadline: ""};

const JobFormModal = ({mode, job, onClose, onSubmit}) => {
    const [form, setForm] = useState(
        job
            ? {
                  title: job.title ?? "",
                  employer: job.employer ?? "",
                  country: job.country ?? "",
                  description: job.description ?? "",
                  vacancies: String(job.vacancies ?? ""),
                  salary: job.salary ?? "",
                  deadline: job.deadline ?? "",
              }
            : emptyForm
    );
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

        try {
            const result = await onSubmit({...form});

            if (result.ok) {
                onClose();
            } else {
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
            size="lg"
            title={mode === "create" ? "Create Job Opening" : "Edit Job Opening"}
            subtitle="Provide the job opening details."
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        {mode === "create" ? "Create as Draft" : "Save Changes"}
                    </Button>
                </>
            }
        >
            <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6">
                {formError && (
                    <p className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-600 sm:col-span-2">{formError}</p>
                )}

                {FIELDS.map(({full, type, ...field}) => (
                    <div key={field.name} className={full ? "sm:col-span-2" : ""}>
                        {type === "country" ? (
                            <>
                                <label
                                    htmlFor={`job-${field.name}`}
                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                >
                                    {field.label}
                                    {field.required ? " *" : ""}
                                </label>
                                <CountrySelect
                                    id={`job-${field.name}`}
                                    required={field.required}
                                    value={form.country}
                                    onChange={(value) => setForm((current) => ({...current, country: value}))}
                                />
                                {errors.country?.[0] && (
                                    <p className="mt-1 text-xs text-red-600">{errors.country[0]}</p>
                                )}
                            </>
                        ) : type === "textarea" ? (
                            <Textarea
                                {...field}
                                rows={4}
                                value={form[field.name]}
                                onChange={handleChange}
                                error={errors[field.name]?.[0]}
                            />
                        ) : (
                            <Input
                                {...field}
                                type={type}
                                value={form[field.name]}
                                onChange={handleChange}
                                error={errors[field.name]?.[0]}
                            />
                        )}
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default JobFormModal;
