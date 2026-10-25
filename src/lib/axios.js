import axios from "axios";

const api = axios.create({
    baseURL: "/backend",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
    },
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const {config, response} = error;

        console.error("API ERROR:", config?.method, config?.baseURL, config?.url, response?.status, response?.data);

        if (response?.status === 419 && config && !config._retried) {
            config._retried = true;
            await api.get("/sanctum/csrf-cookie");
            return api(config);
        }

        return Promise.reject(error);
    }
);

export default api;
