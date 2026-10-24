import {useEffect, useState} from "react";
import {businessCategoryApi} from "../api/businessCategoryApi";

const useBusinessCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        businessCategoryApi
        .list()
        .then((res) => {
            if (!active) return;
            setCategories(Array.isArray(res) ? res : res.data ?? []);
        })
        .catch((err) => {
            if (!active) return;
            setCategories([]);
            setError(err.response?.data?.message ?? "Failed to load categories.");
        })
        .finally(() => active && setLoading(false));

        return () => {
            active = false;
        };
    }, []);

    return {categories, loading, error};
};

export default useBusinessCategories;
