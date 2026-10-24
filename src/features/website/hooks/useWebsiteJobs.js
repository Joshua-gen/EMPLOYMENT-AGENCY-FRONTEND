import {useEffect, useState} from "react";
import useDebounce from "../../../shared/hooks/useDebounce";
import parseError from "../../../shared/utils/parseError";
import {websiteApi} from "../api/websiteApi";

const PER_PAGE = 5;
const INITIAL_FILTERS = {search: "", country: "All", page: 1};

const useWebsiteJobs = () => {
    const [filters, setFilters] = useState(INITIAL_FILTERS);
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const debouncedSearch = useDebounce(filters.search, 400);

    useEffect(() => {
        let ignore = false;
        setLoading(true);

        websiteApi
        .jobs({
            search: debouncedSearch || undefined,
            country: filters.country !== "All" ? filters.country : undefined,
            page: filters.page,
            per_page: PER_PAGE,
        })
        .then((res) => {
            if (ignore) return;

            setJobs(res.data);
            setMeta(res.meta);
            setCountries(res.countries ?? []);
            setError("");
        })
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, [debouncedSearch, filters.country, filters.page]);

    const setSearch = (search) => setFilters((previous) => ({...previous, search, page: 1}));
    const setCountry = (country) => setFilters((previous) => ({...previous, country, page: 1}));
    const setPage = (page) => setFilters((previous) => ({...previous, page}));
    const clearFilters = () => setFilters(INITIAL_FILTERS);

    return {jobs, meta, countries, loading, error, filters, setSearch, setCountry, setPage, clearFilters};
};

export default useWebsiteJobs;
