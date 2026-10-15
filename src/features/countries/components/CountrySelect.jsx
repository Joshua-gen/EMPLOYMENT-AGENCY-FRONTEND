import {useMemo} from "react";
import SearchableSelect from "../../../shared/components/SearchableSelect";
import useCountries from "../hooks/useCountries";

/**
 * <CountrySelect label="Country" value={form.country} onChange={(v) => setForm({...form, country: v})} required />
 * <CountrySelect includeAll value={filter} onChange={setFilter} />   // para sa filter
 */
const CountrySelect = ({
    includeAll = false,
    allLabel = "All Countries",
    placeholder = "Select country",
    searchPlaceholder = "Search country or code...",
    ...props
}) => {
    const {countries, loading, error} = useCountries();

    const options = useMemo(
        () => countries.map((country) => ({value: country.name, label: country.name, hint: country.code})),
        [countries]
    );

    return (
        <SearchableSelect
            {...props}
            options={options}
            loading={loading}
            error={error || props.error}
            allLabel={includeAll ? allLabel : undefined}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            loadingText="Loading countries..."
            emptyText="No countries found"
        />
    );
};

export default CountrySelect;
