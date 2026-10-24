import {Upload} from "lucide-react";
import Text from "../../components/ui/Text";

/**
 * <FileField label="Resume" name="resume" accept=".pdf,.doc,.docx" hint="PDF, DOC, or DOCX"
 *            file={form.resume} onChange={handleChange} error={errors.resume} required />
 * Ang onChange ay tumatanggap ng event (event.target.files[0]).
 */
const FileField = ({
    label,
    name,
    accept,
    hint,
    file,
    onChange,
    error,
    required = false,
    icon: Icon = Upload,
    compact = false,
}) => (
    <div>
        <Text as="span" size="sm" weight="semibold" className="mb-2 block text-gray-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
        </Text>

        <label
            className={`flex cursor-pointer flex-col items-center rounded-xl border border-dashed bg-gray-50 px-5 text-center transition hover:border-[#062B4A] hover:bg-[#062B4A]/5 ${
                error ? "border-red-400" : "border-gray-300"
            } ${compact ? "py-5" : "py-8"}`}
        >
            <Icon size={compact ? 22 : 28} className="mb-2 text-[#062B4A]" />

            <Text as="span" size="sm" weight="semibold" className="break-all text-gray-700">
                {file?.name || `Choose ${label}`}
            </Text>

            {hint && (
                <Text as="span" size="xs" className="mt-1 text-gray-500">
                    {hint}
                </Text>
            )}

            <input type="file" name={name} accept={accept} onChange={onChange} className="hidden" />
        </label>

        {error && (
            <Text size="sm" className="mt-1 text-red-600">
                {error}
            </Text>
        )}
    </div>
);

export default FileField;
