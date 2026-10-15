import {useState, useEffect, useCallback} from "react";
import authService from "../services/authService";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const checkAuth = useCallback(async () => {
        setLoading(true);

        try {
            const authenticatedUser = await authService.getUser();
            setUser(authenticatedUser);
            return authenticatedUser;
        } catch {
            setUser(null);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials) => {
        setLoading(true);
        setError("");

        try {
            const authenticatedUser = await authService.login(credentials);
            setUser(authenticatedUser);
            return authenticatedUser;
        } catch (error) {
            const message =
                error.response?.data?.errors?.email?.[0] ||
                error.response?.data?.message ||
                "Unable to connect to the server.";

            setError(message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } finally {
            setUser(null);
        }
    };

    return {
        user,
        loading,
        error,
        login,
        logout,
        checkAuth,
        setError,
    };
}
