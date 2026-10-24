import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {CircleCheck, CircleX, Info, TriangleAlert, X} from "lucide-react";
import Text from "../../../components/ui/Text";
import ToastContext from "./ToastContext";

const VARIANTS = {
    success: {icon: CircleCheck, box: "border-emerald-200 bg-emerald-50", iconClass: "text-emerald-600"},
    error: {icon: CircleX, box: "border-red-200 bg-red-50", iconClass: "text-red-600"},
    warning: {icon: TriangleAlert, box: "border-amber-200 bg-amber-50", iconClass: "text-amber-600"},
    info: {icon: Info, box: "border-blue-200 bg-blue-50", iconClass: "text-blue-600"},
};

const MAX_TOASTS = 4;

const ToastItem = ({toast, onDismiss}) => {
    const {id, type, title, message, duration} = toast;
    const {icon: Icon, box, iconClass} = VARIANTS[type];

    // auto-dismiss
    useEffect(() => {
        if (!duration) return;

        const timer = setTimeout(() => onDismiss(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, onDismiss]);

    return (
        <div
            role={type === "error" ? "alert" : "status"}
            style={{animation: "toast-in 0.2s ease-out"}}
            className={`pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg ${box}`}
        >
            <Icon size={20} className={`mt-0.5 shrink-0 ${iconClass}`} />

            <div className="min-w-0 flex-1">
                {title && (
                    <Text size="sm" weight="semibold" className="text-gray-900">
                        {title}
                    </Text>
                )}
                <Text size="sm" className={`break-words text-gray-700 ${title ? "mt-0.5" : ""}`}>
                    {message}
                </Text>
            </div>

            <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => onDismiss(id)}
                className="shrink-0 rounded-md p-1 text-gray-400 hover:bg-black/5 hover:text-gray-600"
            >
                <X size={16} />
            </button>
        </div>
    );
};

/**
 * Ilagay sa pinakataas ng app (main.jsx):  <ToastProvider><App /></ToastProvider>
 */
const ToastProvider = ({children}) => {
    const [toasts, setToasts] = useState([]);
    const counter = useRef(0);

    const dismiss = useCallback((id) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const show = useCallback((type, message, options = {}) => {
        const id = ++counter.current;
        const toast = {id, type, message, title: options.title, duration: options.duration ?? 4000};

        setToasts((current) => [...current, toast].slice(-MAX_TOASTS));
        return id;
    }, []);

    const api = useMemo(
        () => ({
            success: (message, options) => show("success", message, options),
            error: (message, options) => show("error", message, {duration: 6000, ...options}),
            warning: (message, options) => show("warning", message, options),
            info: (message, options) => show("info", message, options),
            dismiss,
        }),
        [show, dismiss]
    );

    return (
        <ToastContext.Provider value={api}>
            {children}

            <style>{`@keyframes toast-in { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }`}</style>

            <div className="pointer-events-none fixed inset-x-4 top-4 z-[100] ml-auto flex max-w-sm flex-col gap-3">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
