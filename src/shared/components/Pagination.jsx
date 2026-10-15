import {ChevronLeft, ChevronRight} from "lucide-react";
import Button from "../../components/ui/Button";
import Text from "../../components/ui/Text";

const Pagination = ({meta, perPage: selectedPerPage, onPageChange, onPerPageChange, perPageOptions = [5, 10, 20]}) => {
    if (!meta) return null;

    const {current_page: page, last_page: totalPages, per_page: serverPerPage, total, from, to} = meta;
    const perPage = selectedPerPage ?? serverPerPage;

    const pages = Array.from({length: totalPages}, (_, index) => index + 1)
    .filter((number) => number === 1 || number === totalPages || Math.abs(number - page) <= 1)
    .reduce((items, number, index, list) => {
        if (index > 0 && number - list[index - 1] > 1) items.push(`ellipsis-${number}`);
        items.push(number);
        return items;
    }, []);

    return (
        <div className="flex flex-col gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
                <Text as="span" size="sm" className="text-gray-500">
                    Showing{" "}
                    <Text as="span" size="sm" weight="semibold" className="text-gray-800">
                        {from ?? 0}–{to ?? 0}
                    </Text>{" "}
                    of{" "}
                    <Text as="span" size="sm" weight="semibold" className="text-gray-800">
                        {total}
                    </Text>
                </Text>

                <label className="flex items-center gap-2">
                    <Text as="span" size="sm" className="text-gray-500">
                        Rows:
                    </Text>
                    <select
                        value={perPage}
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                        className="rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-950"
                    >
                        {perPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft size={16} />
                    <span className="hidden sm:inline">Previous</span>
                </Button>

                {pages.map((number) =>
                    typeof number === "string" ? (
                        <Text as="span" size="sm" key={number} className="px-1 text-gray-400">
                            ...
                        </Text>
                    ) : (
                        <button
                            key={number}
                            type="button"
                            onClick={() => onPageChange(number)}
                            aria-current={page === number ? "page" : undefined}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium ${
                                page === number ? "bg-blue-950 text-white" : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {number}
                        </button>
                    )
                )}

                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    disabled={page === totalPages}
                    onClick={() => onPageChange(page + 1)}
                >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={16} />
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
