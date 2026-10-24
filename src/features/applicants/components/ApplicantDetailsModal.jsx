import {BriefcaseBusiness, ChevronRight, FileText, MessageSquareText, Pencil} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import DetailGrid from "../../../shared/components/DetailGrid";
import Modal from "../../../shared/components/Modal";
import {formatDate, formatPeriod} from "../../../shared/utils/formatDate";
import {getNextStage, humanize, missingAssignment, requiresAssignment, sourceStyles, statusStyles} from "../utils";

const Section = ({icon: Icon, title, children}) => (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="mb-3 flex items-center gap-2">
            {Icon && <Icon size={18} className="text-blue-900" />}
            <Text weight="semibold" className="text-gray-900">
                {title}
            </Text>
        </div>
        {children}
    </div>
);

const ApplicantDetailsModal = ({applicant, onClose, onEdit, onAssign, onAssignEmployer, onMoveNext}) => {
    const nextStage = getNextStage(applicant);
    const {job, employer} = applicant;

    const educationYears = [applicant.education_start_year, applicant.education_graduated_year]
    .filter(Boolean)
    .join(" – ");

    const yearsExperience =
        applicant.years_experience === null || applicant.years_experience === undefined
            ? null
            : `${applicant.years_experience} year${Number(applicant.years_experience) === 1 ? "" : "s"}`;

    const documents = applicant.documents ?? [];

    return (
        <Modal
            size="xxl"
            eyebrow="Applicant Details"
            title={applicant.name}
            subtitle={applicant.reference}
            onClose={onClose}
            footer={
                <>
                    <Button type="button" variant="secondary" onClick={() => onEdit(applicant)}>
                        <Pencil size={16} />
                        Update Status / Remarks
                    </Button>
                    {nextStage && (
                        <Button type="button" onClick={() => onMoveNext(applicant, nextStage)}>
                            Move to {nextStage}
                            <ChevronRight size={16} />
                        </Button>
                    )}
                </>
            }
        >
            <div className="space-y-5 p-5 sm:p-6">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2">
                    <Text
                        as="span"
                        size="xs"
                        weight="semibold"
                        className={`rounded-full px-2.5 py-1 ${statusStyles[applicant.status]}`}
                    >
                        {applicant.status}
                    </Text>
                    <Text
                        as="span"
                        size="xs"
                        weight="semibold"
                        className={`rounded-full px-2.5 py-1 ${sourceStyles[applicant.source]}`}
                    >
                        {applicant.source === "direct" ? "Direct Apply" : "Job Application"}
                    </Text>
                    {applicant.channel === "walk_in" && (
                        <Text
                            as="span"
                            size="xs"
                            weight="semibold"
                            className="rounded-full bg-gray-100 px-2.5 py-1 text-gray-700"
                        >
                            Walk-in
                        </Text>
                    )}
                </div>

                {requiresAssignment(applicant) && (
                    <Text size="sm" className="rounded-lg bg-amber-50 px-3.5 py-2.5 text-amber-800">
                        {missingAssignment(applicant) === "job"
                            ? "Assign a job, then an employer, before this applicant can move forward."
                            : "Assign an employer before this applicant can move forward."}
                    </Text>
                )}

                <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">
                    {/* Kaliwa: profile (2/3) */}
                    <div className="flex min-w-0 flex-col gap-5 lg:col-span-2">
                        <Section title="Personal Information">
                            <DetailGrid
                                items={[
                                    ["Email Address", applicant.email],
                                    ["Contact Number", applicant.phone],
                                    ["Birthday", formatDate(applicant.birthday)],
                                    ["Gender", humanize(applicant.gender)],
                                    ["Civil Status", humanize(applicant.civil_status)],
                                    ["Date Applied", formatDate(applicant.applied_at)],
                                    ["Address", applicant.address],
                                ]}
                            />
                        </Section>

                        <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                            <Section title="Education">
                                <DetailGrid
                                    items={[
                                        ["Educational Attainment", humanize(applicant.educational_attainment)],
                                        ["School", applicant.school],
                                        ["Course", applicant.course],
                                        ["Years Attended", educationYears],
                                    ]}
                                />
                            </Section>

                            <Section title="Work Experience & Skills">
                                <DetailGrid
                                    items={[
                                        ["Previous Employer", applicant.previous_employer],
                                        ["Company Address", applicant.previous_employer_address],
                                        ["Previous Position", applicant.previous_position],
                                        ["Period", formatPeriod(applicant.work_start, applicant.work_end)],
                                        ["Years of Experience", yearsExperience],
                                        ["Languages", applicant.languages],
                                        ["Skills", applicant.skills],
                                        ["Certifications", applicant.certifications],
                                    ]}
                                />
                            </Section>
                        </div>
                    </div>

                    {/* Kanan: sidebar (1/3) */}
                    <div className="flex min-w-0 flex-col gap-5">
                        <Section icon={BriefcaseBusiness} title="Job & Employer">
                            <DetailGrid
                                items={[
                                    ["Job Opening", job?.title ?? "Not assigned yet"],
                                    ["Country", job?.country],
                                    ["Salary Range", job?.salary],
                                    ["Employer", employer?.name ?? (job ? "Not assigned yet" : null)],
                                ]}
                            />

                            <div className="mt-4 flex flex-wrap gap-2">
                                <Button type="button" size="sm" variant="secondary" onClick={() => onAssign(applicant)}>
                                    {job ? "Change Job" : "Assign Job"}
                                </Button>

                                {job && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="secondary"
                                        onClick={() => onAssignEmployer(applicant)}
                                    >
                                        {employer ? "Change Employer" : "Assign Employer"}
                                    </Button>
                                )}
                            </div>
                        </Section>

                        <Section icon={FileText} title="Submitted Documents">
                            <div className="space-y-2">
                                {documents.map((document) => (
                                    <div
                                        key={document.id}
                                        className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-3"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <FileText size={18} className="shrink-0 text-gray-500" />
                                            <div className="min-w-0">
                                                <Text
                                                    as="span"
                                                    size="sm"
                                                    weight="medium"
                                                    className="block text-gray-800"
                                                >
                                                    {document.label}
                                                </Text>
                                                <Text as="span" size="xs" className="block truncate text-gray-500">
                                                    {document.name}
                                                </Text>
                                            </div>
                                        </div>

                                        <a
                                            href={document.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-950 hover:bg-gray-50"
                                        >
                                            View
                                        </a>
                                    </div>
                                ))}

                                {documents.length === 0 && (
                                    <Text size="sm" className="text-gray-500">
                                        No documents uploaded.
                                    </Text>
                                )}
                            </div>
                        </Section>

                        <Section icon={MessageSquareText} title="Recruitment Remarks">
                            <Text size="sm" className="whitespace-pre-wrap leading-6 text-gray-600">
                                {applicant.remarks || "No remarks added yet."}
                            </Text>
                        </Section>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ApplicantDetailsModal;
