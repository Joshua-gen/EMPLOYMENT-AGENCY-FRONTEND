import {useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {ArrowLeft, Check, FileText, Upload} from "lucide-react";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";

const RecruitmentApply = () => {
    const navigate = useNavigate();
    const {jobId} = useParams();
    const location = useLocation();

    const selectedJob = location.state?.job || null;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        jobId: jobId || selectedJob?.id || "",
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
        previousEmployer: "",
        previousPosition: "",
        yearsExperience: "",
        skills: "",
        certifications: "",
        languages: "",
        resume: null,
        validId: null,
        passport: null,
        otherRequirements: null,
    });

    const [errors, setErrors] = useState({});

    const handleChange = (event) => {
        const {name, value, files} = event.target;

        setForm((current) => ({
            ...current,
            [name]: files ? files[0] : value,
        }));

        setErrors((current) => ({
            ...current,
            [name]: "",
        }));
    };

    const validateStep = () => {
        const newErrors = {};

        if (step === 1) {
            if (!form.fullName) newErrors.fullName = "Full name is required.";
            if (!form.birthday) newErrors.birthday = "Birthday is required.";
            if (!form.gender) newErrors.gender = "Gender is required.";
            if (!form.civilStatus) newErrors.civilStatus = "Civil status is required.";
            if (!form.email) newErrors.email = "Email address is required.";
            if (!form.phone) newErrors.phone = "Contact number is required.";
            if (!form.address) newErrors.address = "Address is required.";
        }

        if (step === 2) {
            if (!form.educationalAttainment) {
                newErrors.educationalAttainment = "Educational attainment is required.";
            }

            if (!form.school) {
                newErrors.school = "School is required.";
            }
        }

        if (step === 3) {
            if (!form.skills) {
                newErrors.skills = "Please provide your skills.";
            }

            if (!form.languages) {
                newErrors.languages = "Please provide your languages.";
            }
        }

        if (step === 4) {
            if (!form.resume) {
                newErrors.resume = "Resume is required.";
            }

            if (!form.validId) {
                newErrors.validId = "Valid ID is required.";
            }

            if (!form.passport) {
                newErrors.passport = "Passport is required.";
            }
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep((current) => Math.min(current + 1, 5));
            window.scrollTo({top: 0, behavior: "smooth"});
        }
    };

    const previousStep = () => {
        setStep((current) => Math.max(current - 1, 1));
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    const handleSubmit = async () => {
        if (!validateStep()) {
            return;
        }

        setLoading(true);

        const payload = new FormData();

        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== "") {
                payload.append(key, value);
            }
        });

        try {
            console.log("Application payload ready for API:", Object.fromEntries(payload));

            await new Promise((resolve) => setTimeout(resolve, 1200));

            setSubmitted(true);
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

                        <p className="mb-8 text-gray-600">
                            Thank you for submitting your application. Our recruitment team will review your application
                            and contact you regarding the next steps.
                        </p>

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
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#4F7383]">Recruitment</p>

                    <Heading as="h1">Applicant Application</Heading>

                    <p className="mt-2 max-w-2xl text-gray-600">
                        Complete the application form below. No account is required to apply.
                    </p>
                </div>

                {selectedJob && (
                    <Card className="mb-8 border-[#062B4A]/15 bg-[#062B4A]/[0.03]">
                        <p className="mb-1 text-sm font-semibold text-[#4F7383]">Applying For</p>

                        <Heading as="h2">{selectedJob.title}</Heading>

                        <p className="mt-1 text-gray-600">{selectedJob.country}</p>
                    </Card>
                )}

                <div className="mb-8 grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((item) => (
                        <div key={item}>
                            <div
                                className={`mb-2 h-2 rounded-full transition-all duration-300 ${
                                    item <= step ? "bg-[#062B4A]" : "bg-gray-200"
                                }`}
                            />

                            <p
                                className={`text-center text-xs font-semibold ${
                                    item <= step ? "text-[#062B4A]" : "text-gray-400"
                                }`}
                            >
                                {item === 1 && "Personal"}
                                {item === 2 && "Education"}
                                {item === 3 && "Experience"}
                                {item === 4 && "Documents"}
                                {item === 5 && "Review"}
                            </p>
                        </div>
                    ))}
                </div>

                {step === 1 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Personal Information</Heading>

                            <p className="mt-2 text-gray-600">Provide your basic personal and contact information.</p>
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
                                    value={form.birthday}
                                    onChange={handleChange}
                                    required
                                    error={errors.birthday}
                                />

                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    required
                                    error={errors.gender}
                                    options={[
                                        {value: "male", label: "Male"},
                                        {value: "female", label: "Female"},
                                    ]}
                                />

                                <Select
                                    label="Civil Status"
                                    name="civilStatus"
                                    value={form.civilStatus}
                                    onChange={handleChange}
                                    required
                                    error={errors.civilStatus}
                                    options={[
                                        {value: "single", label: "Single"},
                                        {value: "married", label: "Married"},
                                        {value: "widowed", label: "Widowed"},
                                        {value: "separated", label: "Separated"},
                                    ]}
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

                            <p className="mt-2 text-gray-600">Provide your educational background.</p>
                        </div>

                        <div className="space-y-5">
                            <Select
                                label="Educational Attainment"
                                name="educationalAttainment"
                                value={form.educationalAttainment}
                                onChange={handleChange}
                                required
                                error={errors.educationalAttainment}
                                options={[
                                    {value: "elementary", label: "Elementary"},
                                    {value: "high-school", label: "High School"},
                                    {value: "senior-high", label: "Senior High School"},
                                    {value: "vocational", label: "Vocational"},
                                    {value: "college", label: "College"},
                                    {value: "post-graduate", label: "Post Graduate"},
                                ]}
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
                            />
                        </div>
                    </Card>
                )}

                {step === 3 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Work Experience & Skills</Heading>

                            <p className="mt-2 text-gray-600">
                                Tell us about your previous work experience and relevant skills.
                            </p>
                        </div>

                        <div className="space-y-5">
                            <div className="grid gap-5 md:grid-cols-2">
                                <Input
                                    label="Previous Employer"
                                    name="previousEmployer"
                                    placeholder="Company name"
                                    value={form.previousEmployer}
                                    onChange={handleChange}
                                />

                                <Input
                                    label="Previous Position"
                                    name="previousPosition"
                                    placeholder="Job position"
                                    value={form.previousPosition}
                                    onChange={handleChange}
                                />
                            </div>

                            <Input
                                label="Years of Experience"
                                name="yearsExperience"
                                type="number"
                                min="0"
                                placeholder="e.g. 2"
                                value={form.yearsExperience}
                                onChange={handleChange}
                            />

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

                            <p className="mt-2 text-gray-600">Upload the documents required for your application.</p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Resume <span className="text-red-500">*</span>
                                </label>

                                <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-[#062B4A] hover:bg-[#062B4A]/5">
                                    <FileText size={28} className="mb-2 text-[#062B4A]" />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {form.resume?.name || "Choose Resume"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">PDF, DOC, or DOCX</span>

                                    <input
                                        type="file"
                                        name="resume"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>

                                {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Valid ID <span className="text-red-500">*</span>
                                </label>

                                <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-[#062B4A] hover:bg-[#062B4A]/5">
                                    <Upload size={28} className="mb-2 text-[#062B4A]" />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {form.validId?.name || "Choose Valid ID"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">JPG, PNG, or PDF</span>

                                    <input
                                        type="file"
                                        name="validId"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>

                                {errors.validId && <p className="mt-1 text-sm text-red-600">{errors.validId}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Passport <span className="text-red-500">*</span>
                                </label>

                                <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-[#062B4A] hover:bg-[#062B4A]/5">
                                    <Upload size={28} className="mb-2 text-[#062B4A]" />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {form.passport?.name || "Choose Passport"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">JPG, PNG, or PDF</span>

                                    <input
                                        type="file"
                                        name="passport"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>

                                {errors.passport && <p className="mt-1 text-sm text-red-600">{errors.passport}</p>}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-gray-700">
                                    Other Requirements
                                </label>

                                <label className="flex cursor-pointer flex-col items-center rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center transition hover:border-[#062B4A] hover:bg-[#062B4A]/5">
                                    <Upload size={28} className="mb-2 text-[#062B4A]" />

                                    <span className="text-sm font-semibold text-gray-700">
                                        {form.otherRequirements?.name || "Choose File"}
                                    </span>

                                    <span className="mt-1 text-xs text-gray-500">Additional supporting document</span>

                                    <input
                                        type="file"
                                        name="otherRequirements"
                                        onChange={handleChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>
                    </Card>
                )}

                {step === 5 && (
                    <Card>
                        <div className="mb-8">
                            <Heading as="h2">Review Application</Heading>

                            <p className="mt-2 text-gray-600">
                                Review your information before submitting your application.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="mb-3 font-bold text-[#062B4A]">Personal Information</h3>

                                <div className="grid gap-4 rounded-xl bg-gray-50 p-5 md:grid-cols-2">
                                    <p>
                                        <span className="font-semibold">Full Name:</span> {form.fullName}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Birthday:</span> {form.birthday}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Gender:</span> {form.gender}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Civil Status:</span> {form.civilStatus}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Email:</span> {form.email}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Phone:</span> {form.phone}
                                    </p>
                                    <p className="md:col-span-2">
                                        <span className="font-semibold">Address:</span> {form.address}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 font-bold text-[#062B4A]">Education</h3>

                                <div className="grid gap-4 rounded-xl bg-gray-50 p-5 md:grid-cols-2">
                                    <p>
                                        <span className="font-semibold">Educational Attainment:</span>{" "}
                                        {form.educationalAttainment}
                                    </p>

                                    <p>
                                        <span className="font-semibold">School:</span> {form.school}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Course:</span> {form.course || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 font-bold text-[#062B4A]">Work Experience & Skills</h3>

                                <div className="space-y-3 rounded-xl bg-gray-50 p-5">
                                    <p>
                                        <span className="font-semibold">Previous Employer:</span>{" "}
                                        {form.previousEmployer || "Not provided"}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Previous Position:</span>{" "}
                                        {form.previousPosition || "Not provided"}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Years of Experience:</span>{" "}
                                        {form.yearsExperience || "Not provided"}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Skills:</span> {form.skills}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Certifications:</span>{" "}
                                        {form.certifications || "Not provided"}
                                    </p>

                                    <p>
                                        <span className="font-semibold">Languages:</span> {form.languages}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h3 className="mb-3 font-bold text-[#062B4A]">Documents</h3>

                                <div className="space-y-2 rounded-xl bg-gray-50 p-5 text-sm">
                                    <p>Resume: {form.resume?.name || "Not provided"}</p>
                                    <p>Valid ID: {form.validId?.name || "Not provided"}</p>
                                    <p>Passport: {form.passport?.name || "Not provided"}</p>
                                    <p>Other Requirements: {form.otherRequirements?.name || "Not provided"}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                )}

                <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-6 sm:flex-row">
                    {step > 1 ? (
                        <Button variant="secondary" onClick={previousStep} disabled={loading}>
                            <ArrowLeft size={18} />
                            Previous
                        </Button>
                    ) : (
                        <div />
                    )}

                    {step < 5 ? (
                        <Button onClick={nextStep}>Continue</Button>
                    ) : (
                        <Button onClick={handleSubmit} loading={loading}>
                            {!loading && <Check size={18} />}
                            Submit Application
                        </Button>
                    )}
                </div>
            </div>
        </main>
    );
};

export default RecruitmentApply;
