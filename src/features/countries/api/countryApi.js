import api from "../../../lib/axios";

const BASE = "/api/sysdef/countries";

export const countryApi = {
    // walang per_page -> lahat; may per_page -> paginated
    list: (params) => api.get(BASE, {params}).then((res) => res.data),
    get: (id) => api.get(`${BASE}/${id}`).then((res) => res.data),
    create: (payload) => api.post(BASE, payload).then((res) => res.data),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload).then((res) => res.data),
    remove: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data),
};
