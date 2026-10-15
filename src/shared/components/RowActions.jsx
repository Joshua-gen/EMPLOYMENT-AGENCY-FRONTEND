import {useEffect, useRef, useState} from "react";
import {MoreHorizontal} from "lucide-react";
import Button from "../../components/ui/Button";

const TONES = {
    default: "text-slate-700 hover:bg-slate-50",
    success: "text-emerald-700 hover:bg-emerald-50",
    danger: "text-red-600 hover:bg-red-50",
};

const RowActions = ({items, label = "Row actions"}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const close = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div ref={ref} className="relative">
            <Button type="button" variant="ghost" size="sm" aria-label={label} onClick={() => setOpen((v) => !v)}>
                <MoreHorizontal size={20} />
            </Button>

            {open && (
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                    {items
                    .filter((item) => !item.hidden)
                    .map(({label, icon: Icon, onClick, tone = "default"}) => (
                        <button
                            key={label}
                            type="button"
                            onClick={() => {
                                setOpen(false);
                                onClick();
                            }}
                            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm ${TONES[tone]}`}
                        >
                            {Icon && <Icon size={16} />}
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RowActions;
