const Textarea = ({label, error, id, className = "", textareaClassName = "", required = false, rows = 5, ...props}) => {
    const textareaId = id || props.name;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={textareaId} className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                rows={rows}
                required={required}
                className={`w-full resize-none rounded-lg border px-3 py-2.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                    error
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-[#062B4A] focus:ring-[#062B4A]/20"
                } ${textareaClassName}`}
                {...props}
            />

            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default Textarea;
