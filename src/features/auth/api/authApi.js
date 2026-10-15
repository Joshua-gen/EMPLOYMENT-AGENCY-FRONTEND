import api from "../../../lib/axios";

export const getCsrfCookie = () => api.get("/sanctum/csrf-cookie");

export const loginRequest = (credentials) => api.post("/login", credentials);

export const getAuthenticatedUser = () => api.get("/api/user");

export const logoutRequest = () => api.post("/logout");
