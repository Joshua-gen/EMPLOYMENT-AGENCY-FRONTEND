import {useEffect, useState} from "react";
import parseError from "../../../shared/utils/parseError";
import {websiteApi} from "../api/websiteApi";

const useWebsiteJob = (id) => {
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;
        setLoading(true);
        setError("");

        websiteApi
        .job(id)
        .then((res) => !ignore && setJob(res.data))
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, [id]);

    return {job, loading, error};
};

export default useWebsiteJob;
