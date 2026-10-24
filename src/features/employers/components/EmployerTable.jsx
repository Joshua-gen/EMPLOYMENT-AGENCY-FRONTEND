import {Building2, Eye, Pencil, Trash2} from "lucide-react";
import Text from "../../../components/ui/Text";
import DataTable from "../../../shared/components/DataTable";
import RowActions from "../../../shared/components/RowActions";

const EmployerTable = ({employers, loading, onView, onEdit, onDelete}) => {
    const columns = [
        {
            key: "name",
            header: "Employer",
            className: "w-[260px] min-w-[260px] max-w-[260px]",
            render: (employer) => (
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-950 text-white">
                        <Building2 size={18} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <Text
                            size="sm"
                            weight="semibold"
                            className="block truncate text-gray-900"
                            title={employer.name}
                        >
                            {employer.name}
                        </Text>

                        <Text
                            size="xs"
                            className="mt-1 block truncate text-gray-500"
                            title={employer.contact_person ?? ""}
                        >
                            {employer.contact_person || "No contact person"}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            key: "category",
            header: "Category",
            className: "w-[180px] min-w-[180px] max-w-[180px]",
            render: (employer) => (
                <Text
                    as="span"
                    size="sm"
                    className="block truncate text-gray-700"
                    title={employer.business_category?.name ?? "—"}
                >
                    {employer.business_category?.name ?? "—"}
                </Text>
            ),
        },
        {
            key: "country",
            header: "Country",
            className: "w-[140px] min-w-[140px] max-w-[140px]",
            nowrap: true,
            render: (employer) => (
                <Text as="span" size="sm" className="block truncate" title={employer.country ?? "—"}>
                    {employer.country ?? "—"}
                </Text>
            ),
        },
        {
            key: "contact",
            header: "Contact",
            className: "w-[230px] min-w-[230px] max-w-[230px]",
            render: (employer) => (
                <div className="min-w-0">
                    <Text size="sm" className="block truncate text-gray-800" title={employer.contact_email ?? "—"}>
                        {employer.contact_email ?? "—"}
                    </Text>

                    {employer.contact_tel && (
                        <Text size="xs" className="mt-1 block truncate text-gray-500" title={employer.contact_tel}>
                            {employer.contact_tel}
                        </Text>
                    )}
                </div>
            ),
        },
        {
            key: "jobs",
            header: "Job Openings",
            className: "w-[130px] min-w-[130px] max-w-[130px]",
            nowrap: true,
            render: (employer) => (
                <Text
                    as="span"
                    size="xs"
                    weight="semibold"
                    className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-blue-900"
                >
                    {employer.job_openings_count ?? 0}
                </Text>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            className: "w-[90px] min-w-[90px] max-w-[90px]",
            render: (employer) => (
                <RowActions
                    label={`Actions for ${employer.name}`}
                    items={[
                        {
                            label: "View Details",
                            icon: Eye,
                            onClick: () => onView(employer),
                        },
                        {
                            label: "Edit Employer",
                            icon: Pencil,
                            onClick: () => onEdit(employer),
                        },
                        {
                            label: "Delete",
                            icon: Trash2,
                            tone: "danger",
                            onClick: () => onDelete(employer),
                        },
                    ]}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={employers}
            loading={loading}
            minWidth={950}
            emptyIcon={Building2}
            emptyTitle="No employers found"
            emptyDescription="Try another search term, category, or country filter."
        />
    );
};

export default EmployerTable;
