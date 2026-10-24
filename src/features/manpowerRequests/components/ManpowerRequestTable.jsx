import {Check, Eye, FileText, X} from "lucide-react";
import Text from "../../../components/ui/Text";
import DataTable from "../../../shared/components/DataTable";
import RowActions from "../../../shared/components/RowActions";
import {formatDate, statusStyles} from "../utils";

const ManpowerRequestTable = ({requests, loading, onView, onApprove, onReject}) => {
    const columns = [
        {
            key: "reference",
            header: "Reference",
            nowrap: true,
            render: (request) => (
                <div>
                    <Text size="sm" weight="semibold" className="text-gray-900">
                        {request.reference ?? `#${request.id}`}
                    </Text>
                    <Text size="xs" className="mt-0.5 text-gray-500">
                        {formatDate(request.requested_at)}
                    </Text>
                </div>
            ),
        },
        {
            key: "business_name",
            header: "Business",
            render: (request) => (
                <div className="max-w-[260px]">
                    <Text
                        size="sm"
                        weight="semibold"
                        title={request.business_name}
                        className="line-clamp-2 break-words text-gray-900"
                    >
                        {request.business_name}
                    </Text>
                    <Text size="xs" className="mt-0.5 line-clamp-1 text-gray-500">
                        {request.contact_person}
                        {request.business_category?.name ? ` · ${request.business_category.name}` : ""}
                    </Text>
                </div>
            ),
        },
        {key: "country", header: "Country", nowrap: true},
        {
            key: "positions",
            header: "Positions",
            render: (request) => (
                <div>
                    <Text size="sm" className="text-gray-800">
                        {request.positions_count} position{request.positions_count === 1 ? "" : "s"} ·{" "}
                        {request.total_required ?? 0} worker{Number(request.total_required) === 1 ? "" : "s"}
                    </Text>
                    {request.status === "Approved" && request.unlinked_positions_count > 0 && (
                        <Text size="xs" weight="medium" className="mt-0.5 text-amber-700">
                            {request.unlinked_positions_count} needs job
                        </Text>
                    )}
                </div>
            ),
        },
        {
            key: "employer",
            header: "Employer",
            maxWidth: 180,
            lines: 1,
            render: (request) => (
                <Text as="span" size="sm">
                    {request.employer?.name ?? "—"}
                </Text>
            ),
        },
        {
            key: "status",
            header: "Status",
            nowrap: true,
            render: (request) => (
                <Text
                    as="span"
                    size="xs"
                    weight="semibold"
                    className={`rounded-full px-2.5 py-1 ${statusStyles[request.status]}`}
                >
                    {request.status}
                </Text>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (request) => (
                <RowActions
                    label={`Actions for ${request.business_name}`}
                    items={[
                        {label: "View Details", icon: Eye, onClick: () => onView(request)},
                        {
                            label: "Approve Request",
                            icon: Check,
                            tone: "success",
                            hidden: request.status !== "Pending",
                            onClick: () => onApprove(request),
                        },
                        {
                            label: "Reject Request",
                            icon: X,
                            tone: "danger",
                            hidden: request.status !== "Pending",
                            onClick: () => onReject(request),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={requests}
            loading={loading}
            emptyIcon={FileText}
            emptyTitle="No manpower requests found"
        />
    );
};

export default ManpowerRequestTable;
