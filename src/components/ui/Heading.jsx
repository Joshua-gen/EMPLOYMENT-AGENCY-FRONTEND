const sizes = {
    h1: "text-3xl font-extrabold tracking-tight sm:text-4xl",
    h2: "text-2xl font-bold tracking-tight sm:text-3xl",
    h3: "text-xl font-bold sm:text-2xl",
    h4: "text-lg font-bold",
};

const Heading = ({as: Tag = "h2", children, className = "", ...props}) => {
    return (
        <Tag className={`${sizes[Tag] || sizes.h2} text-[#062B4A] ${className}`} {...props}>
            {children}
        </Tag>
    );
};

export default Heading;
