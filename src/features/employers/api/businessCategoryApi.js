import api from "../../../lib/axios";

export const businessCategoryApi = {
    list: () => api.get("/api/management/business-categories").then((res) => res.data),
};
