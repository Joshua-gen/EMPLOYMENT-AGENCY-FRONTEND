import api from "../../../lib/axios";

const BASE = "/api/management/employers";

export const employerApi = {
    // params: {search, country, business_category_id, page, per_page}
    list: (params) => api.get(BASE, {params}).then((res) => res.data),
    get: (id) => api.get(`${BASE}/${id}`).then((res) => res.data),
    create: (payload) => api.post(BASE, payload).then((res) => res.data),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload).then((res) => res.data),
    remove: (id) => api.delete(`${BASE}/${id}`).then((res) => res.data),
};
