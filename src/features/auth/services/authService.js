import {getCsrfCookie, loginRequest, getAuthenticatedUser, logoutRequest} from "../api/authApi";

const authService = {
    async login(credentials) {
        await getCsrfCookie();

        const {data} = await loginRequest(credentials);

        return data.user;
    },

    async getUser() {
        const {data} = await getAuthenticatedUser();

        return data.user;
    },

    async logout() {
        await getCsrfCookie();
        await logoutRequest();
    },
};

export default authService;
