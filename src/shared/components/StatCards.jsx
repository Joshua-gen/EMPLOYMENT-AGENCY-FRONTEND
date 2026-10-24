import StatCard from "./StatCard";

const COLUMNS = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * items: [{ label, value, icon, tone }]
 * columns: 2 | 3 | 4
 */
const StatCards = ({items, columns = 3}) => (
    <section className={`grid grid-cols-1 gap-4 ${COLUMNS[columns] || COLUMNS[3]}`}>
        {items.map((item) => (
            <StatCard key={item.label} {...item} />
        ))}
    </section>
);

export default StatCards;
