import {useEffect, useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {ArrowLeft, Check, FileText} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Text from "../../components/ui/Text";
import Textarea from "../../components/ui/Textarea";
import {
    CIVIL_STATUS_OPTIONS,
    EDUCATION_OPTIONS,
    GENDER_OPTIONS,
    YEAR_OPTIONS,
} from "../../features/applicants/constants";
import {humanize} from "../../features/applicants/utils";
import {websiteApi} from "../../features/website/api/websiteApi";
import DetailGrid from "../../shared/components/DetailGrid";
import FileField from "../../shared/components/FileField";
import {formatDate, formatPeriod} from "../../shared/utils/formatDate";
import parseError from "../../shared/utils/parseError";

const STEPS = ["Personal", "Education", "Experience", "Documents", "Review"];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const STEP_FIELDS = {
    1: ["fullName", "birthday", "gender", "civilStatus", "email", "phone", "address"],
    2: ["educationalAttainment", "school", "course", "educationStartYear", "educationGraduatedYear"],
    3: [
        "previousEmployer",
        "previousEmployerAddress",
        "previousPosition",
        "workStart",
        "workEnd",
        "skills",
        "certifications",
        "languages",
    ],
    4: ["resume", "validId", "passport", "otherRequirements"],
};

const INITIAL_FORM = {
    fullName: "",
    birthday: "",
    gender: "",
    civilStatus: "",
    email: "",
    phone: "",
    address: "",
    educationalAttainment: "",
    school: "",
    course: "",
    educationStartYear: "",
    educationGraduatedYear: "",
    previousEmployer: "",
    previousEmployerAddress: "",
    previousPosition: "",
    workStart: "",
    workEnd: "",
    skills: "",
    certifications: "",
    languages: "",
    resume: null,
    validId: null,
    passport: null,
    otherRequirements: null,
};

const toSnake = (key) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
const toCamel = (key) => key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());

const thisMonth = () => new Date().toLocaleDateString("en-CA").slice(0, 7); // YYYY-MM (local)
const today = () => new Date().toLocaleDateString("en-CA");

const validate = (form, step) => {
    const errors = {};

    if (step === 1) {
        if (!form.fullName) errors.fullName = "Full name is required.";
        if (!form.birthday) errors.birthday = "Birthday is required.";
        if (!form.gender) errors.gender = "Gender is required.";
        if (!form.civilStatus) errors.civilStatus = "Civil status is required.";
        if (!form.email) errors.email = "Email address is required.";
        if (!form.phone) errors.phone = "Contact number is required.";
        if (!form.address) errors.address = "Address is required.";
    }

    if (step === 2) {
        if (!form.educationalAttainment) errors.educationalAttainment = "Educational attainment is required.";
        if (!form.school) errors.school = "School is required.";

        if (
            form.educationStartYear &&
            form.educationGraduatedYear &&
            Number(form.educationGraduatedYear) < Number(form.educationStartYear)
        ) {
            errors.educationGraduatedYear = "Graduated year cannot be earlier than the start year.";
        }
    }

    if (step === 3) {
        if (form.previousEmployer && !form.workStart) {
            errors.workStart = "Start date is required when you provide a previous employer.";
        }

        if (form.workStart && form.workStart > thisMonth()) errors.workStart = "Start date cannot be in the future.";
        if (form.workEnd && form.workEnd > thisMonth()) errors.workEnd = "End date cannot be in the future.";

        if (form.workStart && form.workEnd && form.workEnd < form.workStart) {
            errors.workEnd = "End date cannot be earlier than the start date.";
        }

        if (!form.skills) errors.skills = "Please provide your skills.";
        if (!form.languages) errors.languages = "Please provide your languages.";
    }

    if (step === 4) {
        if (!form.resume) errors.resume = "Resume is required.";
        if (!form.validId) errors.validId = "Valid ID is required.";
        if (!form.passport) errors.passport = "Passport is required.";
    }

    return errors;
};

const firstStepWithError = (errors) =>
    Object.keys(STEP_FIELDS)
    .map(Number)
    .find((step) => STEP_FIELDS[step].some((field) => errors[field]));

const ReviewSection = ({title, items}) => (
    <div>
        <Heading as="h3" className="mb-3 text-base text-[#062B4A]">
            {title}
        </Heading>

        <div className="rounded-xl bg-gray-50 p-5">
            <DetailGrid items={items} />
        </div>
    </div>
);

