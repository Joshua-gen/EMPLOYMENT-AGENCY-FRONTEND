import {Globe, LockKeyhole, Pencil} from "lucide-react";
import StatCards from "../../../shared/components/StatCards";

const JobSummaryCards = ({summary}) => (
    <StatCards
        items={[
            {label: "Published Jobs", value: summary.published, icon: Globe, tone: "green"},
            {label: "Draft Jobs", value: summary.draft, icon: Pencil, tone: "amber"},
            {label: "Closed Jobs", value: summary.closed, icon: LockKeyhole, tone: "slate"},
        ]}
    />
);

export default JobSummaryCards;
