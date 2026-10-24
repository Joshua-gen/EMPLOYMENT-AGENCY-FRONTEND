import {Inbox} from "lucide-react";
import Text from "../../components/ui/Text";

const LINE_CLAMP = {1: "line-clamp-1", 2: "line-clamp-2", 3: "line-clamp-3"};

/**
 * Isang cell. Kapag may maxWidth, hindi na lalampas ang cell sa lapad na yun:
 * magwa-wrap hanggang `lines` na linya, tapos "..." na. Ang buong text ay lalabas sa hover (title).
 */
const renderCell = (col, row) => {
    const content = col.render ? (
        col.render(row)
    ) : (
        <Text as="span" size="sm">
            {row[col.key] ?? "—"}
        </Text>
    );

    if (!col.maxWidth) return content;

    const title = col.title ? col.title(row) : typeof row[col.key] === "string" ? row[col.key] : undefined;

    return (
        <div
            title={title}
            style={{maxWidth: col.maxWidth}}
            className={`${LINE_CLAMP[col.lines] ?? LINE_CLAMP[2]} break-words`}
        >
            {content}
        </div>
    );
};

/**
 * columns: [{ key, header, render?, className?, nowrap?, maxWidth?, lines?, title? }]
 *   maxWidth: pinakamalapad na lapad ng cell, sa px (hal. 180)
 *   lines:    ilang linya bago putulin (1 hanggang 3, default 2)
 *   title:    (row) => string para sa hover text kapag may render ka
 * rows: array ng objects
 */
const DataTable = ({
    columns,
    rows,
    loading = false,
    rowKey = "id",
    minWidth = 900,
    emptyIcon: EmptyIcon = Inbox,
    emptyTitle = "No records found",
    emptyDescription = "Try changing your search or filters.",
}) => (
    <div className="overflow-x-auto">
        <table style={{minWidth}} className={`w-full text-left text-sm ${loading ? "opacity-60" : ""}`}>
            <thead className="bg-gray-50">
                <tr className="border-b border-gray-100">
                    {columns.map((col) => (
                        <th key={col.key} className="px-5 py-4">
                            <Text
                                as="span"
                                size="xs"
                                weight="semibold"
                                className="uppercase tracking-wide text-gray-500"
                            >
                                {col.header}
                            </Text>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                    <tr key={row[rowKey]} className="hover:bg-gray-50">
                        {columns.map((col) => (
                            <td
                                key={col.key}
                                className={`px-5 py-4 text-slate-700 ${
                                    col.nowrap && !col.maxWidth ? "whitespace-nowrap" : ""
                                } ${col.className ?? ""}`}
                            >
                                {renderCell(col, row)}
                            </td>
                        ))}
                    </tr>
                ))}

                {rows.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="px-5 py-14 text-center">
                            <EmptyIcon className="mx-auto text-gray-300" size={32} />
                            <Text weight="semibold" className="mt-3 text-gray-800">
                                {loading ? "Loading..." : emptyTitle}
                            </Text>
                            {!loading && (
                                <Text size="sm" className="mt-1 text-gray-500">
                                    {emptyDescription}
                                </Text>
                            )}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default DataTable;
