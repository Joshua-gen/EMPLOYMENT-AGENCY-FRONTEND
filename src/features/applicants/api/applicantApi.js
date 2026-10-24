import api from "../../../lib/axios";

const BASE = "/api/management/applicants";

export const applicantApi = {
    list: (params) => api.get(BASE, {params}).then((res) => res.data),
    summary: () => api.get(`${BASE}/summary`).then((res) => res.data),
    get: (id) => api.get(`${BASE}/${id}`).then((res) => res.data),
    create: (formData) =>
        api.post(BASE, formData, {headers: {"Content-Type": "multipart/form-data"}}).then((res) => res.data),
    update: (id, payload) => api.put(`${BASE}/${id}`, payload).then((res) => res.data),
    updateStatus: (id, status) => api.patch(`${BASE}/${id}`, {status}).then((res) => res.data),
    assignJob: (id, jobId) => api.patch(`${BASE}/${id}/assign-job`, {job_opening_id: jobId}).then((res) => res.data),
    assignEmployer: (id, employerId) =>
        api.patch(`${BASE}/${id}/assign-employer`, {employer_id: employerId}).then((res) => res.data),
};
