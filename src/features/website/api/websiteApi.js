import api from "../../../lib/axios";

const BASE = "/api/website";

export const websiteApi = {
    jobs: (params) => api.get(`${BASE}/jobs`, {params}).then((res) => res.data),

    job: (id) => api.get(`${BASE}/jobs/${id}`).then((res) => res.data),

    apply: (formData) =>
        api
        .post(`${BASE}/applications`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then((res) => res.data),

    deploymentMap: () => api.get(`${BASE}/deployment-map`).then((res) => res.data),
};
