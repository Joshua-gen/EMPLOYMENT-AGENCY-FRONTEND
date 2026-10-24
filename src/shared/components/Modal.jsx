import {useEffect} from "react";
import {X} from "lucide-react";
import Button from "../../components/ui/Button";
import Heading from "../../components/ui/Heading";

const SIZES = {md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-5xl", xxl: "max-w-7xl"};

const Modal = ({title, subtitle, eyebrow, onClose, footer, size = "md", as: Wrapper = "div", children, ...rest}) => {
    useEffect(() => {
        const onKeyDown = (event) => event.key === "Escape" && onClose();
        document.addEventListener("keydown", onKeyDown);

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <Wrapper
                role="dialog"
                aria-modal="true"
                className={`my-auto w-full ${SIZES[size]} rounded-2xl bg-white shadow-xl`}
                {...rest}
            >
                <div className="flex items-start justify-between border-b border-gray-100 p-5 sm:p-6">
                    <div>
                        {eyebrow && <p className="text-sm text-gray-500">{eyebrow}</p>}
                        <Heading as="h2" className="text-xl">
                            {title}
                        </Heading>
                        {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
                    </div>

                    <Button type="button" variant="ghost" size="sm" aria-label="Close modal" onClick={onClose}>
                        <X size={18} />
                    </Button>
                </div>

                {children}

                {footer && (
                    <div className="flex flex-col-reverse gap-3 border-t border-gray-100 p-5 sm:flex-row sm:justify-end sm:p-6">
                        {footer}
                    </div>
                )}
            </Wrapper>
        </div>
    );
};

export default Modal;
