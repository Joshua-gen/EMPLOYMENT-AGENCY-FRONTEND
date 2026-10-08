const variants = {
    primary: "bg-[#062B4A] text-white hover:bg-[#0A416D] focus:ring-[#062B4A]",
    secondary:
        "border border-[#062B4A] bg-white text-[#062B4A] hover:bg-[#062B4A] hover:text-white focus:ring-[#062B4A]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-[#062B4A] hover:bg-[#062B4A]/10 focus:ring-[#062B4A]",
};

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
};

const Button = ({
    children,
    type = "button",
    variant = "primary",
    size = "md",
    className = "",
    disabled = false,
    loading = false,
    ...props
}) => {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                variants[variant] || variants.primary
            } ${sizes[size] || sizes.md} ${className}`}
            {...props}
        >
            {loading && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}

            {children}
        </button>
    );
};

export default Button;
