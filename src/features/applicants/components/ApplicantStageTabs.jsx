import Text from "../../../components/ui/Text";

const ApplicantStageTabs = ({stages, active, counts, onChange}) => (
    <div className="flex gap-2 overflow-x-auto pb-2">
        {stages.map(({label, value, icon: Icon}) => {
            const isActive = active === value;

            return (
                <button
                    type="button"
                    key={value}
                    onClick={() => onChange(value)}
                    className={`min-w-[125px] flex-1 rounded-xl border p-3 text-left transition ${
                        isActive
                            ? "border-blue-950 bg-blue-950 text-white shadow-sm"
                            : "border-gray-200 bg-white text-gray-700 hover:border-blue-200 hover:bg-gray-50"
                    }`}
                >
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <Icon size={17} className={isActive ? "text-blue-100" : "text-blue-900"} />
                        <Text as="span" size="lg" weight="bold" className={isActive ? "text-white" : "text-gray-900"}>
                            {counts[value] ?? 0}
                        </Text>
                    </div>
                    <Text as="span" size="xs" weight="semibold" className="block whitespace-nowrap">
                        {label}
                    </Text>
                </button>
            );
        })}
    </div>
);

export default ApplicantStageTabs;
