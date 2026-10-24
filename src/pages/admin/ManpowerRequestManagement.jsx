import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {BriefcaseBusiness, CheckCircle2, Clock3, FileText, XCircle} from "lucide-react";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Text from "../../components/ui/Text";
import ConfirmModal from "../../shared/components/ConfirmModal";
import Pagination from "../../shared/components/Pagination";
import StatCards from "../../shared/components/StatCards";
import useToast from "../../shared/hooks/useToast";
import CountrySelect from "../../features/countries/components/CountrySelect";
import ApproveRequestModal from "../../features/manpowerRequests/components/ApproveRequestModal";
import LinkJobModal from "../../features/manpowerRequests/components/LinkJobModal";
import ManpowerRequestDetailsModal from "../../features/manpowerRequests/components/ManpowerRequestDetailsModal";
import ManpowerRequestTable from "../../features/manpowerRequests/components/ManpowerRequestTable";
import RejectRequestModal from "../../features/manpowerRequests/components/RejectRequestModal";
import useManpowerRequests from "../../features/manpowerRequests/hooks/useManpowerRequests";

const TABS = [
    {label: "All Requests", value: "All", icon: FileText},
    {label: "Pending Review", value: "Pending", icon: Clock3},
    {label: "Approved", value: "Approved", icon: CheckCircle2},
    {label: "Rejected", value: "Rejected", icon: XCircle},
];

