import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';

import { GET_INVENTORY_TAB } from '../../graphql/queries';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "../ChatTab/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';


function InventoryView({
    isOpen,
    categories,
    inventoryId,
    handlerCloseView,
    handlerClickRecord,
    handlerCreateInventory
}) {

    const [activeTab, setActiveTab] = useState('details');
    const [inventory, setInventory] = useState({
        title: '',
        description: '',
        category: '',
        image: '',
        owner: '',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        customIdFormat: {},
    })


    const cidparts = {
  parts: [
    {
      id: "91a4a3f8-62c7-4b60-a341-1b3a1dfc7cb8",
      type: "TEXT",
      format: null,
      value: "INV-",
      position: "prefix",
      order: 0
    },
    {
      id: "b21d3f54-12df-4e1d-b381-25fa2473f1d1",
      type: "DATETIME",
      format: "YYYYMMDD",
      value: "-",
      position: "suffix",
      order: 1
    },
    {
      id: "88e7e5a0-cab5-4f4f-b2d2-f0b8c36450ce",
      type: "SEQUENCE",
      format: "D4",
      value: "",
      position: "prefix",
      order: 2
    }
  ]
    }

    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY_TAB[activeTab]);

    useEffect(() => {
        if (inventoryId) loadInventory({ variables: { id: inventoryId } })
        if (['items', 'chat'].includes(activeTab)) loadInventory({ variables: { inventoryId: inventoryId } })
    }, [inventoryId, activeTab, isOpen]);

    const inventoryPart = data?.inventory || {}
    
    const handlerChangeInventory = ((name, value) => {
        setInventory(prev => ({ ...prev,
            [name]: value,
        }));
    });

    useEffect(() => {
        for(let key in inventoryPart) {
            key === 'owner' ? handlerChangeInventory(key, inventoryPart[key].name) : handlerChangeInventory(key, inventoryPart[key]);
            (key === 'createdAt' || key === 'updatedAt') && new Date(+inventoryPart[key]).toLocaleString()
        }
    }, [loading]);



    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setInventory({ title: '', description: '', category: '', image: '', owner: '', createdAt: new Date().toLocaleString(), updatedAt: new Date().toLocaleString() });
        setActiveTab('details');
    }

    const handleImageFileSelect = (file) => {
        console.log("Выбран файл:", file.name);
    };


    const handleCreateInventory = (e) => {
        console.log(e);
        console.log(inventory);
        handlerCreateInventory(inventory);
    }


    //console.log(inventory?.__typename)
    //console.log(inventory);

    //console.log(inventoryId)
    //console.log(inventoryDetails);

    return (
        <Modal
            show={isOpen}
            onHide={handleCloseView}
            size="xl"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{inventory?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={(loading || error) && "align-self-center"}>
                <Tabs
                    id={inventory?.__typename}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    fill
                >
                    <Tab eventKey='details' title='Details'>
                        {loading
                            ? <Spinner animation="border"/>
                            : error
                                ? <Alert variant="danger">{error.message}</Alert>
                                : <InventoryDetailsTab
                                    categories={categories}
                                    details={inventory}
                                    handlerChangeDetails={handlerChangeInventory}
                                    onImageFileSelect={handleImageFileSelect}
                                /> }
                    </Tab>
                    <Tab eventKey="customId" title="Custom ID">
                        {loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <CustomIdTab parts={cidparts.parts} /> }
                    </Tab>
                    <Tab eventKey="fields" title="Fields">
                        {loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <FieldsTab fields={inventory.fields} /> }
                    </Tab>
                    <Tab eventKey="access" title="Access">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <AccessTab inventory={inventory} /> }
                    </Tab>
                    <Tab eventKey="items" title="Items">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <RecordsList records={inventoryPart.items} handlerClickRecord={handlerClickRecord} /> }
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <ChatTab
                                    comments={inventory.comments}
                                    onAddComment={async (text) => {
                                        // 🔹 Здесь потом будет GraphQL mutation
                                        console.log("Добавить комментарий:", text);
                                    }}
                                /> }
                    </Tab>
                    <Tab eventKey="stats" title="Stats">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <StatsTab inventory={inventory}
                                /> }
                    </Tab>
                    <Tab eventKey="export" title="Export"></Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCreateInventory}> Create </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default InventoryView;
