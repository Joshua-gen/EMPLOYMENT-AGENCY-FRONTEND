import Card from "../../components/ui/Card";
import Text from "../../components/ui/Text";

const TONES = {
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-950",
    red: "bg-red-50 text-red-600",
};

/**
 * <StatCard label="Published Jobs" value={3} icon={Globe} tone="green" />
 */
const StatCard = ({label, value, icon: Icon, tone = "slate", className = ""}) => (
    <Card className={className}>
        <div className="flex items-center justify-between gap-3">
            <div>
                <Text size="sm" className="text-gray-500">
                    {label}
                </Text>
                <Text size="2xl" weight="bold" className="mt-2 text-gray-900">
                    {value ?? 0}
                </Text>
            </div>

            {Icon && (
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${TONES[tone] || TONES.slate}`}>
                    <Icon size={21} />
                </div>
            )}
        </div>
    </Card>
);

export default StatCard;
