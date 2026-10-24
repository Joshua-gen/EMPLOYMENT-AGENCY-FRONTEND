import {useEffect, useState} from "react";
import useDebounce from "../../../shared/hooks/useDebounce";
import parseError from "../../../shared/utils/parseError";
import {applicantApi} from "../api/applicantApi";

const useApplicants = () => {
    const [filters, setFilters] = useState({
        search: "",
        stage: "All",
        view: "All", // All | job | direct | walk_in | unassigned
        jobId: "All",
        country: "All",
        page: 1,
        perPage: 5,
    });
    const [applicants, setApplicants] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    const debouncedSearch = useDebounce(filters.search, 400);

    // List + pagination
    useEffect(() => {
        let ignore = false;
        setLoading(true);

        applicantApi
        .list({
            search: debouncedSearch || undefined,
            status: filters.stage !== "All" ? filters.stage : undefined,
            source: ["job", "direct"].includes(filters.view) ? filters.view : undefined,
            channel: filters.view === "walk_in" ? "walk_in" : undefined,
            unassigned: filters.view === "unassigned" ? 1 : undefined,
            job_id: filters.jobId !== "All" ? filters.jobId : undefined,
            country: filters.country !== "All" ? filters.country : undefined,
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

            setApplicants(res.data);
            setMeta(res.meta);
            setError("");
        })
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, [
        debouncedSearch,
        filters.stage,
        filters.view,
        filters.jobId,
        filters.country,
        filters.page,
        filters.perPage,
        refreshKey,
    ]);

    // Stage counts + summary cards
    useEffect(() => {
        applicantApi
        .summary()
        .then((res) => setSummary(res.data))
        .catch(() => {});
    }, [refreshKey]);

    // Filters
    const update = (changes) => setFilters((previous) => ({...previous, ...changes, page: 1}));

    const setSearch = (search) => update({search});
    const setStage = (stage) => update({stage});
    const setView = (view) => update({view});
    const setJob = (jobId) => update({jobId});
    const setCountry = (country) => update({country});
    const setPage = (page) => setFilters((previous) => ({...previous, page}));
    const setPerPage = (perPage) => update({perPage});

    // Actions: { ok: true, data } o { ok: false, message, errors }
    const run = async (request, afterSuccess) => {
        try {
            const res = await request();
            afterSuccess?.();
            setRefreshKey((key) => key + 1);
            return {ok: true, data: res?.data};
        } catch (e) {
            return {ok: false, ...parseError(e)};
        }
    };

    const createApplicant = (formData) =>
        run(
            () => applicantApi.create(formData),
            () => setPage(1)
        );
    const updateApplicant = (id, payload) => run(() => applicantApi.update(id, payload));
    const changeStatus = (id, status) => run(() => applicantApi.updateStatus(id, status));
    const assignJob = (id, jobId) => run(() => applicantApi.assignJob(id, jobId));
    const assignEmployer = (id, employerId) => run(() => applicantApi.assignEmployer(id, employerId));

    return {
        applicants,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStage,
        setView,
        setJob,
        setCountry,
        setPage,
        setPerPage,
        createApplicant,
        updateApplicant,
        changeStatus,
        assignJob,
        assignEmployer,
    };
};

export default useApplicants;
