import api from "../../../lib/axios";

const BASE = "/api/management/jobs";

export const jobApi = {
    list: (params) => api.get(BASE, {params}).then((res) => res.data),
    summary: () => api.get(`${BASE}/summary`).then((res) => res.data),
    get: (id) => api.get(`${BASE}/${id}`).then((res) => res.data),
    create: (payload) => api.post(BASE, payload).then((res) => res.data),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload).then((res) => res.data),
    updateStatus: (id, status) => api.patch(`${BASE}/${id}`, {status}).then((res) => res.data),
    remove: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data),
};
