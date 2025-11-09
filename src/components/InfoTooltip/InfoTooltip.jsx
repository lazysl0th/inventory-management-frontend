import { Modal, ListGroup, Button } from "react-bootstrap";
import { GrUpdate } from "react-icons/gr";
import { MdSaveAlt } from "react-icons/md";


export default function InfoTooltip({ isOpen, onClose, title, onReload, onForceSave, message }) {

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
            {message === 'Version conflict'
                ? (<>
                    <Modal.Body>
                        <p className="mb-2">Inventory data has been modified by another user. You can:</p>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>Update</strong> — download the latest version of data from the server
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>Rewrite</strong> — save your changes over the current ones
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onReload}>
                            <GrUpdate /> Update
                        </Button>
                        <Button variant="danger" onClick={onForceSave}>
                            <MdSaveAlt /> Rewrite
                        </Button>
                    </Modal.Footer>
                </>)
                : <Modal.Body>{message}</Modal.Body>
            }
            
        </Modal>
    );
}