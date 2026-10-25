import {Check, Loader2, Upload} from "lucide-react";
import Text from "../../components/ui/Text";

/**
 * <FileField label="Resume" name="resume" accept=".pdf,.doc,.docx" hint="PDF, DOC, or DOCX"
 *            file={form.resume} onChange={handleChange} error={errors.resume}
 *            uploading={"resume" in uploading} progress={uploading.resume} required />
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
    uploading = false,
    progress = 0,
}) => {
    const handleChange = (event) => {
        onChange(event);
        // para puwedeng i-reselect ang parehong file
        event.target.value = "";
    };

    return (
        <div>
            <Text as="span" size="sm" weight="semibold" className="mb-2 block text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </Text>

            <label
                className={`flex flex-col items-center rounded-xl border border-dashed bg-gray-50 px-5 text-center transition ${
                    uploading
                        ? "pointer-events-none cursor-wait border-[#062B4A] bg-[#062B4A]/5"
                        : "cursor-pointer hover:border-[#062B4A] hover:bg-[#062B4A]/5"
                } ${error && !uploading ? "border-red-400" : !uploading ? "border-gray-300" : ""} ${
                    compact ? "py-5" : "py-8"
                }`}
            >
                {uploading ? (
                    <>
                        <Loader2 size={compact ? 22 : 28} className="mb-2 animate-spin text-[#062B4A]" />

                        <Text as="span" size="sm" weight="semibold" className="text-[#062B4A]">
                            Uploading file... {progress}%
                        </Text>

                        <div className="mt-3 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-gray-200">
                            <div
                                className="h-full rounded-full bg-[#062B4A] transition-all duration-200"
                                style={{width: `${progress}%`}}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {file ? (
                            <Check size={compact ? 22 : 28} className="mb-2 text-green-600" />
                        ) : (
                            <Icon size={compact ? 22 : 28} className="mb-2 text-[#062B4A]" />
                        )}

                        <Text as="span" size="sm" weight="semibold" className="break-all text-gray-700">
                            {file?.name || `Choose ${label}`}
                        </Text>

                        {file ? (
                            <Text as="span" size="xs" className="mt-1 text-gray-500">
                                Click to replace
                            </Text>
                        ) : (
                            hint && (
                                <Text as="span" size="xs" className="mt-1 text-gray-500">
                                    {hint}
                                </Text>
                            )
                        )}
                    </>
                )}

                <input
                    type="file"
                    name={name}
                    accept={accept}
                    onChange={handleChange}
                    disabled={uploading}
                    className="hidden"
                />
            </label>

            {error && (
                <Text size="sm" className="mt-1 text-red-600">
                    {error}
                </Text>
            )}
        </div>
    );
};

export default FileField;
