import {CalendarDays, CheckCircle2, Clock3, FileText, Plane, UserCheck, Users, XCircle} from "lucide-react";

export const STAGES = [
    {label: "All Applicants", value: "All", icon: Users},
    {label: "Submitted", value: "Submitted", icon: FileText},
    {label: "Under Review", value: "Under Review", icon: Clock3},
    {label: "Shortlisted", value: "Shortlisted", icon: UserCheck},
    {label: "Interview", value: "Interview", icon: CalendarDays},
    {label: "Selected", value: "Selected", icon: CheckCircle2},
    {label: "Processing", value: "Processing", icon: FileText},
    {label: "Deployed", value: "Deployed", icon: Plane},
    {label: "Rejected", value: "Rejected", icon: XCircle},
];

export const STAGE_OPTIONS = STAGES.filter((stage) => stage.value !== "All").map(({value, label}) => ({
    value,
    label,
}));

// ang normal na takbo ng application
export const PIPELINE = ["Submitted", "Under Review", "Shortlisted", "Interview", "Selected", "Processing", "Deployed"];

// kailangan na may employer bago umabot dito
export const STAGES_REQUIRING_EMPLOYER = ["Interview", "Selected", "Processing", "Deployed"];

export const VIEW_OPTIONS = [
    {value: "All", label: "All Applicants"},
    {value: "job", label: "Applied to a Job"},
    {value: "direct", label: "Direct Apply"},
    {value: "walk_in", label: "Walk-in"},
    {value: "unassigned", label: "Not Assigned Yet"},
];

// Para sa admin form at public form
export const GENDER_OPTIONS = [
    {value: "male", label: "Male"},
    {value: "female", label: "Female"},
];

export const CIVIL_STATUS_OPTIONS = [
    {value: "single", label: "Single"},
    {value: "married", label: "Married"},
    {value: "widowed", label: "Widowed"},
    {value: "separated", label: "Separated"},
];

export const EDUCATION_OPTIONS = [
    {value: "elementary", label: "Elementary"},
    {value: "high-school", label: "High School"},
    {value: "senior-high", label: "Senior High School"},
    {value: "vocational", label: "Vocational"},
    {value: "college", label: "College"},
    {value: "post-graduate", label: "Post Graduate"},
];

const THIS_YEAR = new Date().getFullYear();

// mula ngayong taon pababa hanggang 1960
export const YEAR_OPTIONS = Array.from({length: THIS_YEAR - 1959}, (_, index) => {
    const year = String(THIS_YEAR - index);
    return {value: year, label: year};
});
