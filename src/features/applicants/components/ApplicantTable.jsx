import {BriefcaseBusiness, Building2, Eye, Pencil, Users, XCircle} from "lucide-react";
import Text from "../../../components/ui/Text";
import DataTable from "../../../shared/components/DataTable";
import RowActions from "../../../shared/components/RowActions";
import {formatDate} from "../../../shared/utils/formatDate";
import {getInitials, sourceStyles, statusStyles} from "../utils";

const WalkInBadge = () => (
    <Text
        as="span"
        size="xs"
        weight="semibold"
        className="mt-1 block w-fit rounded-full bg-gray-100 px-2 py-0.5 text-gray-700"
    >
        Walk-in
    </Text>
);

const ApplicantTable = ({applicants, loading, onView, onEdit, onAssign, onAssignEmployer, onReject}) => {
    const columns = [
        {
            key: "name",
            header: "Applicant",
            className: "w-[220px] min-w-[220px] max-w-[220px]",
            render: (applicant) => (
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-sm font-bold text-white">
                        {getInitials(applicant.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <Text
                            size="sm"
                            weight="semibold"
                            className="block truncate text-gray-900"
                            title={applicant.name}
                        >
                            {applicant.name}
                        </Text>

                        <Text size="xs" className="mt-1 block truncate text-gray-500" title={applicant.reference}>
                            {applicant.reference}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            key: "applied_for",
            header: "Applied For",
            className: "w-[200px] min-w-[200px] max-w-[200px]",
            render: (applicant) => (
                <div className="min-w-0">
                    {applicant.job ? (
                        <>
                            <Text
                                size="sm"
                                weight="medium"
                                className="block truncate text-gray-800"
                                title={applicant.job.title}
                            >
                                {applicant.job.title}
                            </Text>
                        </>
                    ) : (
                        <Text
                            as="span"
                            size="xs"
                            weight="semibold"
                            className="block w-fit rounded-full bg-amber-50 px-2 py-0.5 text-amber-800"
                        >
                            Not assigned yet
                        </Text>
                    )}

                    {applicant.channel === "walk_in" && <WalkInBadge />}
                </div>
            ),
        },
        {
            key: "employer",
            header: "Employer",
            className: "w-[170px] min-w-[170px] max-w-[170px]",
            render: (applicant) =>
                applicant.employer ? (
                    <Text
                        as="span"
                        size="sm"
                        weight="medium"
                        className="block truncate text-gray-800"
                        title={applicant.employer.name}
                    >
                        {applicant.employer.name}
                    </Text>
                ) : applicant.job ? (
                    <Text
                        as="span"
                        size="xs"
                        weight="semibold"
                        className="block w-fit rounded-full bg-amber-50 px-2 py-0.5 text-amber-800"
                    >
                        Not assigned yet
                    </Text>
                ) : (
                    <Text as="span" size="sm" className="text-gray-400">
                        —
                    </Text>
                ),
        },
        {
            key: "country",
            header: "Country",
            className: "w-[115px] min-w-[115px] max-w-[115px]",
            nowrap: true,
            render: (applicant) => (
                <Text as="span" size="sm" className="block truncate" title={applicant.job?.country ?? "—"}>
                    {applicant.job?.country ?? "—"}
                </Text>
            ),
        },
        {
            key: "applied_at",
            header: "Date Applied",
            className: "w-[130px] min-w-[130px] max-w-[130px]",
            nowrap: true,
            render: (applicant) => (
                <Text as="span" size="sm" className="whitespace-nowrap">
                    {formatDate(applicant.applied_at)}
                </Text>
            ),
        },
        {
            key: "status",
            header: "Status",
            className: "w-[125px] min-w-[125px] max-w-[125px]",
            nowrap: true,
            render: (applicant) => (
                <Text
                    as="span"
                    size="xs"
                    weight="semibold"
                    className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 ${
                        statusStyles[applicant.status]
                    }`}
                >
                    {applicant.status}
                </Text>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "w-[90px] min-w-[90px] max-w-[90px]",
            render: (applicant) => (
                <RowActions
                    label={`Actions for ${applicant.name}`}
                    items={[
                        {
                            label: "View Details",
                            icon: Eye,
                            onClick: () => onView(applicant),
                        },
                        {
                            label: "Update Status",
                            icon: Pencil,
                            onClick: () => onEdit(applicant),
                        },
                        {
                            label: applicant.job ? "Change Job" : "Assign to Job",
                            icon: BriefcaseBusiness,
                            onClick: () => onAssign(applicant),
                        },
                        {
                            label: applicant.employer ? "Change Employer" : "Assign Employer",
                            icon: Building2,
                            hidden: !applicant.job,
                            onClick: () => onAssignEmployer(applicant),
                        },
                        {
                            label: "Reject",
                            icon: XCircle,
                            tone: "danger",
                            hidden: ["Rejected", "Deployed"].includes(applicant.status),
                            onClick: () => onReject(applicant),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={applicants}
            loading={loading}
            minWidth={1050}
            emptyIcon={Users}
            emptyTitle="No applicants found"
            emptyDescription="Try another search term, stage, or filter."
        />
    );
};

export default ApplicantTable;
