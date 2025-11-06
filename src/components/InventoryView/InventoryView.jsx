import { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GET_INVENTORY, UPDATE_INVENTORY_NEW, GET_ITEMS, GET_COMMENTS, } from '../../graphql/queries';
import FormValidation from '../FormValidator/FormValidator';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "../ChatTab/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';
import { initialStateInventory } from '../../utils/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { InventorySchema } from '../../utils/validationSchema';


function InventoryView({
    isOpen,
    categories,
    loadTags,
    resultTags,
    inventoryId,
    handlerCloseView,
    handlerClickRecord,
    handlerCreateInventory,
    handlerAddRecord,
    handlerDeleteRecords
}) {

    const currentUser = useContext(CurrentUserContext);
    const formikRef = useRef();
    const [inventory, setInventory] = useState(initialStateInventory)
    const [version, setVersion] = useState();
    const [activeTab, setActiveTab] = useState('details');

    const [loadInventory, { data: dataInventory, loading: loadingInventory, error: errorInventory, resetInventory }] = useLazyQuery(GET_INVENTORY);
    const [loadItems, { data: dataItems, loading: loadingItems, error: errorItems, reset: resetItems }] = useLazyQuery(GET_ITEMS);
    const [loadChat, { data: dataChat, loading: loadingChat, error: errorChat, reset: resetChat }] = useLazyQuery(GET_COMMENTS);
    const [updateInventor] = useMutation(UPDATE_INVENTORY_NEW);
    
    const inventoryData = dataInventory?.inventory || {}
    const itemsData = dataItems?.items || []
    //console.log(inventory)
    useEffect(() => {
        if (inventoryId) {
            loadInventory({ variables: { id: inventoryId } })
            loadTags()
            updateInitialInventory(inventoryData);
            formikRef.current.setValues({ title: inventoryData.title || '', category: inventoryData.category || '', })
            handlerChangeInventory('tags', resultTags?.data?.tags?.filter((tag) => tag.inventories.some((inventory) => inventory.id === inventoryId)))
        } else {
            updateInitialInventory({
                owner: {id: currentUser.id, name: currentUser.name} 
            })
        }
        //if (['items', 'chat'].includes(activeTab)) loadInventory({ variables: { inventoryId: inventoryId } })
        
    }, [isOpen, loadingInventory, inventoryId]);

    useEffect(() => {
        if (activeTab === 'items' && inventoryId) loadItems({ variables: { inventoryId: inventoryId } })
    }, [activeTab, loadingItems]);

    useEffect(() => {
        if (activeTab === 'chat' && inventoryId) loadItems({ variables: { inventoryId: inventoryId } })
    }, [activeTab, loadingItems]);


    const updateInitialInventory = (inventoryData) => {
        for(let key in inventoryData) {
                (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeInventory(key, new Date(+inventoryData[key]).toLocaleString())
                    : (key === 'version') 
                        ? setVersion(inventoryData[key])
                        : handlerChangeInventory(key, inventoryData[key])
        }
    }

    const handlerChangeInventory = ((name, value) => setInventory(prev => ({ ...prev, [name]: value, })));

    const handleCloseView = () => {
        handlerCloseView();
        resetInventory?.();
        setInventory(initialStateInventory);
        setActiveTab('details');
    }

    const handleImageFileSelect = (file) => {
    };

    const validation = async () => {
        const errors = await formikRef.current.validateForm();
        formikRef.current.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        if (Object.keys(errors).length === 0) formikRef.current.handleSubmit() 
    }

    const handleCreateInventory = () => {
        const { createdAt, updatedAt, ...newInventory } = inventory;
        console.log(newInventory);
        handlerCreateInventory({
            ...newInventory,
            tags: inventory.tags?.map((tag) => ({
                        id: tag.id, name: tag.name,
                    })),
            fields: inventory.fields.map((field) => ({
                        id: field.id, 
                        title: field.title, 
                        type: field.type,
                        description: field.description,
                        showInTable: field.showInTable,
                        order: field.order,
                        isDeleted: field.isDeleted, 
                    })),
            allowedUsers: newInventory.allowedUsers.filter((user) => !isNaN(user.id)).map((user) => ({ id: user.id })),
        });
    }
    
    const handleUpdateInventory = async() => {
        const { createdAt, updatedAt, ...updateInventory } = inventory;
        //console.log(inventory)
        //console.log(updateInventory)
        try {
            const { data } = await updateInventor({
                variables: { 
                    id: updateInventory.id,
                    expectedVersion: version,
                    input: {
                        ...updateInventory,
                        tags: updateInventory.tags?.map((tag) => ({
                            id: tag.id, name: tag.name,
                        })),
                        fields: updateInventory.fields.map((field) => ({
                            id: field.id, 
                            title: field.title, 
                            type: field.type,
                            description: field.description,
                            showInTable: field.showInTable,
                            order: field.order,
                            isDeleted: field.isDeleted, 
                        })),
                        allowedUsers: inventory.allowedUsers.filter((user) => !isNaN(user.id)).map((user) => ({ id: user.id })),
                    }
                },
            });
            setVersion(data.updateInventory.version)
        } catch (e) {

        }
    }

    return (
        <Modal
            show={isOpen}
            onHide={handleCloseView}
            size="xl"
            backdrop="static"
            keyboard={false}
            centered
        >
        <FormValidation
            innerRef={formikRef}
            initialValues={{title: inventory.title, category: inventory.category}}
            validationSchema={InventorySchema}
            onSubmit={inventoryId ? handleUpdateInventory : handleCreateInventory}
            validateOnMount={true}>
            { ({ handleSubmit, values, handleChange, handleBlur, touched, errors, isSubmitting}) => (
                <>
                    <Modal.Header closeButton>
                        <Modal.Title>{inventory?.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={(loadingInventory || errorInventory) && "align-self-center"}>
                        <Tabs
                            id='inventory-tabs'
                            className="mb-3"
                            activeKey={activeTab}
                            onSelect={setActiveTab}
                            fill
                        >
                            <Tab eventKey='details' title='Details'>
                                {loadingInventory
                                    ? <Spinner animation="border"/>
                                    : errorInventory
                                        ? <Alert variant="danger">{errorInventory.message}</Alert>
                                        : <InventoryDetailsTab
                                            categories={categories}
                                            formikValues={values}
                                            inventoryTags={inventory.tags}
                                            details={inventory}
                                            formikHandlerChange={handleChange}
                                            formikErrors={errors}
                                            formikBlur={handleBlur}
                                            formikTouched={touched}
                                            handlerChangeDetails={handlerChangeInventory}
                                            onImageFileSelect={handleImageFileSelect}
                                        />}
                            </Tab>
                            <Tab eventKey="customId" title="Custom ID">
                                {loadingInventory
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorInventory
                                        ? <Alert variant="danger" className="align-self-center">{errorInventory.message}</Alert>
                                        : <CustomIdTab
                                            customIdFormat={inventory?.customIdFormat}
                                            handlerChangeCustomIdFormat={handlerChangeInventory}
                                        /> }
                            </Tab>
                            <Tab eventKey="fields" title="Fields">
                                {loadingInventory
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorInventory
                                        ? <Alert variant="danger" className="align-self-center">{errorInventory.message}</Alert>
                                        : <FieldsTab
                                            itemFields={inventory.fields}
                                            handlerChangeFields={handlerChangeInventory}
                                        /> }
                            </Tab>
                            <Tab eventKey="access" title="Access">
                                {loadingInventory
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorInventory
                                        ? <Alert variant="danger" className="align-self-center">{errorInventory.message}</Alert>
                                        : <AccessTab
                                            inventory={inventory}
                                            handlerChangeAllowedUsers={handlerChangeInventory}
                                        /> }
                            </Tab>
                            <Tab eventKey="items" title="Items">
                                {loadingItems
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorItems
                                        ? <Alert variant="danger" className="align-self-center">{errorItems.message}</Alert>
                                        : <RecordsList type='Item'
                                            records={itemsData}
                                            handlerAddRecord={handlerAddRecord}
                                            handlerClickRecord={handlerClickRecord}
                                            handlerDeleteRecords={handlerDeleteRecords} /> }
                            </Tab>
                            <Tab eventKey="chat" title="Chat">
                                {loadingChat
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorChat
                                        ? <Alert variant="danger" className="align-self-center">{errorChat.message}</Alert>
                                        : <ChatTab
                                            comments={inventory.comments}
                                            onAddComment={async (text) => {
                                                console.log("Добавить комментарий:", text);
                                            }}
                                        /> }
                            </Tab>
                            <Tab eventKey="stats" title="Stats">
                                {loadingInventory
                                    ? <Spinner animation="border" className="align-self-center"/>
                                    : errorInventory
                                        ? <Alert variant="danger" className="align-self-center">{errorInventory.message}</Alert>
                                        : <StatsTab inventory={inventory}
                                        /> }
                            </Tab>
                            <Tab eventKey="export" title="Export"></Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <OverlayTrigger
                            key='top'
                            placement='top'
                            overlay={(Object.keys(formikRef.current?.errors.length > 0))
                                ? (<Tooltip id='tooltip-error'> Required </Tooltip>)
                                : <Tooltip id="tooltip-empty" className="d-none" />
                            }
                            >
                        <Button variant="primary" onClick={validation}> { inventoryId ? 'Update' : 'Create' } </Button>
                        </OverlayTrigger>
                    </Modal.Footer>
                </>)}
            </FormValidation>
        </Modal>
    );
}

export default InventoryView;
