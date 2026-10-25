import react from "@vitejs/plugin-react";
import {defineConfig} from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
        exclude: ["maplibre-gl"],
    },
    server: {
        proxy: {
            // "/sanctum": "http://localhost:8000",
            // "/login": "http://localhost:8000",
            // "/logout": "http://localhost:8000",
            // "/api": "http://localhost:8000",
            "/backend": {
                target: "https://employment-agency-backend.onrender.com",
                changeOrigin: true,
                secure: true,
                cookieDomainRewrite: "localhost",
                rewrite: (path) => path.replace(/^\/backend/, ""),
            },
        },
    },
});
