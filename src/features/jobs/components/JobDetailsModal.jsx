import {Pencil, Users} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import {formatDate, statusStyles} from "../utils";

const JOB_FIELDS = [
    {name: "country", label: "Country"},
    {
        name: "employers",
        label: "Employers",
        getValue: (job) => (job.employers ?? []).map((employer) => employer.name).join(", "),
    },
    {name: "vacancies", label: "Total Vacancies", half: true},
    {name: "salary", label: "Salary Range", half: true},
    {
        name: "deadline",
        label: "Application Deadline",
        getValue: (job) => formatDate(job.deadline),
    },
];

const ApplicantInformationSection = () => (
    <section className="flex flex-col rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <Users size={20} />
            </div>

            <div>
                <Text size="sm" weight="semibold" className="text-gray-900">
                    Applicant Information
                </Text>
                <Text size="xs" className="mt-0.5 text-gray-500">
                    Applicants for this job opening
                </Text>
            </div>
        </div>

        <div className="flex flex-col p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3">
                    <Text size="xs" className="text-gray-500">
                        Total Applicants
                    </Text>
                    <Text size="xl" weight="semibold" className="mt-1 text-gray-900">
                        —
                    </Text>
                </div>

                <div className="rounded-lg bg-gray-50 p-3">
                    <Text size="xs" className="text-gray-500">
                        Pending Applications
                    </Text>
                    <Text size="xl" weight="semibold" className="mt-1 text-gray-900">
                        —
                    </Text>
                </div>
            </div>

            <div className="mt-5 flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 px-4 py-8 text-center">
                <Users size={28} className="text-gray-300" />

                <Text size="sm" weight="medium" className="mt-3 text-gray-700">
                    Applicant List
                </Text>

                <Text size="xs" className="mt-1 max-w-xs text-gray-500">
                    Applicant records and application statuses will appear here.
                </Text>
            </div>
        </div>
    </section>
);

const JobDetailsModal = ({job, onClose, onEdit}) => (
    <Modal
        eyebrow="Job Opening Details"
        title={job.title}
        size="xl"
        onClose={onClose}
        footer={
            <>
                <Button type="button" variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button type="button" onClick={() => onEdit(job)}>
                    <Pencil size={16} />
                    Edit Job
                </Button>
            </>
        }
    >
        <div className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-5">
                    <div className="grid grid-cols-1 content-start gap-5 lg:grid-cols-2">
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 px-4 py-3 lg:col-span-2">
                            <Text size="sm" className="text-gray-500">
                                Status
                            </Text>
                            <Text
                                as="span"
                                size="xs"
                                weight="semibold"
                                className={`rounded-full px-2.5 py-1 ${
                                    statusStyles[job.status] ?? "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {job.status}
                            </Text>
                        </div>

                        {JOB_FIELDS.map(({name, label, half, getValue}) => {
                            const value = getValue ? getValue(job) : job[name];

                            return (
                                <div key={name} className={`min-w-0 ${half ? "" : "lg:col-span-2"}`}>
                                    <Text size="xs" weight="medium" className="uppercase tracking-wide text-gray-400">
                                        {label}
                                    </Text>
                                    <Text
                                        size="sm"
                                        weight="medium"
                                        className="mt-1 whitespace-pre-line break-words text-gray-800"
                                    >
                                        {value === null || value === undefined || value === "" ? "—" : value}
                                    </Text>
                                </div>
                            );
                        })}
                    </div>

                    <ApplicantInformationSection />
                </div>

                <div className="min-w-0">
                    <section className="h-full rounded-xl border border-gray-200 p-4 sm:p-5">
                        <Text size="xs" weight="medium" className="uppercase tracking-wide text-gray-400">
                            Job Description
                        </Text>
                        <Text size="sm" className="mt-2 whitespace-pre-line break-words leading-6 text-gray-700">
                            {job.description || "No job description provided."}
                        </Text>
                    </section>
                </div>
            </div>
        </div>
    </Modal>
);

export default JobDetailsModal;
