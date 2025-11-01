import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';

import { GET_INVENTORY, GET_INVENTORY_TAB } from '../../graphql/queries';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "../ChatTab/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';
import { nameList } from '../../utils/constants';


function InventoryView({
    isOpen,
    categories,
    inventoryId,
    handlerCloseView,
    handlerClickRecord,
    handlerCreateInventory
}) {
    const [inventory, setInventory] = useState({
        title: '',
        description: '',
        category: '',
        image: '',
        owner: '',
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        customIdFormat: { parts: [], },
        isPunblic: false,
        allowedUsers: [],
        fields: []
    })
    const [activeTab, setActiveTab] = useState('details');

    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY);
    const inventoryData = data?.inventory || {}
    
    useEffect(() => {
        if (inventoryId) {loadInventory({ variables: { id: inventoryId } }) 
        for(let key in inventoryData) {
            //console.log(inventoryPart?.[key]);
            (key === 'owner')
                ? handlerChangeInventory(key, inventoryData[key].name) 
                : (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeInventory(key, new Date(+inventoryData[key]).toLocaleString())
                    : handlerChangeInventory(key, inventoryData[key])
        }
        
        
        }
        if (['items', 'chat'].includes(activeTab)) loadInventory({ variables: { inventoryId: inventoryId } })
    }, [inventoryId, loading]);

    /*useEffect(() => {
        for(let key in inventoryPart) {
            //console.log(inventoryPart?.[key]);
            (key === 'owner')
                ? handlerChangeInventory(key, inventoryPart[key].name) 
                : (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeInventory(key, new Date(+inventoryPart[key]).toLocaleString())
                    : handlerChangeInventory(key, inventoryPart[key])
        }
    }, [loading]);*/

    const handlerChangeInventory = ((name, value) => {
        //console.log(name);
        //console.log(value);
        setInventory(prev => ({ ...prev,
            [name]: value,
        }));
    });




    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setInventory({ 
            title: '',
            description: '',
            category: '',
            image: '',
            owner: '',
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
            customIdFormat: { parts: [], },
            isPunblic: false,
            allowedUsers: [],
            fields: []
        });
        setActiveTab('details');
    }

    const handleImageFileSelect = (file) => {
        //console.log("Выбран файл:", file.name);
    };


    const handleCreateInventory = (e) => {
        //console.log(e);
        //console.log(inventory);
        handlerCreateInventory(inventory);
    }

    const fields = []
    //console.log(inventory?.__typename)
    console.log(inventory);

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
                    id='inventory-tabs'
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    fill
                >
                    <Tab eventKey='details' title='Details'>
                        {<InventoryDetailsTab
                                    categories={categories}
                                    details={inventory}
                                    handlerChangeDetails={handlerChangeInventory}
                                    onImageFileSelect={handleImageFileSelect}
                                />/*loading
                            ? <Spinner animation="border"/>
                            : error
                                ? <Alert variant="danger">{error.message}</Alert>
                                :  */}
                    </Tab>
                    <Tab eventKey="customId" title="Custom ID">
                        {loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <CustomIdTab
                                    customIdFormat={inventory?.customIdFormat}
                                    handlerChangeCustomIdFormat={handlerChangeInventory}
                                /> }
                    </Tab>
                    <Tab eventKey="fields" title="Fields">
                        {loading 
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <FieldsTab
                                    itemFields={inventory.fields}
                                    handlerChangeFields={handlerChangeInventory}
                                /> }
                    </Tab>
                    <Tab eventKey="access" title="Access">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <AccessTab
                                    inventory={inventory}
                                    handlerChangeAllowedUsers={handlerChangeInventory}
                                /> }
                    </Tab>
                    <Tab eventKey="items" title="Items">
                        {loading
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <RecordsList nameRecordList={nameList.ITEMS} records={inventoryData.items} handlerClickRecord={handlerClickRecord} /> }
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
