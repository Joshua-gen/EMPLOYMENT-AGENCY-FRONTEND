import {PIPELINE, STAGE_OPTIONS, STAGES_REQUIRING_EMPLOYER} from "./constants";

export const statusStyles = {
    Submitted: "bg-slate-100 text-slate-700",
    "Under Review": "bg-blue-100 text-blue-800",
    Shortlisted: "bg-violet-100 text-violet-800",
    Interview: "bg-amber-100 text-amber-800",
    Selected: "bg-emerald-100 text-emerald-800",
    Processing: "bg-cyan-100 text-cyan-800",
    Deployed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-700",
};

export const sourceStyles = {
    job: "bg-blue-50 text-blue-800",
    direct: "bg-violet-50 text-violet-800",
};

export const humanize = (value) =>
    String(value ?? "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const getInitials = (name = "") =>
    name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

// Walang employer = hanggang Shortlisted lang
export const canReachStage = (applicant, stage) => !!applicant.employer || !STAGES_REQUIRING_EMPLOYER.includes(stage);

export const missingAssignment = (applicant) => (!applicant.job ? "job" : !applicant.employer ? "employer" : null);

export const assignmentHint = (applicant) =>
    applicant.job ? "assign an employer first" : "assign a job and an employer first";

const rawNext = (status) => {
    const index = PIPELINE.indexOf(status);
    return index === -1 || index === PIPELINE.length - 1 ? null : PIPELINE[index + 1];
};

export const getNextStage = (applicant) => {
    const next = rawNext(applicant.status);
    return next && canReachStage(applicant, next) ? next : null;
};

// kulang ang job/employer para sa susunod na stage (o para sa kasalukuyang stage)
export const requiresAssignment = (applicant) => {
    if (!missingAssignment(applicant)) return false;

    const next = rawNext(applicant.status);

    return STAGES_REQUIRING_EMPLOYER.includes(applicant.status) || (!!next && !canReachStage(applicant, next));
};

export const getStageOptions = (applicant) =>
    STAGE_OPTIONS.map((option) => {
        const locked = !canReachStage(applicant, option.value);

        return {
            ...option,
            disabled: locked,
            label: locked ? `${option.label} (${assignmentHint(applicant)})` : option.label,
        };
    });
