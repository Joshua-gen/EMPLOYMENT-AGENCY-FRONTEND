import {useCallback, useEffect, useState} from "react";
import {manpowerRequestApi, normalizePaginated, toResult} from "../api/manpowerRequestApi";

const DEFAULT_FILTERS = {search: "", status: "All", country: "All", page: 1, perPage: 10};

const useManpowerRequests = () => {
    const [requests, setRequests] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [query, setQuery] = useState("");

    // debounce ng search
    useEffect(() => {
        const timer = setTimeout(() => setQuery(filters.search), 300);
        return () => clearTimeout(timer);
    }, [filters.search]);

    const fetchList = useCallback(async () => {
        setLoading(true);

        const result = await toResult(() =>
            manpowerRequestApi.list({
                search: query,
                status: filters.status,
                country: filters.country,
                page: filters.page,
                per_page: filters.perPage,
            })
        );

        if (result.ok) {
            const {items, meta: nextMeta} = normalizePaginated(result.raw);
            setRequests(items);
            setMeta(nextMeta);
            setError("");
        } else {
            setError(result.message);
        }

        setLoading(false);
    }, [query, filters.status, filters.country, filters.page, filters.perPage]);

    const fetchSummary = useCallback(async () => {
        const result = await toResult(() => manpowerRequestApi.summary());
        if (result.ok) setSummary(result.data);
    }, []);

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    useEffect(() => {
        fetchSummary();
    }, [fetchSummary]);

    const update = (patch) => setFilters((current) => ({...current, ...patch}));

    const mutate = async (call) => {
        const result = await toResult(call);

        if (result.ok) {
            fetchList();
            fetchSummary();
        }

        return result;
    };

    return {
        requests,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch: (search) => update({search, page: 1}),
        setStatus: (status) => update({status, page: 1}),
        setCountry: (country) => update({country: country || "All", page: 1}),
        setPage: (page) => update({page}),
        setPerPage: (perPage) => update({perPage, page: 1}),
        fetchOne: (id) => toResult(() => manpowerRequestApi.get(id)),
        approve: (id, payload) => mutate(() => manpowerRequestApi.approve(id, payload)),
        reject: (id, remarks) => mutate(() => manpowerRequestApi.reject(id, remarks)),
        linkJob: (id, positionId, jobId) => mutate(() => manpowerRequestApi.linkJob(id, positionId, jobId)),
        unlinkJob: (id, positionId) => mutate(() => manpowerRequestApi.unlinkJob(id, positionId)),
    };
};

export default useManpowerRequests;
