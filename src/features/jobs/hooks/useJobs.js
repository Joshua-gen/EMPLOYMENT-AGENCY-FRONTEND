import {useEffect, useState} from "react";
import useDebounce from "../../../shared/hooks/useDebounce";
import parseError from "../../../shared/utils/parseError";
import {jobApi} from "../api/jobApi";

const useJobs = () => {
    const [filters, setFilters] = useState({search: "", status: "All", page: 1, perPage: 5});
    const [jobs, setJobs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState({published: 0, draft: 0, closed: 0});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const debouncedSearch = useDebounce(filters.search, 400);

    // List + pagination
    useEffect(() => {
        let ignore = false;
        setLoading(true);

        jobApi
        .list({
            search: debouncedSearch,
            status: filters.status,
            page: filters.page,
            per_page: filters.perPage,
        })
        .then((res) => {
            if (ignore) return;

            // nabura ang huling item ng page -> bumalik sa naunang page
            if (res.data.length === 0 && filters.page > 1) {
                setFilters((previous) => ({...previous, page: previous.page - 1}));
                return;
            }

            setJobs(res.data);
            setMeta(res.meta);
            setError("");
        })
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, [debouncedSearch, filters.status, filters.page, filters.perPage, refreshKey]);

    // Summary cards
    useEffect(() => {
        jobApi
        .summary()
        .then((res) => setSummary(res.data))
        .catch(() => {});
    }, [refreshKey]);

    // Filters
    const setSearch = (search) => setFilters((previous) => ({...previous, search, page: 1}));
    const setStatus = (status) => setFilters((previous) => ({...previous, status, page: 1}));
    const setPage = (page) => setFilters((previous) => ({...previous, page}));
    const setPerPage = (perPage) => setFilters((previous) => ({...previous, perPage, page: 1}));

    // Actions: laging nagbabalik ng { ok: true } o { ok: false, message, errors }
    const run = async (request, afterSuccess) => {
        try {
            await request();
            afterSuccess?.();
            setRefreshKey((key) => key + 1);
            return {ok: true};
        } catch (e) {
            return {ok: false, ...parseError(e)};
        }
    };

    const createJob = (payload) =>
        run(
            () => jobApi.create(payload),
            () => setPage(1)
        );
    const updateJob = (id, payload) => run(() => jobApi.update(id, payload));
    const changeStatus = (id, status) => run(() => jobApi.updateStatus(id, status));
    const deleteJob = (id) => run(() => jobApi.remove(id));

    return {
        jobs,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStatus,
        setPage,
        setPerPage,
        createJob,
        updateJob,
        changeStatus,
        deleteJob,
    };
};

export default useJobs;
