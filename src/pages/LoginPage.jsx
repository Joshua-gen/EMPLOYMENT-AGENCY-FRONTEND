import {useNavigate} from "react-router-dom";
import LoginForm from "../features/auth/components/LoginForm";
import useAuth from "../features/auth/hooks/useAuth";

export default function LoginPage() {
    const navigate = useNavigate();
    const {login, loading, error} = useAuth();

    const handleLogin = async (credentials) => {
        try {
            await login(credentials);

            navigate("/dashboard", {replace: true});
        } catch {
            // Error is handled by useAuth.
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#C5D7E6]/30 px-4 py-10">
            <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg sm:p-10">
                <header className="mb-8 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#062B4A] text-xl font-bold text-white">
                        OFW
                    </div>

                    <h1 className="text-2xl font-bold text-[#062B4A]">Admin Login</h1>

                    <p className="mt-2 text-sm text-gray-500">Sign in to manage recruitment operations.</p>
                </header>

                <LoginForm onSubmit={handleLogin} loading={loading} error={error} />

                <p className="mt-8 text-center text-xs text-gray-400">OFW Agency Recruitment System</p>
            </section>
        </main>
    );
}
