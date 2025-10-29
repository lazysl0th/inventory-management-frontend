import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';
import ItemDetailsTab from './ItemTabs.jsx/ItemDetailTabs';
import ChatTab from '../ChatTab/ChatTab';

function ItemView({ isOpen, item, activeTab, onSelectTab, status, onClose }) {

    //console.log(item);

    const handleImageFileSelect = (file) => {
        console.log("Выбран файл:", file.name);
    };

    return (
        <Modal
            show={isOpen}
            onHide={onClose}
            size="xl"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={(status.loadingItem || status.errorItem) && "align-self-center"}>
                <Tabs
                    id={''}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={onSelectTab}
                    fill
                >
                    <Tab eventKey="details" title="Details">
                        {status.loadingItem
                            ? <Spinner animation="border"/>
                            : status.errorItem
                                ? <Alert variant="danger">{status.errorItem}</Alert>
                                : <ItemDetailsTab item={item}/> }
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                        {status.loadingItem
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorItem
                                ? <Alert variant="danger" className="align-self-center">{status.errorItem}</Alert>
                                : <ChatTab
                                    comments={[]}
                                    onAddComment={async (text) => {
                                        // 🔹 Здесь потом будет GraphQL mutation
                                        console.log("Добавить комментарий:", text);
                                    }}
                                /> }
                    </Tab>

                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary">Understood</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ItemView;