const ManpowerRequestManagement = () => {
    const toast = useToast();
    const navigate = useNavigate();

    const {
        requests,
        meta,
        summary,
        loading,
        error,
        filters,
        setSearch,
        setStatus,
        setCountry,
        setPage,
        setPerPage,
        fetchOne,
        approve,
        reject,
        linkJob,
        unlinkJob,
    } = useManpowerRequests();

    const [modal, setModal] = useState(null); // "details" | "approve" | "reject" | "link"
    const [selected, setSelected] = useState(null);
    const [position, setPosition] = useState(null);
    const [toUnlink, setToUnlink] = useState(null);
    const [unlinking, setUnlinking] = useState(false);

    const closeModal = () => {
        setModal(null);
        setSelected(null);
        setPosition(null);
    };

    // kunin ang pinakabagong data (kasama ang possible_employers kapag Pending)
    const openWithFresh = async (request, name) => {
        setSelected(request);
        setModal(name);

        const result = await fetchOne(request.id);

        if (result.ok) setSelected(result.data);
        else toast.error(result.message, {title: "Load failed"});
    };

    const handleApprove = async (payload) => {
        const result = await approve(selected.id, payload);

        if (result.ok) {
            toast.success("Request approved.");
            setSelected(result.data);
            setModal("details");
        }

        return result;
    };

    const handleReject = async (remarks) => {
        const result = await reject(selected.id, remarks);

        if (result.ok) {
            toast.success("Request rejected.");
            closeModal();
        }

        return result;
    };

    const handleLink = async (jobId) => {
        const result = await linkJob(selected.id, position.id, jobId);

        if (result.ok) {
            toast.success("Position linked to job opening.");
            setSelected(result.data);
            setPosition(null);
            setModal("details");
        }

        return result;
    };

    const confirmUnlink = async () => {
        setUnlinking(true);

        const result = await unlinkJob(selected.id, toUnlink.id);

        if (result.ok) {
            toast.success("Position unlinked.");
            setSelected(result.data);
        } else {
            toast.error(result.message, {title: "Unlink failed"});
        }

        setUnlinking(false);
        setToUnlink(null);
    };

    // Shortcut: buksan ang job form na pre-filled; i-link pagkatapos ma-save.
    // TODO: basahin ang location.state sa Job page (prefill + linkAfterSave) at tawagin ang linkJob pagkatapos mag-save.
    const handleCreateJob = (target) => {
        navigate("/management/jobs", {
            state: {
                prefill: {title: target.position, country: selected.country, description: target.description},
                linkAfterSave: {requestId: selected.id, positionId: target.id},
            },
        });
    };

    const counts = {
        All: summary?.All ?? 0,
        Pending: summary?.Pending ?? 0,
        Approved: summary?.Approved ?? 0,
        Rejected: summary?.Rejected ?? 0,
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Header */}
                <section>
                    <Text size="sm" weight="bold" className="uppercase tracking-[0.18em] text-[#4F7383]">
                        Recruitment
                    </Text>
                    <Heading as="h1" className="mt-1">
                        Manpower Requests
                    </Heading>
                    <Text size="sm" className="mt-2 max-w-2xl text-gray-500">
                        Review employer requests, link them to an employer record, then attach each position to a job
                        opening.
                    </Text>
                </section>

                {error && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </Text>
                )}

                <StatCards
                    columns={4}
                    items={[
                        {label: "Total Requests", value: counts.All, icon: FileText, tone: "blue"},
                        {label: "Pending Review", value: counts.Pending, icon: Clock3, tone: "amber"},
                        {label: "Approved", value: counts.Approved, icon: CheckCircle2, tone: "green"},
                        {
                            label: "Positions Needing Job",
                            value: summary?.unlinked_positions ?? 0,
                            icon: BriefcaseBusiness,
                            tone: "blue",
                        },
                    ]}
                />

                {/* Table */}
                <Card className="overflow-visible !p-0">
                    <div className="border-b border-gray-100 p-5">
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {TABS.map(({label, value, icon: Icon}) => {
                                const active = filters.status === value;

                                return (
                                    <button
                                        type="button"
                                        key={value}
                                        onClick={() => setStatus(value)}
                                        className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                                            active
                                                ? "border-[#062B4A] bg-[#062B4A] text-white"
                                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Icon size={16} />
                                        {label}
                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs ${
                                                active ? "bg-white/15 text-white" : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {counts[value]}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search reference, business, contact, position..."
                                value={filters.search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            <CountrySelect includeAll value={filters.country} onChange={setCountry} />
                        </div>
                    </div>

                    <ManpowerRequestTable
                        requests={requests}
                        loading={loading}
                        onView={(request) => openWithFresh(request, "details")}
                        onApprove={(request) => openWithFresh(request, "approve")}
                        onReject={(request) => {
                            setSelected(request);
                            setModal("reject");
                        }}
                    />

                    <Pagination
                        meta={meta}
                        perPage={filters.perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            </div>

            {modal === "details" && selected && (
                <ManpowerRequestDetailsModal
                    request={selected}
                    onClose={closeModal}
                    onApprove={() => openWithFresh(selected, "approve")}
                    onReject={() => setModal("reject")}
                    onLink={(target) => {
                        setPosition(target);
                        setModal("link");
                    }}
                    onUnlink={setToUnlink}
                />
            )}

            {modal === "approve" && selected && (
                <ApproveRequestModal
                    key={`${selected.id}-${selected.possible_employers?.length ?? 0}`}
                    request={selected}
                    onClose={closeModal}
                    onSubmit={handleApprove}
                />
            )}

            {modal === "reject" && selected && (
                <RejectRequestModal request={selected} onClose={closeModal} onSubmit={handleReject} />
            )}

            {modal === "link" && selected && position && (
                <LinkJobModal
                    request={selected}
                    position={position}
                    onClose={() => setModal("details")}
                    onSubmit={handleLink}
                    onCreateJob={handleCreateJob}
                />
            )}

            {toUnlink && (
                <ConfirmModal
                    title="Unlink Position"
                    message={`Unlink "${toUnlink.position}" from ${
                        toUnlink.job?.title ?? "its job opening"
                    }? The employer stays attached to the job.`}
                    confirmLabel="Unlink"
                    loading={unlinking}
                    onConfirm={confirmUnlink}
                    onClose={() => setToUnlink(null)}
                />
            )}
        </div>
    );
};

export default ManpowerRequestManagement;
