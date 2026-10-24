import {Check, ClipboardList, Link2, Unlink, X} from "lucide-react";
import Button from "../../../components/ui/Button";
import Text from "../../../components/ui/Text";
import Modal from "../../../shared/components/Modal";
import {statusStyles} from "../utils";

const FIELDS = [
    {name: "business_name", label: "Business Name"},
    {name: "country", label: "Country", half: true},
    {name: "license_no", label: "License No.", half: true},
    {name: "business_category", label: "Nature of Business", getValue: (r) => r.business_category?.name},
    {name: "business_address", label: "Address"},
    {name: "contact_person", label: "Contact Person", half: true},
    {name: "contact_position", label: "Position", half: true},
    {name: "contact_tel", label: "Tel. No.", half: true},
    {name: "contact_email", label: "Email", half: true},
    {name: "website", label: "Website"},
    {name: "employer", label: "Employer Record", getValue: (r) => r.employer?.name ?? "Not linked yet"},
];

const PositionsSection = ({request, onLink, onUnlink}) => {
    const approved = request.status === "Approved";

    return (
        <section className="flex flex-col rounded-xl border border-gray-200 bg-white">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                    <ClipboardList size={20} />
                </div>

                <div>
                    <Text size="sm" weight="semibold" className="text-gray-900">
                        Job Positions ({request.positions?.length ?? 0})
                    </Text>
                    <Text size="xs" className="mt-0.5 text-gray-500">
                        {approved ? "Link each position to a job opening" : "Positions requested by the employer"}
                    </Text>
                </div>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
                {request.positions?.map((position) => (
                    <div key={position.id} className="rounded-lg bg-gray-50 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                                <Text size="sm" weight="semibold" className="break-words text-gray-900">
                                    {position.position}
                                </Text>
                                <Text size="xs" className="mt-0.5 text-gray-500">
                                    {position.number_required} worker{position.number_required === 1 ? "" : "s"} needed
                                </Text>
                            </div>

                            {approved &&
                                (position.job ? (
                                    <div className="flex items-center gap-2">
                                        <Text
                                            as="span"
                                            size="xs"
                                            weight="semibold"
                                            className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-800"
                                        >
                                            {position.job.title}
                                        </Text>
                                        <Button type="button" variant="secondary" onClick={() => onUnlink(position)}>
                                            <Unlink size={15} />
                                            Unlink
                                        </Button>
                                    </div>
                                ) : (
                                    <Button type="button" onClick={() => onLink(position)}>
                                        <Link2 size={15} />
                                        Link to Job
                                    </Button>
                                ))}
                        </div>

                        <Text size="sm" className="mt-2 whitespace-pre-line break-words leading-6 text-gray-700">
                            {position.description}
                        </Text>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ManpowerRequestDetailsModal = ({request, onClose, onApprove, onReject, onLink, onUnlink}) => (
    <Modal
        eyebrow="Manpower Request"
        title={request.business_name}
        subtitle={request.reference}
        size="xl"
        onClose={onClose}
        footer={
            <>
                <Button type="button" variant="secondary" onClick={onClose}>
                    Close
                </Button>

                {request.status === "Pending" && (
                    <>
                        <Button type="button" variant="secondary" onClick={() => onReject(request)}>
                            <X size={16} />
                            Reject
                        </Button>
                        <Button type="button" onClick={() => onApprove(request)}>
                            <Check size={16} />
                            Approve
                        </Button>
                    </>
                )}
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
                                    statusStyles[request.status] ?? "bg-gray-100 text-gray-600"
                                }`}
                            >
                                {request.status}
                            </Text>
                        </div>

                        {FIELDS.map(({name, label, half, getValue}) => {
                            const value = getValue ? getValue(request) : request[name];

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

                    {request.remarks && (
                        <section className="rounded-xl border border-gray-200 p-4 sm:p-5">
                            <Text size="xs" weight="medium" className="uppercase tracking-wide text-gray-400">
                                Review Remarks
                            </Text>
                            <Text size="sm" className="mt-2 whitespace-pre-line break-words leading-6 text-gray-700">
                                {request.remarks}
                            </Text>
                        </section>
                    )}
                </div>

                <div className="min-w-0">
                    <PositionsSection request={request} onLink={onLink} onUnlink={onUnlink} />
                </div>
            </div>
        </div>
    </Modal>
);

export default ManpowerRequestDetailsModal;
