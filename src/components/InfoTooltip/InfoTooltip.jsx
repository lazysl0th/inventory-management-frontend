import { Modal, ListGroup, Button } from "react-bootstrap";
import { GrUpdate } from "react-icons/gr";
import { MdSaveAlt } from "react-icons/md";
import { useTranslation } from 'react-i18next';


export default function InfoTooltip({ isOpen, onClose, title, onReload, onForceSave, message }) {
    const { t } = useTranslation("common");

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
                        <p className="mb-2">{t("versionConflict.paragraph")}</p>
                        <ListGroup variant="flush">
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>{t("versionConflict.listItems.update")}</strong> — {t("versionConflict.listItems.textUpdate")}
                                </div>
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex align-items-start">
                                <div>
                                    <strong>{t("versionConflict.listItems.rewrite")}</strong> — {t("versionConflict.listItems.textRewrite")}
                                </div>
                            </ListGroup.Item>
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={onReload}>
                            <GrUpdate /> {t("versionConflict.buttons.update")}
                        </Button>
                        <Button variant="danger" onClick={onForceSave}>
                            <MdSaveAlt /> {t("versionConflict.buttons.rewrite")}
                        </Button>
                    </Modal.Footer>
                </>)
                : <Modal.Body>{message}</Modal.Body>
            }
            
        </Modal>
    );
}