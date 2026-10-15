import {useState} from "react";
import {Eye, EyeOff, LockKeyhole, Mail} from "lucide-react";

export default function LoginForm({onSubmit, loading, error}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            email: email.trim(),
            password,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                    Email Address
                </label>

                <div className="relative">
                    <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        id="email"
                        type="email"
                        autoComplete="username"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-[#062B4A] focus:ring-2 focus:ring-[#062B4A]/10"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                    Password
                </label>

                <div className="relative">
                    <LockKeyhole size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 outline-none focus:border-[#062B4A] focus:ring-2 focus:ring-[#062B4A]/10"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#062B4A] px-4 py-3 font-semibold text-white transition hover:bg-[#0A3D65] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Signing in..." : "Sign In"}
            </button>
        </form>
    );
}
