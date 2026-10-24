import {BriefcaseBusiness, Pencil} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import DetailGrid from "../../../shared/components/DetailGrid";
import Modal from "../../../shared/components/Modal";

const EmployerDetailsModal = ({employer, onClose, onEdit}) => {
    // job_openings ang tunay na pangalan (galing sa jobOpenings relation)
    const jobs = employer.job_openings ?? [];

    return (
        <Modal
            size="xl"
            eyebrow="Employer Details"
            title={employer.name}
            subtitle={employer.country}
            onClose={onClose}
            footer={
                <Button type="button" variant="secondary" onClick={() => onEdit(employer)}>
                    <Pencil size={16} />
                    Edit Employer
                </Button>
            }
        >
            <div className="space-y-5 p-5 sm:p-6">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <Text weight="semibold" className="mb-3 text-gray-900">
                        Company Information
                    </Text>
                    <DetailGrid
                        items={[
                            ["Business Category", employer.business_category?.name],
                            ["License No.", employer.license_no],
                            ["Country", employer.country],
                            ["Address", employer.address],
                            ["Website", employer.website],
                        ]}
                    />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <Text weight="semibold" className="mb-3 text-gray-900">
                        Contact
                    </Text>
                    <DetailGrid
                        items={[
                            ["Contact Person", employer.contact_person],
                            ["Position", employer.contact_position],
                            ["Telephone", employer.contact_tel],
                            ["Email", employer.contact_email],
                        ]}
                    />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2">
                        <BriefcaseBusiness size={18} className="text-blue-900" />
                        <Text weight="semibold" className="text-gray-900">
                            Linked Job Openings ({employer.job_openings_count ?? jobs.length})
                        </Text>
                    </div>

                    <div className="space-y-2">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center justify-between gap-3 rounded-lg bg-gray-50 px-3 py-3"
                            >
                                <Text as="span" size="sm" weight="medium" className="text-gray-800">
                                    {job.title}
                                </Text>
                                <Text as="span" size="xs" className="text-gray-500">
                                    {job.country}
                                </Text>
                            </div>
                        ))}

                        {jobs.length === 0 && (
                            <Text size="sm" className="text-gray-500">
                                Not linked to any job opening yet.
                            </Text>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EmployerDetailsModal;
