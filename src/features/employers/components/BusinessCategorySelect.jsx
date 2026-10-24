import {useMemo} from "react";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import useBusinessCategories from "../hooks/useBusinessCategories";

// value = category id (o "" / "All" kapag wala)
// onChange(value) -> id, hindi event
const BusinessCategorySelect = ({
    id,
    label,
    required = false,
    value = "",
    onChange,
    includeAll = false,
    allLabel = "All categories",
    placeholder = "Select a category",
    disabled = false,
}) => {
    const {categories = [], loading} = useBusinessCategories();

    const options = useMemo(
        () => categories.map((category) => ({value: category.id, label: category.name})),
        [categories]
    );

    return (
        <SearchableSelect
            id={id}
            label={label}
            required={required}
            value={includeAll ? value || "All" : value}
            onChange={(selected) => onChange(selected === "All" ? "" : selected)}
            options={options}
            loading={loading}
            loadingText="Loading categories..."
            allLabel={includeAll ? allLabel : undefined}
            placeholder={placeholder}
            searchPlaceholder="Search category..."
            emptyText="No categories found"
            disabled={disabled}
        />
    );
};

export default BusinessCategorySelect;
