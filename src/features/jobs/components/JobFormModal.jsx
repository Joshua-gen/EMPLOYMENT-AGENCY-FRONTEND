import {useState} from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Text from "../../../components/ui/Text";
import Textarea from "../../../components/ui/Textarea";
import Modal from "../../../shared/components/Modal";
import CountrySelect from "../../countries/components/CountrySelect";
import EmployerMultiSelect from "../../employers/components/EmployerMultiSelect";

// Kaliwang column. half: true = kalahati lang ng lapad (magkatabi ng sumunod na half)
const FIELDS = [
    {name: "title", label: "Job Title", required: true, placeholder: "e.g. Factory Worker"},
    {name: "country", label: "Country", required: true, type: "country"},
    {name: "employer_ids", label: "Employers", required: true, type: "employers"},
    {name: "vacancies", label: "Total Vacancies", required: true, placeholder: "e.g. 30", half: true},
    {name: "salary", label: "Salary Range", placeholder: "e.g. NT$ 28,000", half: true},
    {name: "deadline", label: "Application Deadline", required: true, type: "date"},
];

const emptyForm = {
    title: "",
    country: "",
    employer_ids: [],
    description: "",
    vacancies: "",
    salary: "",
    deadline: "",
};

const JobFormModal = ({mode, job, onClose, onSubmit}) => {
    const [form, setForm] = useState(
        job
            ? {
                  title: job.title ?? "",
                  country: job.country ?? "",
                  employer_ids: (job.employers ?? []).map((employer) => employer.id),
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

    const setField = (name, value) => setForm((current) => ({...current, [name]: value}));

    const handleChange = (event) => setField(event.target.name, event.target.value);

    // kapag nagpalit ng country, mawawala ang mga napiling employer (ibang bansa na)
    const handleCountryChange = (value) =>
        setForm((current) => ({
            ...current,
            country: value,
            employer_ids: value === current.country ? current.employer_ids : [],
        }));

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
            size="xl"
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
            <div className="space-y-5 p-5 sm:p-6">
                {formError && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError}
                    </Text>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Kaliwa: lahat ng fields. Ang half ay magkatabi mula lg pataas */}
                    <div className="grid grid-cols-1 content-start gap-5 lg:grid-cols-2">
                        {FIELDS.map(({type, half, ...field}) => (
                            <div key={field.name} className={half ? "" : "lg:col-span-2"}>
                                {type === "country" ? (
                                    <CountrySelect
                                        id={`job-${field.name}`}
                                        label={field.label}
                                        required={field.required}
                                        value={form.country}
                                        onChange={handleCountryChange}
                                        error={errors.country?.[0]}
                                    />
                                ) : type === "employers" ? (
                                    <EmployerMultiSelect
                                        id={`job-${field.name}`}
                                        label={field.label}
                                        required={field.required}
                                        country={form.country}
                                        value={form.employer_ids}
                                        onChange={(ids) => setField("employer_ids", ids)}
                                        error={errors.employer_ids?.[0]}
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

                    {/* Kanan: Job Description lang, umaabot sa buong taas */}
                    <div className="flex flex-col">
                        <Textarea
                            label="Job Description"
                            name="description"
                            required
                            placeholder="Describe the duties and responsibilities..."
                            value={form.description}
                            onChange={handleChange}
                            error={errors.description?.[0]}
                            resize="vertical"
                            className="flex flex-1 flex-col"
                            textareaClassName="min-h-[240px] grow"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default JobFormModal;
