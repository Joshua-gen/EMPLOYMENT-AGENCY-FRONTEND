import {Inbox} from "lucide-react";

/**
 * columns: [{ key, header, render?: (row) => node, className?, nowrap? }]
 * rows:    array ng objects
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
            <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                    {columns.map((col) => (
                        <th
                            key={col.key}
                            className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
                {rows.map((row) => (
                    <tr key={row[rowKey]} className="hover:bg-slate-50">
                        {columns.map((col) => (
                            <td
                                key={col.key}
                                className={`px-5 py-4 text-slate-700 ${col.nowrap ? "whitespace-nowrap" : ""} ${
                                    col.className ?? ""
                                }`}
                            >
                                {col.render ? col.render(row) : row[col.key] ?? "—"}
                            </td>
                        ))}
                    </tr>
                ))}

                {rows.length === 0 && (
                    <tr>
                        <td colSpan={columns.length} className="px-5 py-14 text-center">
                            <EmptyIcon className="mx-auto text-slate-300" size={32} />
                            <p className="mt-3 font-semibold text-slate-800">{loading ? "Loading..." : emptyTitle}</p>
                            {!loading && <p className="mt-1 text-sm text-slate-500">{emptyDescription}</p>}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default DataTable;
