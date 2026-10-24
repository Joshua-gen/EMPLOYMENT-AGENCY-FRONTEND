import {useState} from "react";
import {Plus} from "lucide-react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Heading from "../../components/ui/Heading";
import Input from "../../components/ui/Input";
import Text from "../../components/ui/Text";
import ConfirmModal from "../../shared/components/ConfirmModal";
import Pagination from "../../shared/components/Pagination";
import useToast from "../../shared/hooks/useToast";
import CountrySelect from "../../features/countries/components/CountrySelect";
import {employerApi} from "../../features/employers/api/employerApi";
import BusinessCategorySelect from "../../features/employers/components/BusinessCategorySelect";
import EmployerDetailsModal from "../../features/employers/components/EmployerDetailsModal";
import EmployerFormModal from "../../features/employers/components/EmployerFormModal";
import EmployerTable from "../../features/employers/components/EmployerTable";
import useEmployers from "../../features/employers/hooks/useEmployers";

const EmployerManagement = () => {
    const toast = useToast();

    const {
        employers,
        meta,
        loading,
        error,
        filters,
        setSearch,
        setCountry,
        setCategory,
        setPage,
        setPerPage,
        createEmployer,
        updateEmployer,
        removeEmployer,
    } = useEmployers({paginate: true});

    const [modal, setModal] = useState(null); // "create" | "edit" | "details"
    const [selected, setSelected] = useState(null);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const openModal = (name, employer = null) => {
        setSelected(employer);
        setModal(name);
    };

    const closeModal = () => {
        setModal(null);
        setSelected(null);
    };

    const openDetails = (employer) => {
        openModal("details", employer);
        // kunin ang pinakabagong data kasama ang linked job openings (GET /employers/{id})
        employerApi
        .get(employer.id)
        .then((res) => setSelected(res.data))
        .catch(() => {});
    };

    const handleCreate = async (payload) => {
        const result = await createEmployer(payload);
        if (result.ok) toast.success(`${result.data?.name ?? "Employer"} added.`);
        return result;
    };

    const handleUpdate = async (payload) => {
        const result = await updateEmployer(selected.id, payload);
        if (result.ok) toast.success("Employer updated.");
        return result;
    };

    const confirmDelete = async () => {
        setDeleting(true);

        const result = await removeEmployer(toDelete.id);

        if (result.ok) toast.success(`${toDelete.name} was deleted.`);
        else toast.error(result.message, {title: "Delete failed"});

        setDeleting(false);
        setToDelete(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
            <div className="mx-auto max-w-7xl space-y-7">
                {/* Header */}
                <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Text size="sm" weight="bold" className="uppercase tracking-[0.18em] text-[#4F7383]">
                            Recruitment
                        </Text>
                        <Heading as="h1" className="mt-1">
                            Employer Management
                        </Heading>
                        <Text size="sm" className="mt-2 max-w-2xl text-gray-500">
                            Manage employers once, then attach them to as many job openings as you need.
                        </Text>
                    </div>

                    <Button type="button" onClick={() => openModal("create")}>
                        <Plus size={18} />
                        Add Employer
                    </Button>
                </section>

                {error && (
                    <Text size="sm" className="rounded-lg bg-red-50 px-4 py-3 text-red-600">
                        {error}
                    </Text>
                )}

                {/* Table */}
                <Card className="overflow-visible !p-0">
                    <div className="border-b border-gray-100 p-5">
                        <Heading as="h2" className="text-lg">
                            All Employers
                        </Heading>
                        <Text size="sm" className="mt-1 text-gray-500">
                            {meta?.total ?? 0} employer{meta?.total === 1 ? "" : "s"} in total.
                        </Text>

                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                            <Input
                                type="search"
                                name="search"
                                placeholder="Search name, contact, category..."
                                value={filters.search}
                                onChange={(event) => setSearch(event.target.value)}
                            />

                            <BusinessCategorySelect includeAll value={filters.categoryId} onChange={setCategory} />

                            <CountrySelect includeAll value={filters.country} onChange={setCountry} />
                        </div>
                    </div>

                    <EmployerTable
                        employers={employers}
                        loading={loading}
                        onView={openDetails}
                        onEdit={(employer) => openModal("edit", employer)}
                        onDelete={setToDelete}
                    />

                    <Pagination
                        meta={meta}
                        perPage={filters.perPage}
                        onPageChange={setPage}
                        onPerPageChange={setPerPage}
                    />
                </Card>
            </div>

            {modal === "create" && <EmployerFormModal onClose={closeModal} onSubmit={handleCreate} />}

            {modal === "edit" && selected && (
                <EmployerFormModal key={selected.id} employer={selected} onClose={closeModal} onSubmit={handleUpdate} />
            )}

            {modal === "details" && selected && (
                <EmployerDetailsModal
                    employer={selected}
                    onClose={closeModal}
                    onEdit={(employer) => openModal("edit", employer)}
                />
            )}

            {toDelete && (
                <ConfirmModal
                    title="Delete Employer"
                    message={`Delete ${toDelete.name}? This can't be undone.`}
                    confirmLabel="Delete"
                    loading={deleting}
                    onConfirm={confirmDelete}
                    onClose={() => setToDelete(null)}
                />
            )}
        </div>
    );
};

export default EmployerManagement;
