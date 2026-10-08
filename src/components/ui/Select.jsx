const Select = ({
    label,
    error,
    id,
    options = [],
    placeholder = "Select an option",
    className = "",
    selectClassName = "",
    required = false,
    ...props
}) => {
    const selectId = id || props.name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <select
                id={selectId}
                required={required}
                className={`w-full rounded-lg border px-3 py-2.5 text-gray-900 outline-none transition focus:ring-2 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#062B4A] focus:ring-[#062B4A]/20"
                } ${selectClassName}`}
                {...props}
            >
                <option value="">{placeholder}</option>

                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Select;
