import {useEffect, useMemo, useRef, useState} from "react";
import {Check, ChevronDown, Search} from "lucide-react";
import Text from "../../components/ui/Text";

const triggerClass =
    "flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3.5 py-2.5 text-left text-sm outline-none focus:border-blue-950 focus:ring-2 focus:ring-blue-950/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

/**
 * Reusable searchable select.
 *
 * options: [{ value, label, hint? }]   (hint = maliit na text sa kanan, hal. country code)
 * onChange(value) -> value ang natatanggap, hindi event.
 *
 * <SearchableSelect label="Country" options={options} value={v} onChange={setV} required />
 * <SearchableSelect allLabel="All Countries" ... />   // may "All" option sa taas (value: "All")
 *
 * Keyboard: ↑ ↓ lumipat, Enter pumili, Esc isara.
 */
const SearchableSelect = ({
    id,
    label,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    loading = false,
    error = "",
    allLabel,
    placeholder = "Select an option",
    searchPlaceholder = "Search...",
    loadingText = "Loading...",
    emptyText = "No results found",
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(0);

    const rootRef = useRef(null);
    const triggerRef = useRef(null);
    const inputRef = useRef(null);
    const listRef = useRef(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        const matches = options
        .filter((option) => !q || option.label.toLowerCase().includes(q) || option.hint?.toLowerCase().startsWith(q))
        .sort((a, b) => {
            if (!q) return 0;
            // unahin ang nagsisimula sa tinype
            return (a.label.toLowerCase().startsWith(q) ? 0 : 1) - (b.label.toLowerCase().startsWith(q) ? 0 : 1);
        });

        const extras = [];

        if (allLabel && (!q || allLabel.toLowerCase().includes(q))) {
            extras.push({value: "All", label: allLabel});
        }

        // lumang value na wala sa listahan -> ipakita pa rin para hindi mawala sa edit
        if (
            value &&
            value !== "All" &&
            !options.some((option) => option.value === value) &&
            (!q || String(value).toLowerCase().includes(q))
        ) {
            extras.push({value, label: String(value)});
        }

        return [...extras, ...matches];
    }, [options, query, allLabel, value]);

    const selectedLabel =
        allLabel && value === "All" ? allLabel : options.find((option) => option.value === value)?.label ?? value;

    const close = () => {
        setOpen(false);
        setQuery("");
    };

    const select = (option) => {
        onChange(option.value);
        close();
        triggerRef.current?.focus();
    };

    // pagbukas: focus sa search at ituro ang napili
    useEffect(() => {
        if (!open) return;

        inputRef.current?.focus();
        const index = filtered.findIndex((option) => option.value === value);
        setActiveIndex(index >= 0 ? index : 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // balik sa unang resulta kapag nagbago ang search
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
        if (!open) return;

        listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({block: "nearest"});
    }, [activeIndex, open]);

    const handleTriggerKeyDown = (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (!disabled && !loading) setOpen(true);
        }
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
        } else if (event.key === "Enter") {
            event.preventDefault(); // para hindi ma-submit ang form
            if (filtered[activeIndex]) select(filtered[activeIndex]);
        } else if (event.key === "Escape") {
            event.preventDefault();
            close();
            triggerRef.current?.focus();
        } else if (event.key === "Tab") {
            close();
        }
    };

    return (
        <div>
            {label && (
                <Text as="label" htmlFor={id} size="sm" weight="medium" className="mb-1.5 block text-gray-700">
                    {label}
                    {required ? " *" : ""}
                </Text>
            )}

            <div ref={rootRef} className="relative">
                <button
                    ref={triggerRef}
                    id={id}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    disabled={disabled || loading}
                    onClick={() => setOpen((previous) => !previous)}
                    onKeyDown={handleTriggerKeyDown}
                    className={`${triggerClass} ${error ? "border-red-400" : "border-gray-200"}`}
                >
                    <span className={`truncate ${selectedLabel ? "text-gray-900" : "text-gray-400"}`}>
                        {loading ? loadingText : selectedLabel || placeholder}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                </button>

                {/* para gumana ang browser "required" validation */}
                {required && (
                    <input
                        tabIndex={-1}
                        aria-hidden="true"
                        required
                        value={value ?? ""}
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

                        <ul ref={listRef} role="listbox" className="max-h-60 overflow-y-auto p-1">
                            {filtered.map((option, index) => {
                                const selected = option.value === value;

                                return (
                                    <li
                                        key={`${option.value}-${index}`}
                                        role="option"
                                        aria-selected={selected}
                                        data-index={index}
                                        onMouseEnter={() => setActiveIndex(index)}
                                        onClick={() => select(option)}
                                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 ${
                                            index === activeIndex ? "bg-gray-100" : ""
                                        } ${selected ? "text-blue-950" : "text-gray-700"}`}
                                    >
                                        <Text
                                            as="span"
                                            size="sm"
                                            weight={selected ? "semibold" : "normal"}
                                            className="truncate"
                                        >
                                            {option.label}
                                        </Text>
                                        <span className="flex shrink-0 items-center gap-2">
                                            {option.hint && (
                                                <Text as="span" size="xs" className="text-gray-400">
                                                    {option.hint}
                                                </Text>
                                            )}
                                            {selected && <Check size={15} />}
                                        </span>
                                    </li>
                                );
                            })}

                            {filtered.length === 0 && (
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
                <Text size="xs" className="mt-1 text-red-600">
                    {error}
                </Text>
            )}
        </div>
    );
};

export default SearchableSelect;
