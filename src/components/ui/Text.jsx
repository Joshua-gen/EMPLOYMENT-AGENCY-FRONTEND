const sizes = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
};

const weights = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
};

const Text = ({as: Tag = "p", children, size = "base", weight = "normal", className = "", ...props}) => {
    return (
        <Tag className={`${sizes[size] || sizes.base} ${weights[weight] || weights.normal} ${className}`} {...props}>
            {children}
        </Tag>
    );
};

export default Text;
