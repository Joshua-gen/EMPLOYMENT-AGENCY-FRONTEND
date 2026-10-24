import Text from "../../components/ui/Text";

/** items: [[label, value], ...] */
const DetailGrid = ({items, columns = 2}) => (
    <div className={`grid gap-4 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
        {items.map(([label, value]) => (
            <div key={label}>
                <Text size="xs" weight="medium" className="uppercase tracking-wide text-gray-500">
                    {label}
                </Text>
                <Text size="sm" weight="medium" className="mt-1 whitespace-pre-line break-words text-gray-900">
                    {value || "—"}
                </Text>
            </div>
        ))}
    </div>
);

export default DetailGrid;
