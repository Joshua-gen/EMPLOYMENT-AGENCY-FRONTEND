export const formatDate = (date) => {
    if (!date) return "—";

    return new Date(`${date}T00:00:00`).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const parse = (date) => new Date(`${date}T00:00:00`);

// // "Oct 7, 2026"
// export const formatDate = (date) => {
//     if (!date) return "—";

//     return parse(date).toLocaleDateString("en-PH", {month: "short", day: "numeric", year: "numeric"});
// };

// "October 7, 2026"
export const formatLongDate = (date) => {
    if (!date) return "—";

    return parse(date).toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});
};

// "2022-03" -> "Mar 2022"
export const formatMonth = (value) => {
    if (!value) return "";

    return new Date(`${value}-01T00:00:00`).toLocaleDateString("en-PH", {month: "short", year: "numeric"});
};

// start at end ay "YYYY-MM"; walang end = Present
export const formatPeriod = (start, end) =>
    start ? `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}` : "";
