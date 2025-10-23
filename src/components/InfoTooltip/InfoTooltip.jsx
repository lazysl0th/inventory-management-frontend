import { Modal } from "react-bootstrap";

export default function InfoTooltip({ isOpen, onClose, title, message }) {

    return (
        <Modal
            size="md"
            show={isOpen}
            centered
            onHide={onClose}
            aria-labelledby="example-modal-sizes-title-sm"
        >
            <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-sm">
                {title}
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>{message}</Modal.Body>
        </Modal>
    );
}