const RecruitmentApply = () => {
    const navigate = useNavigate();
    const {jobId: routeJobId} = useParams();
    const [searchParams] = useSearchParams();

    // /recruitment/apply?job=12  o  /recruitment/apply/12  o  walang job (direct apply)
    const [jobId, setJobId] = useState(routeJobId || searchParams.get("job") || "");
    const [job, setJob] = useState(null);
    const [jobState, setJobState] = useState(jobId ? "loading" : "none"); // none | loading | ready | missing

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [formError, setFormError] = useState("");
    const [captchaToken, setCaptchaToken] = useState(null);
    const [uploading, setUploading] = useState({}); // { resume: 45, validId: 100 }
    const recaptchaRef = useRef(null);

    const isUploading = Object.keys(uploading).length > 0;

    useEffect(() => {
        if (!jobId) return;

        let ignore = false;

        websiteApi
        .job(jobId)
        .then((res) => {
            if (ignore) return;
            setJob(res.data);
            setJobState("ready");
        })
        .catch(() => !ignore && setJobState("missing"));

        return () => {
            ignore = true;
        };
    }, [jobId]);

    const continueWithoutJob = () => {
        setJobId("");
        setJob(null);
        setJobState("none");
    };

    const clearUploading = (name) =>
        setUploading((current) => {
            const {[name]: _removed, ...rest} = current;
            return rest;
        });

    const handleFile = (name, file) => {
        if (!file) {
            setForm((current) => ({...current, [name]: null}));
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setErrors((current) => ({...current, [name]: "File must not exceed 5 MB."}));
            return;
        }

        setUploading((current) => ({...current, [name]: 0}));

        const reader = new FileReader();

        reader.onprogress = (e) => {
            if (e.lengthComputable) {
                setUploading((current) => ({...current, [name]: Math.round((e.loaded / e.total) * 100)}));
            }
        };

        reader.onload = () => {
            setForm((current) => ({...current, [name]: file}));
            clearUploading(name);
        };

        reader.onerror = () => {
            setErrors((current) => ({...current, [name]: "Failed to read the file. Please try again."}));
            clearUploading(name);
        };

        reader.readAsArrayBuffer(file);
    };

    const handleChange = (event) => {
        const {name, value, files, type} = event.target;

        setErrors((current) => ({...current, [name]: ""}));

        if (type === "file") {
            handleFile(name, files?.[0] ?? null);
            return;
        }

        setForm((current) => ({...current, [name]: value}));
    };

    const goToStep = (target) => {
        setStep(target);
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const nextStep = () => {
        const stepErrors = validate(form, step);
        setErrors(stepErrors);

        if (Object.keys(stepErrors).length === 0) goToStep(Math.min(step + 1, 5));
    };

    const handleSubmit = async () => {
        const allErrors = {...validate(form, 1), ...validate(form, 2), ...validate(form, 3), ...validate(form, 4)};

        if (Object.keys(allErrors).length > 0) {
            setErrors(allErrors);
            setFormError("Please check the highlighted fields.");
            goToStep(firstStepWithError(allErrors) ?? 1);
            return;
        }

        if (!captchaToken) {
            setFormError("Please complete the reCAPTCHA verification.");
            return;
        }

        setLoading(true);
        setFormError("");

        const payload = new FormData();
        payload.append("g_recaptcha_response", captchaToken);

        if (jobId) payload.append("job_opening_id", jobId); // walang laman = direct apply

        Object.entries(form).forEach(([key, value]) => {
            if (value === null || value === "") return;
            payload.append(toSnake(key), value);
        });

        try {
            const res = await websiteApi.apply(payload);
            setSubmitted({reference: res.data?.reference});
            setCaptchaToken(null);
            recaptchaRef.current?.reset();
            window.scrollTo({top: 0});
        } catch (e) {
            const {message, errors: serverErrors} = parseError(e);

            const mapped = {};
            Object.entries(serverErrors).forEach(([key, messages]) => {
                mapped[toCamel(key)] = messages[0];
            });

            setErrors(mapped);

            const errorStep = firstStepWithError(mapped);

            if (errorStep) {
                setFormError("Please check the highlighted fields.");
                goToStep(errorStep);
            } else {
                setFormError(mapped.jobOpeningId ?? message);
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-gray-50 px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <Card className="p-8 text-center sm:p-12">
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#062B4A]/10 text-[#062B4A]">
                            <Check size={32} />
                        </div>

                        <Heading as="h1" className="mb-3">
                            Application Submitted
                        </Heading>

                        {submitted.reference && (
                            <Text className="mb-3 text-gray-700">
                                Your reference number is{" "}
                                <strong className="text-[#062B4A]">{submitted.reference}</strong>. Please keep it for
                                follow-ups.
                            </Text>
                        )}

                        <Text className="mb-8 text-gray-600">
                            Thank you for submitting your application. Our recruitment team will review your application
                            and contact you regarding the next steps.
                        </Text>

                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={() => navigate("/recruitment/jobs")}>View Job Openings</Button>

                            <Button variant="secondary" onClick={() => navigate("/")}>
                                Back to Home
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    if (jobState === "missing") {
        return (
            <main className="min-h-screen bg-gray-50 px-5 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <Card className="p-8 text-center sm:p-12">
                        <Heading as="h1" className="mb-3">
                            Job Opening Unavailable
                        </Heading>

                        <Text className="mb-8 text-gray-600">
                            This job opening is closed or no longer available. You can browse other openings, or submit
                            a general application and our team will match you to a suitable position.
                        </Text>

                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button onClick={() => navigate("/recruitment/jobs")}>View Job Openings</Button>

                            <Button variant="secondary" onClick={continueWithoutJob}>
                                Apply Without a Job
                            </Button>
                        </div>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={17} />
                        Back
                    </Button>
                </div>

                <div className="mb-8">
                    <Text size="sm" weight="bold" className="mb-2 uppercase tracking-[0.18em] text-[#4F7383]">
                        Recruitment
                    </Text>

                    <Heading as="h1">Applicant Application</Heading>

                    <Text className="mt-2 max-w-2xl text-gray-600">
                        Complete the application form below. No account is required to apply.
                    </Text>
                </div>

                {jobState === "loading" && (
                    <Card className="mb-8">
                        <Text className="text-gray-600">Loading job opening...</Text>
                    </Card>
                )}

                {jobState === "ready" && job && (
                    <Card className="mb-8 border-[#062B4A]/15 bg-[#062B4A]/[0.03]">
                        <Text size="sm" weight="semibold" className="mb-1 text-[#4F7383]">
                            Applying For
                        </Text>

                        <Heading as="h2">{job.title}</Heading>

                        <Text className="mt-1 text-gray-600">{job.country}</Text>
                    </Card>
                )}

                {jobState === "none" && (
                    <Card className="mb-8 border-[#4F7383]/20 bg-[#4F7383]/5">
                        <Text size="sm" weight="semibold" className="mb-1 text-[#4F7383]">
                            General Application
                        </Text>

                        <Text className="text-gray-600">
                            You are not applying to a specific job. Our recruitment team will review your profile and
                            match you to a suitable job opening.
                        </Text>
                    </Card>
                )}

                <div className="mb-8 grid grid-cols-5 gap-2">
                    {STEPS.map((label, index) => (
                        <div key={label}>
                            <div
                                className={`mb-2 h-2 rounded-full transition-all duration-300 ${
                                    index + 1 <= step ? "bg-[#062B4A]" : "bg-gray-200"
                                }`}
                            />

                            <Text
                                size="xs"
                                weight="semibold"
                                className={`text-center ${index + 1 <= step ? "text-[#062B4A]" : "text-gray-400"}`}
                            >
                                {label}
                            </Text>
                        </div>
                    ))}
                </div>

                {formError && (
                    <Text size="sm" className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-600">
                        {formError}
                    </Text>
                )}

                {step === 1 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Personal Information</Heading>

                            <Text className="mt-2 text-gray-600">
                                Provide your basic personal and contact information.
                            </Text>
                        </div>

                        <div className="space-y-5">
                            <Input
                                label="Full Name"
                                name="fullName"
                                placeholder="Juan Dela Cruz"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                                error={errors.fullName}
                            />

                            <div className="grid gap-5 md:grid-cols-3">
                                <Input
                                    label="Birthday"
                                    name="birthday"
                                    type="date"
                                    max={today()}
                                    value={form.birthday}
                                    onChange={handleChange}
                                    required
                                    error={errors.birthday}
                                />

                                <Select
                                    label="Gender"
                                    name="gender"
                                    placeholder="Select gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    error={errors.gender}
                                    options={GENDER_OPTIONS}
                                />

                                <Select
                                    label="Civil Status"
                                    name="civilStatus"
                                    placeholder="Select civil status"
                                    value={form.civilStatus}
                                    onChange={handleChange}
                                    required
                                    error={errors.civilStatus}
                                    options={CIVIL_STATUS_OPTIONS}
                                />
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    placeholder="juan@email.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    error={errors.email}
                                />

                                <Input
                                    label="Contact Number"
                                    name="phone"
                                    type="tel"
                                    placeholder="0917 123 4567"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    error={errors.phone}
                                />
                            </div>

                            <Textarea
                                label="Complete Address"
                                name="address"
                                placeholder="House No., Street, Barangay, City, Province"
                                value={form.address}
                                onChange={handleChange}
                                required
                                rows={4}
                                error={errors.address}
                            />
                        </div>
                    </Card>
                )}

                {step === 2 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Education</Heading>

                            <Text className="mt-2 text-gray-600">Provide your educational background.</Text>
                        </div>

                        <div className="space-y-5">
                            <Select
                                label="Educational Attainment"
                                name="educationalAttainment"
                                placeholder="Select educational attainment"
                                value={form.educationalAttainment}
                                onChange={handleChange}
                                required
                                error={errors.educationalAttainment}
                                options={EDUCATION_OPTIONS}
                            />

                            <Input
                                label="School"
                                name="school"
                                placeholder="School / University"
                                value={form.school}
                                onChange={handleChange}
                                required
                                error={errors.school}
                            />

                            <Input
                                label="Course"
                                name="course"
                                placeholder="Course / Program"
                                value={form.course}
                                onChange={handleChange}
                                error={errors.course}
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Select
                                    label="Start Year"
                                    name="educationStartYear"
                                    placeholder="Select year"
                                    value={form.educationStartYear}
                                    onChange={handleChange}
                                    options={YEAR_OPTIONS}
                                    error={errors.educationStartYear}
                                />

                                <Select
                                    label="Graduated Year"
                                    name="educationGraduatedYear"
                                    placeholder="Select year"
                                    value={form.educationGraduatedYear}
                                    onChange={handleChange}
                                    options={YEAR_OPTIONS}
                                    error={errors.educationGraduatedYear}
                                />
                            </div>

                            <Text size="sm" className="text-gray-500">
                                Leave the graduated year blank if you have not graduated yet.
                            </Text>
                        </div>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Work Experience & Skills</Heading>

                            <Text className="mt-2 text-gray-600">
                                Tell us about your previous work experience and relevant skills.
                            </Text>
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Previous Employer"
                                    name="previousEmployer"
                                    placeholder="Company name"
                                    value={form.previousEmployer}
                                    onChange={handleChange}
                                    error={errors.previousEmployer}
                                />

                                <Input
                                    label="Previous Position"
                                    name="previousPosition"
                                    placeholder="Job position"
                                    value={form.previousPosition}
                                    onChange={handleChange}
                                    error={errors.previousPosition}
                                />
                            </div>

                            <Input
                                label="Company Address"
                                name="previousEmployerAddress"
                                placeholder="City, Province, Country"
                                value={form.previousEmployerAddress}
                                onChange={handleChange}
                                error={errors.previousEmployerAddress}
                            />

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Start (Month / Year)"
                                    name="workStart"
                                    type="month"
                                    placeholder="YYYY-MM"
                                    max={thisMonth()}
                                    value={form.workStart}
                                    onChange={handleChange}
                                    error={errors.workStart}
                                />

                                <Input
                                    label="End (Month / Year)"
                                    name="workEnd"
                                    type="month"
                                    placeholder="YYYY-MM"
                                    max={thisMonth()}
                                    value={form.workEnd}
                                    onChange={handleChange}
                                    error={errors.workEnd}
                                />
                            </div>

                            <Text size="sm" className="text-gray-500">
                                Leave the end date blank if you are still working there.
                            </Text>

                            <Textarea
                                label="Skills"
                                name="skills"
                                placeholder="List your relevant skills..."
                                value={form.skills}
                                onChange={handleChange}
                                required
                                rows={4}
                                error={errors.skills}
                            />

                            <Textarea
                                label="Certifications"
                                name="certifications"
                                placeholder="TESDA, NC II, training certificates, licenses, etc."
                                value={form.certifications}
                                onChange={handleChange}
                                rows={4}
                                error={errors.certifications}
                            />

                            <Textarea
                                label="Languages"
                                name="languages"
                                placeholder="English, Filipino, Mandarin, Japanese, etc."
                                value={form.languages}
                                onChange={handleChange}
                                required
                                rows={3}
                                error={errors.languages}
                            />
                        </div>
                    </Card>
                )}

                {step === 4 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Documents</Heading>

                            <Text className="mt-2 text-gray-600">
                                Upload the documents required for your application. Maximum of 5 MB per file.
                            </Text>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <FileField
                                label="Resume"
                                name="resume"
                                icon={FileText}
                                accept=".pdf,.doc,.docx"
                                hint="PDF, DOC, or DOCX"
                                file={form.resume}
                                onChange={handleChange}
                                error={errors.resume}
                                uploading={"resume" in uploading}
                                progress={uploading.resume}
                                required
                            />

                            <FileField
                                label="Valid ID"
                                name="validId"
                                accept=".jpg,.jpeg,.png,.pdf"
                                hint="JPG, PNG, or PDF"
                                file={form.validId}
                                onChange={handleChange}
                                error={errors.validId}
                                uploading={"validId" in uploading}
                                progress={uploading.validId}
                                required
                            />

                            <FileField
                                label="Passport"
                                name="passport"
                                accept=".jpg,.jpeg,.png,.pdf"
                                hint="JPG, PNG, or PDF"
                                file={form.passport}
                                onChange={handleChange}
                                error={errors.passport}
                                uploading={"passport" in uploading}
                                progress={uploading.passport}
                                required
                            />

                            <FileField
                                label="Other Requirements"
                                name="otherRequirements"
                                hint="Additional supporting document"
                                file={form.otherRequirements}
                                onChange={handleChange}
                                error={errors.otherRequirements}
                                uploading={"otherRequirements" in uploading}
                                progress={uploading.otherRequirements}
                            />
                        </div>
                    </Card>
                )}

                {step === 5 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Review Application</Heading>

                            <Text className="mt-2 text-gray-600">
                                Review your information before submitting your application.
                            </Text>
                        </div>

                        <div className="space-y-6">
                            <ReviewSection
                                title="Applying For"
                                items={[["Job Opening", job ? `${job.title} (${job.country})` : "General application"]]}
                            />

                            <ReviewSection
                                title="Personal Information"
                                items={[
                                    ["Full Name", form.fullName],
                                    ["Birthday", formatDate(form.birthday)],
                                    ["Gender", humanize(form.gender)],
                                    ["Civil Status", humanize(form.civilStatus)],
                                    ["Email", form.email],
                                    ["Phone", form.phone],
                                    ["Address", form.address],
                                ]}
                            />

                            <ReviewSection
                                title="Education"
                                items={[
                                    ["Educational Attainment", humanize(form.educationalAttainment)],
                                    ["School", form.school],
                                    ["Course", form.course],
                                    [
                                        "Years Attended",
                                        [form.educationStartYear, form.educationGraduatedYear]
                                        .filter(Boolean)
                                        .join(" – "),
                                    ],
                                ]}
                            />

                            <ReviewSection
                                title="Work Experience & Skills"
                                items={[
                                    ["Previous Employer", form.previousEmployer],
                                    ["Company Address", form.previousEmployerAddress],
                                    ["Previous Position", form.previousPosition],
                                    ["Period", formatPeriod(form.workStart, form.workEnd)],
                                    ["Skills", form.skills],
                                    ["Certifications", form.certifications],
                                    ["Languages", form.languages],
                                ]}
                            />

                            <ReviewSection
                                title="Documents"
                                items={[
                                    ["Resume", form.resume?.name],
                                    ["Valid ID", form.validId?.name],
                                    ["Passport", form.passport?.name],
                                    ["Other Requirements", form.otherRequirements?.name],
                                ]}
                            />
                        </div>
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <Text className="mb-3 text-gray-700">
                                Verify that you are not a robot before submitting.
                            </Text>

                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={setCaptchaToken}
                                onExpired={() => setCaptchaToken(null)}
                                onErrored={() => setCaptchaToken(null)}
                            />
                        </div>
                    </Card>
                )}

                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                    {step > 1 ? (
                        <Button
                            variant="secondary"
                            onClick={() => goToStep(step - 1)}
                            disabled={loading || isUploading}
                        >
                            <ArrowLeft size={18} />
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 5 ? (
                        <Button onClick={nextStep} disabled={jobState === "loading" || isUploading}>
                            {isUploading ? "Uploading file..." : "Continue"}
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} loading={loading}>
                            {!loading && <Check size={18} />}
                            {loading ? "Uploading application..." : "Submit Application"}
                        </Button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default RecruitmentApply;
