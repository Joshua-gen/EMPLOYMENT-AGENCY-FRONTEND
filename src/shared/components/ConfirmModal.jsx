import Button from "../../components/ui/Button";
import Modal from "./Modal";

const ConfirmModal = ({title, message, confirmLabel = "Delete", loading = false, onConfirm, onClose}) => (
    <Modal
        title={title}
        onClose={onClose}
        footer={
            <>
                <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button type="button" variant="danger" onClick={onConfirm} loading={loading}>
                    {confirmLabel}
                </Button>
            </>
        }
    >
        <p className="p-5 text-sm text-gray-600 sm:p-6">{message}</p>
    </Modal>
);

export default ConfirmModal;
