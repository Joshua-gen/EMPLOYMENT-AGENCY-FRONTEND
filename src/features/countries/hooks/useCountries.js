import {useEffect, useState} from "react";
import parseError from "../../../shared/utils/parseError";
import {countryApi} from "../api/countryApi";

// Naka-cache sa module: isang fetch lang kahit ilang CountrySelect ang nasa screen.
let cache = null;
let pending = null;

const useCountries = () => {
    const [countries, setCountries] = useState(cache ?? []);
    const [loading, setLoading] = useState(!cache);
    const [error, setError] = useState("");

    useEffect(() => {
        if (cache) return;

        let ignore = false;

        pending ??= countryApi
        .list()
        .then((res) => {
            cache = res.data;
            return cache;
        })
        .finally(() => {
            pending = null;
        });

        pending
        .then((data) => {
            if (ignore) return;
            setCountries(data);
            setLoading(false);
        })
        .catch((e) => {
            if (ignore) return;
            setError(parseError(e).message);
            setLoading(false);
        });

        return () => {
            ignore = true;
        };
    }, []);

    return {countries, loading, error};
};

export default useCountries;
