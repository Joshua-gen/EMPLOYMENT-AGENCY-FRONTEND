import {useCallback, useEffect, useState} from "react";
import useDebounce from "../../../shared/hooks/useDebounce";
import {employerApi} from "../api/employerApi";

const getErrorMessage = (err, fallback) => {
    const data = err.response?.data;

    if (data?.errors) return Object.values(data.errors).flat()[0] ?? fallback;

    return data?.message ?? fallback;
};

const failure = (err, fallback) => ({
    ok: false,
    message: getErrorMessage(err, fallback),
    errors: err.response?.data?.errors ?? {},
});

// res = {status, data: [...] | {data: [...]}, meta?}
const toRows = (res) => (Array.isArray(res.data) ? res.data : res.data?.data ?? []);
const toMeta = (res) => res.meta ?? res.data?.meta ?? null;

const useEmployers = ({business_category_id = "", country = "", paginate = false} = {}) => {
    const [employers, setEmployers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshKey, setRefreshKey] = useState(0);

    // para sa management page lang (paginate: true)
    const [filters, setFilters] = useState({
        search: "",
        country: "All",
        categoryId: "",
        page: 1,
        perPage: 5,
    });

    const debouncedSearch = useDebounce(filters.search, 400);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);

        const params = paginate
            ? {
                  search: debouncedSearch || undefined,
                  country: filters.country !== "All" ? filters.country : undefined,
                  business_category_id: filters.categoryId || undefined,
                  page: filters.page,
                  per_page: filters.perPage,
              }
            : {
                  per_page: 100,
                  ...(business_category_id ? {business_category_id} : {}),
                  ...(country ? {country} : {}),
              };

        employerApi
        .list(params)
        .then((res) => {
            if (cancelled) return;

            const rows = toRows(res);

            // nabura ang huling item ng page -> bumalik sa naunang page
            if (paginate && rows.length === 0 && filters.page > 1) {
                setFilters((previous) => ({...previous, page: previous.page - 1}));
                return;
            }

            setEmployers(rows);
            setMeta(toMeta(res));
            setError("");
        })
        .catch((err) => {
            if (cancelled) return;
            setEmployers([]);
            setError(getErrorMessage(err, "Failed to load employers."));
        })
        .finally(() => {
            if (!cancelled) setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [
        paginate,
        business_category_id,
        country,
        debouncedSearch,
        filters.country,
        filters.categoryId,
        filters.page,
        filters.perPage,
        refreshKey,
    ]);

    // Filters (paginate mode)
    const update = (changes) => setFilters((previous) => ({...previous, ...changes, page: 1}));

    const setSearch = (search) => update({search});
    const setCountry = (value) => update({country: value});
    const setCategory = (categoryId) => update({categoryId});
    const setPage = (page) => setFilters((previous) => ({...previous, page}));
    const setPerPage = (perPage) => update({perPage});

    const refresh = () => setRefreshKey((key) => key + 1);

    // createEmployer(name, categoryId) -> legacy (Job form)
    // createEmployer({name, country, ...}) -> management form
    const createEmployer = useCallback(
        async (nameOrPayload, categoryId) => {
            const payload =
                typeof nameOrPayload === "object" && nameOrPayload !== null
                    ? nameOrPayload
                    : {
                          name: nameOrPayload,
                          ...(categoryId ? {business_category_id: Number(categoryId)} : {}),
                      };

            try {
                const res = await employerApi.create(payload);

                if (paginate) {
                    setFilters((previous) => ({...previous, page: 1}));
                    refresh();
                } else {
                    setEmployers((current) => [...current, res.data]);
                }

                return {ok: true, data: res.data};
            } catch (err) {
                return failure(err, "Failed to add employer.");
            }
        },
        [paginate]
    );

    const updateEmployer = useCallback(
        async (id, payload) => {
            try {
                const res = await employerApi.update(id, payload);

                if (paginate) refresh();
                else setEmployers((current) => current.map((e) => (e.id === id ? {...e, ...res.data} : e)));

                return {ok: true, data: res.data};
            } catch (err) {
                return failure(err, "Failed to update employer.");
            }
        },
        [paginate]
    );

    const removeEmployer = useCallback(
        async (id) => {
            try {
                await employerApi.remove(id);

                if (paginate) refresh();
                else setEmployers((current) => current.filter((e) => e.id !== id));

                return {ok: true};
            } catch (err) {
                return failure(err, "Failed to delete employer.");
            }
        },
        [paginate]
    );

    return {
        employers,
        meta,
        loading,
        error,
        filters,
        setSearch,
        setCountry,
        setCategory,
        setPage,
        setPerPage,
        createEmployer,
        updateEmployer,
        removeEmployer,
    };
};

export default useEmployers;
