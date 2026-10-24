import {BriefcaseBusiness, Eye, Globe, LockKeyhole, MapPin, Pencil, Trash2} from "lucide-react";
import Text from "../../../components/ui/Text";
import DataTable from "../../../shared/components/DataTable";
import RowActions from "../../../shared/components/RowActions";
import {formatDate, statusStyles} from "../utils";

const JobTable = ({jobs, loading, onView, onEdit, onStatus, onDelete}) => {
    const columns = [
        {
            key: "title",
            header: "Job Opening",
            render: (job) => (
                <div className="flex max-w-[260px] items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-950">
                        <BriefcaseBusiness size={19} />
                    </div>
                    <div className="min-w-0">
                        <Text
                            size="sm"
                            weight="semibold"
                            title={job.title}
                            className="line-clamp-2 break-words text-gray-900"
                        >
                            {job.title}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            key: "country",
            header: "Country",
            nowrap: true,
            render: (job) => (
                <span className="inline-flex items-center gap-2">
                    <MapPin size={15} className="text-gray-400" />
                    <Text as="span" size="sm">
                        {job.country}
                    </Text>
                </span>
            ),
        },
        {key: "vacancies", header: "Vacancies", maxWidth: 90, lines: 1},
        {key: "salary", header: "Salary Range", maxWidth: 170, lines: 2},
        {
            key: "deadline",
            header: "Deadline",
            nowrap: true,
            render: (job) => (
                <Text as="span" size="sm">
                    {formatDate(job.deadline)}
                </Text>
            ),
        },
        {
            key: "applicants_count",
            header: "Applicants",
            render: (job) => (
                <Text as="span" size="sm">
                    {job.applicants_count ?? "—"}
                </Text>
            ),
        },
        {
            key: "status",
            header: "Status",
            nowrap: true,
            render: (job) => (
                <Text
                    as="span"
                    size="xs"
                    weight="semibold"
                    className={`rounded-full px-2.5 py-1 ${statusStyles[job.status]}`}
                >
                    {job.status}
                </Text>
            ),
        },
        {
            key: "actions",
            header: "Actions",
            render: (job) => (
                <RowActions
                    label={`Actions for ${job.title}`}
                    items={[
                        {label: "View Details", icon: Eye, onClick: () => onView(job)},
                        {label: "Edit Job", icon: Pencil, onClick: () => onEdit(job)},
                        {
                            label: "Publish Job",
                            icon: Globe,
                            tone: "success",
                            hidden: job.status === "Published",
                            onClick: () => onStatus(job, "Published"),
                        },
                        {
                            label: "Close Job",
                            icon: LockKeyhole,
                            tone: "danger",
                            hidden: job.status === "Closed",
                            onClick: () => onStatus(job, "Closed"),
                        },
                        {label: "Delete Job", icon: Trash2, tone: "danger", onClick: () => onDelete(job)},
                    ]}
                />
            ),
        },
    ];

    return (
        <DataTable
            columns={columns}
            rows={jobs}
            loading={loading}
            emptyIcon={BriefcaseBusiness}
            emptyTitle="No job openings found"
        />
    );
};

export default JobTable;
