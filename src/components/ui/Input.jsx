const Input = ({label, error, id, type = "text", className = "", inputClassName = "", required = false, ...props}) => {
    const inputId = id || props.name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {label}

                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <input
                id={inputId}
                type={type}
                required={required}
                className={`w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#062B4A] focus:ring-[#062B4A]/20"
                } ${inputClassName}`}
                {...props}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Input;
