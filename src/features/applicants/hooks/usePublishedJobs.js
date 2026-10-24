import {useEffect, useState} from "react";
import parseError from "../../../shared/utils/parseError";
import {jobApi} from "../../jobs/api/jobApi";

const usePublishedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        jobApi
        .list({status: "Published", per_page: 100})
        .then((res) => !ignore && setJobs(res.data))
        .catch((e) => !ignore && setError(parseError(e).message))
        .finally(() => !ignore && setLoading(false));

        return () => {
            ignore = true;
        };
    }, []);

    return {jobs, loading, error};
};

export default usePublishedJobs;
