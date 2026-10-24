import {useMemo, useState} from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import Text from "../../../components/ui/Text";
import Textarea from "../../../components/ui/Textarea";
import FileField from "../../../shared/components/FileField";
import Modal from "../../../shared/components/Modal";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import useJobOptions from "../../jobs/hooks/useJobOptions";
import {CIVIL_STATUS_OPTIONS, EDUCATION_OPTIONS, GENDER_OPTIONS, YEAR_OPTIONS} from "../constants";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD (local)

const emptyForm = () => ({
    job_opening_id: "",
    applied_at: today(),
    name: "",
    birthday: "",
    gender: "",
    civil_status: "",
    email: "",
    phone: "",
    address: "",
    educational_attainment: "",
    school: "",
    course: "",
    education_start_year: "",
    education_graduated_year: "",
    previous_employer: "",
    previous_employer_address: "",
    previous_position: "",
    work_start: "",
    work_end: "",
    skills: "",
    certifications: "",
    languages: "",
    resume: null,
    valid_id: null,
    passport: null,
    other_requirements: null,
});

const Section = ({title, hint, children}) => (
    <div className="space-y-4">
        <div>
            <Text weight="semibold" className="text-gray-900">
                {title}
            </Text>
            {hint && (
                <Text size="xs" className="mt-0.5 text-gray-500">
                    {hint}
                </Text>
            )}
        </div>
        {children}
    </div>
);

