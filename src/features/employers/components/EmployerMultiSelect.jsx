import {useEffect, useMemo, useState} from "react";
import MultiSelect from "../../../shared/components/MultiSelect";
import useToast from "../../../shared/hooks/useToast";
import useBusinessCategories from "../hooks/useBusinessCategories";
import useEmployers from "../hooks/useEmployers";
import BusinessCategorySelect from "./BusinessCategorySelect";

const buildLabel = (employer, categoryNames, fallbackCategoryId) => {
    const categoryName =
        employer.business_category?.name ?? categoryNames[employer.business_category_id ?? fallbackCategoryId];

    return categoryName ? `${employer.name} · ${categoryName}` : employer.name;
};

const EmployerMultiSelect = ({label = "Employers", id, country = "", ...props}) => {
    const toast = useToast();
    const [categoryId, setCategoryId] = useState("");
    const [known, setKnown] = useState({});

    const {categories} = useBusinessCategories();
    const {employers, loading, error, createEmployer} = useEmployers({
        business_category_id: categoryId,
        country,
    });

    const hasCountry = Boolean(country);

    const categoryNames = useMemo(
        () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
        [categories]
    );

    useEffect(() => {
        if (!employers.length) return;

        setKnown((current) => {
            const next = {...current};
            employers.forEach((employer) => {
                next[employer.id] = buildLabel(employer, categoryNames);
            });
            return next;
        });
    }, [employers, categoryNames]);

    const options = useMemo(() => {
        if (!hasCountry) return [];

        const visible = employers.map((employer) => ({
            value: employer.id,
            label: buildLabel(employer, categoryNames),
        }));

        const selectedHidden = (props.value ?? [])
        .filter((value) => !employers.some((employer) => employer.id === value) && known[value])
        .map((value) => ({value, label: known[value]}));

        return [...selectedHidden, ...visible];
    }, [hasCountry, employers, known, categoryNames, props.value]);

    const handleCreate = async (name) => {
        const result = await createEmployer(name, categoryId);

        if (!result.ok) {
            toast.error(result.message, {title: "Could not add employer"});
            return null;
        }

        toast.success(`"${result.data.name}" added to employers.`);
        return {value: result.data.id, label: buildLabel(result.data, categoryNames, categoryId)};
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5">
            {!hasCountry && (
                <p className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
                    <span aria-hidden="true">ⓘ</span>
                    Select a country first to see the employers.
                </p>
            )}

            <fieldset disabled={!hasCountry} className={`min-w-0 ${hasCountry ? "" : "opacity-60"}`}>
                <div className="mb-3 flex items-center gap-2.5">
                    <label
                        htmlFor={`${id}-category`}
                        className="shrink-0 text-xs font-medium uppercase tracking-wide text-gray-500"
                    >
                        Category
                    </label>

                    <BusinessCategorySelect
                        id={`${id}-category`}
                        className="max-w-[220px]"
                        selectClassName="py-1.5 text-sm"
                        value={categoryId}
                        onChange={setCategoryId}
                        includeAll
                        disabled={!hasCountry}
                    />
                </div>

                <MultiSelect
                    {...props}
                    id={id}
                    label={label}
                    options={options}
                    loading={hasCountry && loading}
                    error={props.error || error}
                    onCreate={handleCreate}
                    placeholder={hasCountry ? "Select or add employers" : "Select a country first"}
                    searchPlaceholder="Search or type a new employer..."
                    loadingText="Loading employers..."
                    emptyText="No employers found for this country. Type a name to add one."
                />
            </fieldset>
        </div>
    );
};

export default EmployerMultiSelect;
