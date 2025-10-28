import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "../ChatTab/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';


function InventoryView({
    onShow,
    inventory,
    categories,
    items,
    status,
    onClose,
    handlerChangeRecord,
    handlerRecordClick,
    activeTab,
    onSelectTab
}) {

    const handleImageFileSelect = (file) => {
        console.log("Выбран файл:", file.name);
    };

    //console.log(inventory.title)

    return (
        <Modal
            show={onShow}
            onHide={onClose}
            size="xl"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{inventory?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={(status.loadingInventory || status.errorInventory) && "align-self-center"}>
                <Tabs
                    id={inventory?.__typename}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={onSelectTab}
                    fill
                >
                    <Tab eventKey="details" title="Details">
                        {status.loadingInventory
                            ? <Spinner animation="border"/>
                            : status.errorInventory
                                ? <Alert variant="danger">{status.errorInventory}</Alert>
                                : <InventoryDetailsTab
                                    inventory={inventory}
                                    categories={categories}
                                    onChange={handlerChangeRecord}
                                    onImageFileSelect={handleImageFileSelect}
                                /> }
                    </Tab>
                    <Tab eventKey="customId" title="Custom ID">
                        {status.loadingInventory 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <CustomIdTab customIdFormat={inventory.customIdFormat} /> }
                    </Tab>
                    <Tab eventKey="fields" title="Fields">
                        {status.loadingInventory 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <FieldsTab fields={inventory.fields} /> }
                    </Tab>
                    <Tab eventKey="access" title="Access">
                        {status.loadingInventory
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <AccessTab inventory={inventory} /> }
                    </Tab>
                    <Tab eventKey="items" title="Items">
                        {status.loadingInventory
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <RecordsList records={items} handlerRecordClick={handlerRecordClick} /> }
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                        {status.loadingInventory
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <ChatTab
                                    comments={inventory.comments}
                                    onAddComment={async (text) => {
                                        // 🔹 Здесь потом будет GraphQL mutation
                                        console.log("Добавить комментарий:", text);
                                    }}
                                /> }
                    </Tab>
                    <Tab eventKey="stats" title="Stats">
                        {status.loadingInventory
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.errorInventory
                                ? <Alert variant="danger" className="align-self-center">{status.errorInventory}</Alert>
                                : <StatsTab inventory={inventory}
                                /> }
                    </Tab>
                    <Tab eventKey="export" title="Export"></Tab>
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

export default InventoryView;