const ApplicantFormModal = ({onClose, onSubmit}) => {
    const {jobs, loading: jobsLoading} = useJobOptions({status: "Published"});

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const thisMonth = today().slice(0, 7);

    const jobOptions = useMemo(
        () => [
            {value: "", label: "No job yet (assign later)"},
            ...jobs.map((job) => ({value: job.id, label: job.title, hint: job.country})),
        ],
        [jobs]
    );

    const setField = (name, value) => setForm((current) => ({...current, [name]: value}));

    const handleChange = (event) => {
        const {name, value, files} = event.target;
        setField(name, files ? files[0] ?? null : value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});
        setFormError("");

        const payload = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value === null || value === "") return;
            payload.append(key, value);
        });

        const result = await onSubmit(payload);
        setSubmitting(false);

        if (result.ok) {
            onClose();
            return;
        }

        setErrors(result.errors ?? {});
        setFormError(
            Object.keys(result.errors ?? {}).length
                ? "Please check the highlighted fields."
                : result.message ?? "Something went wrong. Please try again."
        );
    };

    const error = (name) => errors[name]?.[0];

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit}
            size="xl"
            eyebrow="Walk-in / Manual Entry"
            title="Add Applicant"
            subtitle="Name, contact number, birthday, at gender lang ang required. Pwedeng dagdagan mamaya ang iba."
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={submitting}>
                        Add Applicant
                    </Button>
                </>
            }
        >
            <div className="space-y-7 p-5 sm:p-6">
                {formError && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-red-600">
                        {formError}
                    </Text>
                )}

                <Section title="Application" hint="Ang employer ay ina-assign pagkatapos, sa Applicant Details.">
                    <div className="grid gap-5 md:grid-cols-2">
                        <SearchableSelect
                            id="manual-job"
                            label="Job Opening"
                            value={form.job_opening_id}
                            onChange={(value) => setField("job_opening_id", value)}
                            options={jobOptions}
                            loading={jobsLoading}
                            loadingText="Loading job openings..."
                            placeholder="No job yet (assign later)"
                            searchPlaceholder="Search job title or country..."
                            error={error("job_opening_id")}
                        />

                        <Input
                            label="Date Applied"
                            name="applied_at"
                            type="date"
                            max={today()}
                            value={form.applied_at}
                            onChange={handleChange}
                            error={error("applied_at")}
                        />
                    </div>
                </Section>

                <Section title="Personal Information">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Input
                            label="Full Name"
                            name="name"
                            placeholder="Juan Dela Cruz"
                            value={form.name}
                            onChange={handleChange}
                            required
                            error={error("name")}
                        />

                        <Input
                            label="Contact Number"
                            name="phone"
                            type="tel"
                            placeholder="0917 123 4567"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            error={error("phone")}
                        />

                        <Input
                            label="Birthday"
                            name="birthday"
                            type="date"
                            max={today()}
                            value={form.birthday}
                            onChange={handleChange}
                            required
                            error={error("birthday")}
                        />

                        <Select
                            label="Gender"
                            name="gender"
                            placeholder="Select gender"
                            value={form.gender}
                            onChange={handleChange}
                            options={GENDER_OPTIONS}
                            required
                            error={error("gender")}
                        />

                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="juan@email.com (optional)"
                            value={form.email}
                            onChange={handleChange}
                            error={error("email")}
                        />

                        <Select
                            label="Civil Status"
                            name="civil_status"
                            placeholder="Select civil status"
                            value={form.civil_status}
                            onChange={handleChange}
                            options={CIVIL_STATUS_OPTIONS}
                            error={error("civil_status")}
                        />
                    </div>

                    <Textarea
                        label="Complete Address"
                        name="address"
                        rows={3}
                        placeholder="House No., Street, Barangay, City, Province"
                        value={form.address}
                        onChange={handleChange}
                        error={error("address")}
                    />
                </Section>

                <Section title="Education">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Select
                            label="Educational Attainment"
                            name="educational_attainment"
                            placeholder="Select attainment"
                            value={form.educational_attainment}
                            onChange={handleChange}
                            options={EDUCATION_OPTIONS}
                            error={error("educational_attainment")}
                        />

                        <Input
                            label="School"
                            name="school"
                            placeholder="School / University"
                            value={form.school}
                            onChange={handleChange}
                            error={error("school")}
                        />

                        <Input
                            label="Course"
                            name="course"
                            placeholder="Course / Program"
                            value={form.course}
                            onChange={handleChange}
                            error={error("course")}
                        />

                        <div className="grid grid-cols-2 gap-5">
                            <Select
                                label="Start Year"
                                name="education_start_year"
                                placeholder="Year"
                                value={form.education_start_year}
                                onChange={handleChange}
                                options={YEAR_OPTIONS}
                                error={error("education_start_year")}
                            />

                            <Select
                                label="Graduated Year"
                                name="education_graduated_year"
                                placeholder="Year"
                                value={form.education_graduated_year}
                                onChange={handleChange}
                                options={YEAR_OPTIONS}
                                error={error("education_graduated_year")}
                            />
                        </div>
                    </div>
                </Section>

                <Section title="Work Experience & Skills">
                    <div className="grid gap-5 md:grid-cols-2">
                        <Input
                            label="Previous Employer"
                            name="previous_employer"
                            placeholder="Company name"
                            value={form.previous_employer}
                            onChange={handleChange}
                            error={error("previous_employer")}
                        />

                        <Input
                            label="Previous Position"
                            name="previous_position"
                            placeholder="Job position"
                            value={form.previous_position}
                            onChange={handleChange}
                            error={error("previous_position")}
                        />

                        <div className="md:col-span-2">
                            <Input
                                label="Company Address"
                                name="previous_employer_address"
                                placeholder="City, Province, Country"
                                value={form.previous_employer_address}
                                onChange={handleChange}
                                error={error("previous_employer_address")}
                            />
                        </div>

                        <Input
                            label="Start (Month / Year)"
                            name="work_start"
                            type="month"
                            placeholder="YYYY-MM"
                            max={thisMonth}
                            value={form.work_start}
                            onChange={handleChange}
                            error={error("work_start")}
                        />

                        <Input
                            label="End (Month / Year)"
                            name="work_end"
                            type="month"
                            placeholder="YYYY-MM"
                            max={thisMonth}
                            value={form.work_end}
                            onChange={handleChange}
                            error={error("work_end")}
                        />
                    </div>

                    <Text size="xs" className="-mt-2 text-gray-500">
                        Iwanang blangko ang End kung kasalukuyang nagtatrabaho pa rin.
                    </Text>

                    <div className="grid gap-5 md:grid-cols-2">
                        <Textarea
                            label="Skills"
                            name="skills"
                            rows={3}
                            placeholder="List relevant skills..."
                            value={form.skills}
                            onChange={handleChange}
                            error={error("skills")}
                        />

                        <Textarea
                            label="Certifications"
                            name="certifications"
                            rows={3}
                            placeholder="TESDA, NC II, licenses, etc."
                            value={form.certifications}
                            onChange={handleChange}
                            error={error("certifications")}
                        />

                        <Input
                            label="Languages"
                            name="languages"
                            placeholder="Filipino, English, Mandarin"
                            value={form.languages}
                            onChange={handleChange}
                            error={error("languages")}
                        />
                    </div>
                </Section>

                <Section title="Documents" hint="Optional. Max 5 MB bawat file.">
                    <div className="grid gap-5 md:grid-cols-2">
                        <FileField
                            compact
                            label="Resume"
                            name="resume"
                            accept=".pdf,.doc,.docx"
                            hint="PDF, DOC, or DOCX"
                            file={form.resume}
                            onChange={handleChange}
                            error={error("resume")}
                        />

                        <FileField
                            compact
                            label="Valid ID"
                            name="valid_id"
                            accept=".jpg,.jpeg,.png,.pdf"
                            hint="JPG, PNG, or PDF"
                            file={form.valid_id}
                            onChange={handleChange}
                            error={error("valid_id")}
                        />

                        <FileField
                            compact
                            label="Passport"
                            name="passport"
                            accept=".jpg,.jpeg,.png,.pdf"
                            hint="JPG, PNG, or PDF"
                            file={form.passport}
                            onChange={handleChange}
                            error={error("passport")}
                        />

                        <FileField
                            compact
                            label="Other Requirements"
                            name="other_requirements"
                            hint="Additional supporting document"
                            file={form.other_requirements}
                            onChange={handleChange}
                            error={error("other_requirements")}
                        />
                    </div>
                </Section>
            </div>
        </Modal>
    );
};

export default ApplicantFormModal;
