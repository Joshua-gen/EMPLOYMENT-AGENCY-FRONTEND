import {Globe, LockKeyhole, Pencil} from "lucide-react";
import Card from "../../../components/ui/Card";
import Text from "../../../components/ui/Text";

const JobSummaryCards = ({summary}) => {
    const items = [
        {label: "Published Jobs", value: summary.published, icon: Globe, color: "bg-emerald-50 text-emerald-700"},
        {label: "Draft Jobs", value: summary.draft, icon: Pencil, color: "bg-amber-50 text-amber-700"},
        {label: "Closed Jobs", value: summary.closed, icon: LockKeyhole, color: "bg-slate-100 text-slate-600"},
    ];

    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {items.map(({label, value, icon: Icon, color}) => (
                <Card key={label}>
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <Text size="sm" className="text-gray-500">
                                {label}
                            </Text>
                            <Text size="2xl" weight="bold" className="mt-2 text-gray-900">
                                {value}
                            </Text>
                        </div>
                        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                            <Icon size={21} />
                        </div>
                    </div>
                </Card>
            ))}
        </section>
    );
};

export default JobSummaryCards;
