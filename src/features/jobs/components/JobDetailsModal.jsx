import {Pencil} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import {formatDate, statusStyles} from "../utils";

const JobDetailsModal = ({job, onClose, onEdit}) => (
    <Modal
        eyebrow="Job Opening Details"
        title={job.title}
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
        <div className="space-y-4 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
                <Text as="span" size="sm" className="text-gray-500">
                    Status
                </Text>
                <Text
                    as="span"
                    size="xs"
                    weight="semibold"
                    className={`rounded-full px-2.5 py-1 ${statusStyles[job.status]}`}
                >
                    {job.status}
                </Text>
            </div>

            {[
                ["Employer", job.employer],
                ["Country", job.country],
                ["Vacancies", job.vacancies],
                ["Salary Range", job.salary],
                ["Application Deadline", formatDate(job.deadline)],
                ["Description", job.description],
            ].map(([label, value]) => (
                <div key={label} className="border-b border-gray-100 pb-3 last:border-0">
                    <Text size="xs" weight="medium" className="uppercase tracking-wide text-gray-400">
                        {label}
                    </Text>
                    <Text size="sm" weight="medium" className="mt-1 whitespace-pre-line text-gray-800">
                        {value || "—"}
                    </Text>
                </div>
            ))}
        </div>
    </Modal>
);

export default JobDetailsModal;
