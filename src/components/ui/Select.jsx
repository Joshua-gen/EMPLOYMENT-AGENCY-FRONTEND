import {useId} from "react";
import {ChevronDown} from "lucide-react";

const Select = ({
    label,
    error,
    id,
    options = [],
    placeholder,
    className = "",
    selectClassName = "",
    required = false,
    disabled = false,
    ...props
}) => {
    const generatedId = useId();
    const selectId = id || props.name || generatedId;
    const errorId = `${selectId}-error`;

    const isEmpty = props.value === "" || props.value === undefined || props.value === null;

    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={selectId} className="mb-1.5 block text-sm font-semibold text-gray-700">
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    required={required}
                    disabled={disabled}
                    aria-invalid={error ? "true" : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`w-full appearance-none rounded-lg border bg-white py-2.5 pl-3 pr-10 outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${
                        isEmpty && placeholder ? "text-gray-400" : "text-gray-900"
                    } ${
                        error
                            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-[#062B4A] focus:ring-[#062B4A]/20"
                    } ${selectClassName}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled={required}>
                            {placeholder}
                        </option>
                    )}

                    {options.map((option) => (
                        <option key={option.value} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <ChevronDown
                    size={18}
                    className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${
                        disabled ? "text-gray-300" : "text-gray-400"
                    }`}
                />
            </div>

            {error && (
                <p id={errorId} className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Select;
