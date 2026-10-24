import {useEffect, useMemo, useRef, useState} from "react";
import {Check, ChevronDown, Plus, Search, X} from "lucide-react";
import Text from "../../components/ui/Text";

/**
 * Searchable multi-select na may "Add new" (kapag may onCreate).
 *
 * options: [{ value, label }]
 * value: array ng values
 * onChange(values)
 * onCreate(name) -> Promise<{ value, label } | null>
 *
 * Keyboard: ↑ ↓ lumipat, Enter pumili/magdagdag, Backspace tanggalin ang huli, Esc isara.
 */
const MultiSelect = ({
    id,
    label,
    value = [],
    onChange,
    options = [],
    onCreate,
    required = false,
    disabled = false,
    loading = false,
    error = "",
    placeholder = "Select options",
    searchPlaceholder = "Search...",
    loadingText = "Loading...",
    emptyText = "No results found",
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);
    const [creating, setCreating] = useState(false);

    const rootRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const trimmed = query.trim();
    const q = trimmed.toLowerCase();

    const items = useMemo(() => {
        const matches = options
        .filter((option) => !q || option.label.toLowerCase().includes(q))
        .map((option) => ({type: "option", ...option}));

        const canCreate = onCreate && trimmed && !options.some((option) => option.label.toLowerCase() === q);

        return canCreate ? [...matches, {type: "create", value: "__create__", label: trimmed}] : matches;
    }, [options, q, trimmed, onCreate]);

    const selected = value.map((v) => options.find((option) => option.value === v)).filter(Boolean);

    const close = () => {
        setOpen(false);
        setQuery("");
    };

    const toggle = (optionValue) =>
        onChange(value.includes(optionValue) ? value.filter((v) => v !== optionValue) : [...value, optionValue]);

    const create = async () => {
        if (creating) return;

        setCreating(true);
        const created = await onCreate(trimmed);
        setCreating(false);

        if (created) {
            onChange([...value, created.value]);
            setQuery("");
            inputRef.current?.focus();
        }
    };

    const activate = (item) => (item.type === "create" ? create() : toggle(item.value));

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    useEffect(() => {
        setActiveIndex(0);
    }, [query]);

    // isara kapag nag-click sa labas
    useEffect(() => {
        if (!open) return;

        const handleClick = (event) => {
            if (!rootRef.current?.contains(event.target)) close();
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    // sundan ng scroll ang aktibong item
    useEffect(() => {
        if (open) listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({block: "nearest"});
    }, [activeIndex, open]);

    const handleTriggerKeyDown = (event) => {
        if (!open && ["ArrowDown", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            setOpen(true);
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, items.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault(); // para hindi ma-submit ang form
            if (items[activeIndex]) activate(items[activeIndex]);
        } else if (event.key === "Backspace" && !query && value.length) {
            onChange(value.slice(0, -1));
        } else if (event.key === "Escape") {
            event.preventDefault();
            close();
        } else if (event.key === "Tab") {
            close();
        }
    };

    return (
        <div>
            {label && (
                <Text as="label" htmlFor={id} size="sm" weight="semibold" className="mb-1.5 block text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </Text>
            )}

            <div ref={rootRef} className="relative">
                <div
                    id={id}
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    tabIndex={disabled ? -1 : 0}
                    onClick={() => !disabled && !loading && setOpen((previous) => !previous)}
                    onKeyDown={handleTriggerKeyDown}
                    className={`flex min-h-[44px] w-full cursor-pointer items-center justify-between gap-2 rounded-lg border bg-white px-3 py-2 outline-none focus:ring-2 ${
                        error
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#062B4A] focus:ring-[#062B4A]/20"
                    } ${disabled ? "cursor-not-allowed bg-gray-50" : ""}`}
                >
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
                        {loading ? (
                            <Text as="span" size="sm" className="text-gray-400">
                                {loadingText}
                            </Text>
                        ) : selected.length === 0 ? (
                            <Text as="span" size="sm" className="text-gray-400">
                                {placeholder}
                            </Text>
                        ) : (
                            selected.map((option) => (
                                <span
                                    key={option.value}
                                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 py-1 pl-2.5 pr-1.5 text-blue-950"
                                >
                                    <Text as="span" size="xs" weight="semibold">
                                        {option.label}
                                    </Text>
                                    <button
                                        type="button"
                                        aria-label={`Remove ${option.label}`}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            toggle(option.value);
                                        }}
                                        className="rounded-full p-0.5 hover:bg-blue-100"
                                    >
                                        <X size={12} />
                                    </button>
                                </span>
                            ))
                        )}
                    </div>

                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </div>

                {/* para gumana ang browser "required" validation */}
                {required && (
                    <input
                        tabIndex={-1}
                        aria-hidden="true"
                        required
                        value={value.length ? "ok" : ""}
                        onChange={() => {}}
                        className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                    />
                )}

                {open && (
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                        <div className="relative border-b border-gray-100 p-2">
                            <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                placeholder={searchPlaceholder}
                                autoComplete="off"
                                className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10"
                            />
                        </div>

                        <ul
                            ref={listRef}
                            role="listbox"
                            aria-multiselectable="true"
                            className="max-h-60 overflow-y-auto p-1"
                        >
                            {items.map((item, index) => {
                                const isSelected = item.type === "option" && value.includes(item.value);

                                return (
                                    <li
                                        key={`${item.type}-${item.value}`}
                                        role="option"
                                        aria-selected={isSelected}
                                        data-index={index}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => activate(item)}
                                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${
                                            index === activeIndex ? "bg-gray-100" : ""
                                        } ${item.type === "create" ? "text-blue-950" : "text-gray-700"}`}
                                    >
                                        {item.type === "create" ? (
                                            <span className="flex items-center gap-2">
                                                <Plus size={15} />
                                                <Text as="span" size="sm" weight="semibold">
                                                    {creating ? "Adding..." : `Add "${item.label}"`}
                                                </Text>
                                            </span>
                                        ) : (
                                            <>
                                                <Text
                                                    as="span"
                                                    size="sm"
                                                    weight={isSelected ? "semibold" : "normal"}
                                                    className="truncate"
                                                >
                                                    {item.label}
                                                </Text>
                                                {isSelected && <Check size={15} className="shrink-0 text-blue-950" />}
                                            </>
                                        )}
                                    </li>
                                );
                            })}

                            {items.length === 0 && (
                                <li className="px-3 py-6 text-center">
                                    <Text size="sm" className="text-gray-500">
                                        {emptyText}
                                    </Text>
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {error && (
                <Text size="sm" className="mt-1 text-red-600">
                    {error}
                </Text>
            )}
        </div>
    );
};

export default MultiSelect;
