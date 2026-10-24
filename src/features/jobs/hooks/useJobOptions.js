import {useEffect, useState} from "react";
import parseError from "../../../shared/utils/parseError";
import {jobApi} from "../api/jobApi";

/** Listahan ng jobs para sa dropdown. status: "Published" | undefined (lahat) */
const useJobOptions = ({status} = {}) => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        jobApi
        .list({status, per_page: 100})
        .then((res) => !ignore && setJobs(res.data))
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, [status]);

    return {jobs, loading, error};
};

export default useJobOptions;
