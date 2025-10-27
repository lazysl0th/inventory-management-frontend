import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';
import DetailsTab from './InventoryTabs/DetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "./InventoryTabs/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';
import React from 'react';


function InventoryView({ onShow, inventory, categories, status, data, onClose, handlerChangeRecord, activeTab, onSelectTabs}) {

    const handleImageFileSelect = (file) => {
        console.log("Выбран файл:", file.name);
    };
    
    const handleSelectTabs = (tabKey) => {
        onSelectTabs(tabKey)
    }

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
            <Modal.Body className={(status.loading || status.error) && "align-self-center"}>
                <Tabs
                    id={inventory?.__typename}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={handleSelectTabs}
                    fill
                >
                    <Tab eventKey="details" title="Details">
                        {status.loading
                            ? <Spinner animation="border"/>
                            : status.error
                                ? <Alert variant="danger">{status.error}</Alert>
                                : <DetailsTab
                                    value={inventory}
                                    categories={categories}
                                    onChange={handlerChangeRecord}
                                    onImageFileSelect={handleImageFileSelect}
                                /> }
                    </Tab>
                    <Tab eventKey="customId" title="Custom ID">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
                                : <CustomIdTab customIdFormat={inventory.customIdFormat} /> }
                    </Tab>
                    <Tab eventKey="fields" title="Fields">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
                                : <FieldsTab fields={inventory.fields} /> }
                    </Tab>
                    <Tab eventKey="access" title="Access">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
                                : <AccessTab inventory={inventory} /> }
                    </Tab>
                    <Tab eventKey="items" title="Items">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
                                : <RecordsList records={data?.items} /> }
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
                                : <ChatTab
                                    comments={inventory.comments}
                                    onAddComment={async (text) => {
                                        // 🔹 Здесь потом будет GraphQL mutation
                                        console.log("Добавить комментарий:", text);
                                    }}
                                /> }
                    </Tab>
                    <Tab eventKey="stats" title="Stats">
                        {status.loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : status.error
                                ? <Alert variant="danger" className="align-self-center">{status.error}</Alert>
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
