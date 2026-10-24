import api from "../../../lib/axios";

const BASE = "/api/management/manpower-requests";
const WEBSITE_BASE = "/api/website";

export const manpowerRequestApi = {
    // params: {search, status, country, page, per_page}
    list: (params) => api.get(BASE, {params}).then((res) => res.data),
    summary: () => api.get(`${BASE}/summary`).then((res) => res.data),
    get: (id) => api.get(`${BASE}/${id}`).then((res) => res.data),
    approve: (id, payload) => api.patch(`${BASE}/${id}/approve`, payload).then((res) => res.data),
    reject: (id, remarks) => api.patch(`${BASE}/${id}/reject`, {remarks}).then((res) => res.data),
    linkJob: (id, positionId, jobId) =>
        api.patch(`${BASE}/${id}/positions/${positionId}/link-job`, {job_opening_id: jobId}).then((res) => res.data),
    unlinkJob: (id, positionId) => api.delete(`${BASE}/${id}/positions/${positionId}/link-job`).then((res) => res.data),
};

// Public (walang login)
export const websiteManpowerRequestApi = {
    submit: (payload) => api.post(`${WEBSITE_BASE}/manpower-requests`, payload).then((res) => res.data),
};

// Laging {ok, data, message, errors, raw}, hindi nagta-throw.
// Ang api methods ay nagbabalik na ng envelope {status, message, data}; ang error ay galing sa err.response.data.
export const toResult = async (call) => {
    try {
        const body = await call();

        return {ok: body?.status !== false, data: body?.data, message: body?.message, errors: {}, raw: body};
    } catch (err) {
        const body = err?.response?.data ?? {};

        return {
            ok: false,
            data: null,
            message: body.message ?? err?.message ?? "Something went wrong. Please try again.",
            errors: body.errors ?? {},
            raw: body,
        };
    }
};

// Sumasalo sa {data: [...], meta} at sa Laravel paginator {data: {data: [...], ...}}
export const normalizePaginated = (body) => {
    const payload = body?.data;

    if (Array.isArray(payload)) {
        return {items: payload, meta: body.meta ?? body.pagination ?? null};
    }

    if (payload && Array.isArray(payload.data)) {
        const {data, ...meta} = payload;
        return {items: data, meta: body.meta ?? meta};
    }

    return {items: [], meta: null};
};
