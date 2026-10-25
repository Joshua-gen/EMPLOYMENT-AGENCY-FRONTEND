import {useRef, useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import {Building2, UserRound, ClipboardList, Plus, Trash2, Send, CheckCircle2, ArrowLeft} from "lucide-react";
import {Link} from "react-router-dom";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Heading from "../components/ui/Heading";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import CountrySelect from "../features/countries/components/CountrySelect";
import BusinessCategorySelect from "../features/employers/components/BusinessCategorySelect";
import {toResult, websiteManpowerRequestApi} from "../features/manpowerRequests/api/manpowerRequestApi";

const initialForm = {
    businessName: "",
    businessAddress: "",
    businessLicenseNo: "",
    businessCategoryId: "",
    country: "",
    contactPerson: "",
    contactPosition: "",
    telNo: "",
    email: "",
    website: "",
    contactFax: "", // honeypot: nakatago, hindi dapat sinasagutan
};

const createJobPosition = () => ({
    id: crypto.randomUUID(),
    position: "",
    numberRequired: "1",
    jobDescription: "",
});

// form field -> API field
const FIELD_MAP = {
    business_name: "businessName",
    business_category_id: "businessCategoryId",
    country: "country",
    business_address: "businessAddress",
    license_no: "businessLicenseNo",
    contact_person: "contactPerson",
    contact_position: "contactPosition",
    contact_tel: "telNo",
    contact_email: "email",
    website: "website",
};

const POSITION_FIELD_MAP = {position: "position", number_required: "numberRequired", description: "jobDescription"};

const ManpowerRequest = () => {
    const [form, setForm] = useState(initialForm);
    const [jobPositions, setJobPositions] = useState([createJobPosition()]);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [reference, setReference] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState(null);
    const recaptchaRef = useRef(null);

    const setField = (name, value) => {
        setForm((current) => ({...current, [name]: value}));
        setErrors((current) => ({...current, [name]: ""}));
    };

    const handleChange = (event) => setField(event.target.name, event.target.value);

    const handleJobChange = (id, field, value) => {
        setJobPositions((current) => current.map((job) => (job.id === id ? {...job, [field]: value} : job)));
        setErrors((current) => ({...current, [`${id}-${field}`]: ""}));
    };

    const addJobPosition = () => {
        if (jobPositions.length >= 10) return;
        setJobPositions((current) => [...current, createJobPosition()]);
    };

    const removeJobPosition = (id) => {
        if (jobPositions.length === 1) return;
        setJobPositions((current) => current.filter((job) => job.id !== id));
    };

    const validateForm = () => {
        const nextErrors = {};

        ["businessName", "businessAddress", "contactPerson", "contactPosition", "telNo", "email"].forEach((field) => {
            if (!String(form[field]).trim()) nextErrors[field] = "This field is required.";
        });

        if (!form.country) nextErrors.country = "Please select a country.";
        if (!form.businessCategoryId) nextErrors.businessCategoryId = "Please select the nature of business.";

        if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = "Please enter a valid email address.";
        }

        const seen = new Set();

        jobPositions.forEach((job) => {
            const name = job.position.trim().toLowerCase();

            if (!name) nextErrors[`${job.id}-position`] = "Position is required.";
            else if (seen.has(name)) nextErrors[`${job.id}-position`] = "Each position can only be listed once.";
            seen.add(name);

            if (
                !job.numberRequired ||
                !Number.isInteger(Number(job.numberRequired)) ||
                Number(job.numberRequired) < 1
            ) {
                nextErrors[`${job.id}-numberRequired`] = "Enter at least 1 worker.";
            }

            if (!job.jobDescription.trim()) nextErrors[`${job.id}-jobDescription`] = "Job description is required.";
        });

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    // 422 errors ng Laravel -> errors ng form
    const mapServerErrors = (serverErrors) => {
        const mapped = {};
        let general = "";

        Object.entries(serverErrors).forEach(([key, messages]) => {
            const message = Array.isArray(messages) ? messages[0] : messages;
            const match = key.match(/^positions\.(\d+)\.(\w+)$/);

            if (match) {
                const job = jobPositions[Number(match[1])];
                const field = POSITION_FIELD_MAP[match[2]];
                if (job && field) mapped[`${job.id}-${field}`] = message;
            } else if (FIELD_MAP[key]) {
                mapped[FIELD_MAP[key]] = message;
            } else {
                general = message; // hal. positions, contact_fax
            }
        });

        setErrors(mapped);
        setServerError(general);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setServerError("");

        if (!validateForm()) {
            window.scrollTo({top: 0, behavior: "smooth"});
            return;
        }

        if (!captchaToken) {
            setServerError("Please complete the reCAPTCHA verification.");
            return;
        }

        setSubmitting(true);

        const result = await toResult(() =>
            websiteManpowerRequestApi.submit({
                business_name: form.businessName,
                business_category_id: Number(form.businessCategoryId),
                country: form.country,
                business_address: form.businessAddress,
                license_no: form.businessLicenseNo,
                contact_person: form.contactPerson,
                contact_position: form.contactPosition,
                contact_tel: form.telNo,
                contact_email: form.email,
                website: form.website,
                contact_fax: form.contactFax,
                positions: jobPositions.map((job) => ({
                    position: job.position,
                    number_required: Number(job.numberRequired),
                    description: job.jobDescription,
                })),
                g_recaptcha_response: captchaToken,
            })
        );
        setSubmitting(false);
        setCaptchaToken(null);
        recaptchaRef.current?.reset();

        if (result.ok) {
            setReference(result.data?.reference ?? null);
            setSubmitted(true);
            window.scrollTo({top: 0, behavior: "smooth"});
        } else {
            if (Object.keys(result.errors).length) mapServerErrors(result.errors);
            else setServerError(result.message);

            window.scrollTo({top: 0, behavior: "smooth"});
        }
    };

    const resetForm = () => {
        setForm(initialForm);
        setJobPositions([createJobPosition()]);
        setErrors({});
        setServerError("");
        setReference(null);
        setSubmitted(false);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-gray-50 px-5 py-12 sm:px-6">
                <div className="mx-auto max-w-2xl">
                    <Card className="px-6 py-10 text-center sm:px-10">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#4F7383]/10 text-[#062B4A]">
                            <CheckCircle2 size={34} />
                        </div>

                        <Heading as="h1" className="mb-3">
                            Request Submitted
                        </Heading>

                        <p className="leading-7 text-gray-600">
                            Thank you. Your manpower request was received and will be reviewed by our team.
                        </p>

                        {reference && (
                            <div className="mx-auto mt-6 max-w-xs rounded-xl bg-gray-50 px-5 py-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Reference No.
                                </p>
                                <p className="mt-1 text-2xl font-bold text-[#062B4A]">{reference}</p>
                                <p className="mt-1 text-xs text-gray-500">Keep this for your records.</p>
                            </div>
                        )}

                        <div className="mt-7 flex justify-center">
                            <Button onClick={resetForm}>Create Another Request</Button>
                        </div>

                        <Link
                            to="/"
                            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#4F7383] hover:text-[#062B4A]"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </Card>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mb-8">
                    <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#4F7383]">For Employers</p>

                    <Heading as="h1" className="mb-3">
                        Manpower Request
                    </Heading>

                    <p className="max-w-3xl leading-7 text-gray-600">
                        Fill up all the required fields for your manpower request to be processed.
                    </p>
                </div>

                {serverError && (
                    <p className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
                )}

                <Card>
                    <form onSubmit={handleSubmit} noValidate>
                        {/* Honeypot: nakatago sa tao, pinupunan ng bot */}
                        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                            <label>
                                Fax
                                <input
                                    type="text"
                                    name="contactFax"
                                    tabIndex={-1}
                                    autoComplete="off"
                                    value={form.contactFax}
                                    onChange={handleChange}
                                />
                            </label>
                        </div>

                        {/* Business Details */}
                        <section className="pb-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                                    <Building2 size={22} />
                                </div>

                                <Heading as="h2">Business Details</Heading>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Business Name *"
                                    name="businessName"
                                    value={form.businessName}
                                    onChange={handleChange}
                                    placeholder="Enter business name"
                                    required
                                    error={errors.businessName}
                                />

                                <CountrySelect
                                    id="manpower-country"
                                    label="Country"
                                    required
                                    value={form.country}
                                    onChange={(value) => setField("country", value)}
                                    error={errors.country}
                                />

                                <Input
                                    label="Business Address *"
                                    name="businessAddress"
                                    value={form.businessAddress}
                                    onChange={handleChange}
                                    placeholder="Enter business address"
                                    required
                                    error={errors.businessAddress}
                                />

                                <BusinessCategorySelect
                                    id="manpower-category"
                                    label="Nature of Business"
                                    required
                                    value={form.businessCategoryId}
                                    onChange={(value) => setField("businessCategoryId", value)}
                                    error={errors.businessCategoryId}
                                />

                                <Input
                                    label="Business License No."
                                    name="businessLicenseNo"
                                    value={form.businessLicenseNo}
                                    onChange={handleChange}
                                    placeholder="Enter license number"
                                    error={errors.businessLicenseNo}
                                />
                            </div>
                        </section>

                        <div className="border-t border-gray-200" />

                        {/* Contact Information */}
                        <section className="py-8">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4F7383]/10 text-[#062B4A]">
                                    <UserRound size={22} />
                                </div>

                                <Heading as="h2">Contact Information</Heading>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Contact Person *"
                                    name="contactPerson"
                                    value={form.contactPerson}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                    error={errors.contactPerson}
                                />

                                <Input
                                    label="Position *"
                                    name="contactPosition"
                                    value={form.contactPosition}
                                    onChange={handleChange}
                                    placeholder="e.g. HR Manager"
                                    required
                                    error={errors.contactPosition}
                                />

                                <Input
                                    label="Tel. No. *"
                                    name="telNo"
                                    type="tel"
                                    value={form.telNo}
                                    onChange={handleChange}
                                    placeholder="Enter telephone or mobile number"
                                    required
                                    error={errors.telNo}
                                />

                                <Input
                                    label="Email *"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="company@example.com"
                                    required
                                    error={errors.email}
                                />

                                <div className="md:col-span-2">
                                    <Input
                                        label="Website"
                                        name="website"
                                        value={form.website}
                                        onChange={handleChange}
                                        placeholder="https://www.example.com"
                                        error={errors.website}
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-200" />

                        {/* Job Positions */}
                        <section className="pt-8">
                            <div className="mb-2 flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#062B4A]/10 text-[#062B4A]">
                                    <ClipboardList size={22} />
                                </div>

                                <div>
                                    <Heading as="h2">Job Positions</Heading>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Add the positions and number of workers you need.
                                    </p>
                                </div>
                            </div>

                            <p className="mb-6 mt-4 text-sm font-semibold text-[#4F7383]">
                                Note: You can add up to ten (10) job positions.
                            </p>

                            <div className="space-y-5">
                                {jobPositions.map((job, index) => (
                                    <div
                                        key={job.id}
                                        className="rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5"
                                    >
                                        <div className="mb-5 flex items-center justify-between gap-3">
                                            <h3 className="font-semibold text-[#062B4A]">Job Position {index + 1}</h3>

                                            {jobPositions.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeJobPosition(job.id)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    <Trash2 size={16} />
                                                    Remove
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid gap-5 md:grid-cols-2">
                                            <Input
                                                label="Position *"
                                                name={`position-${job.id}`}
                                                value={job.position}
                                                onChange={(event) =>
                                                    handleJobChange(job.id, "position", event.target.value)
                                                }
                                                placeholder="e.g. Factory Worker"
                                                required
                                                error={errors[`${job.id}-position`]}
                                            />

                                            <Input
                                                label="No. Required *"
                                                name={`numberRequired-${job.id}`}
                                                type="number"
                                                min="1"
                                                step="1"
                                                value={job.numberRequired}
                                                onChange={(event) =>
                                                    handleJobChange(job.id, "numberRequired", event.target.value)
                                                }
                                                placeholder="Number of workers"
                                                required
                                                error={errors[`${job.id}-numberRequired`]}
                                            />

                                            <div className="md:col-span-2">
                                                <Textarea
                                                    label="Job Description *"
                                                    name={`jobDescription-${job.id}`}
                                                    value={job.jobDescription}
                                                    onChange={(event) =>
                                                        handleJobChange(job.id, "jobDescription", event.target.value)
                                                    }
                                                    placeholder="Describe the duties and responsibilities for this position."
                                                    rows={3}
                                                    required
                                                    error={errors[`${job.id}-jobDescription`]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {jobPositions.length < 10 && (
                                <button
                                    type="button"
                                    onClick={addJobPosition}
                                    className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#062B4A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#4F7383]"
                                >
                                    <Plus size={18} />
                                    Add More
                                </button>
                            )}

                            <p className="mt-3 text-xs text-gray-500">
                                {jobPositions.length} of 10 job positions added.
                            </p>
                        </section>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <p className="mb-3 text-sm text-gray-700">
                                Verify that you are not a robot before submitting.
                            </p>

                            <ReCAPTCHA
                                ref={recaptchaRef}
                                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                                onChange={setCaptchaToken}
                                onExpired={() => setCaptchaToken(null)}
                                onErrored={() => setCaptchaToken(null)}
                            />

                            {!captchaToken && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Please complete the verification to submit your request.
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex flex-col-reverse gap-4 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">Please review all details before submitting.</p>

                            <Button type="submit" disabled={submitting}>
                                <Send size={17} />
                                {submitting ? "Submitting..." : "Submit Manpower Request"}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="mt-6">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#4F7383] transition hover:text-[#062B4A]"
                    >
                        <ArrowLeft size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ManpowerRequest;
