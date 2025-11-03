import { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery, useMutation} from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GET_INVENTORY, UPDATE_INVENTORY_NEW} from '../../graphql/queries';
import FormValidation from '../FormValidator/FormValidator';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ChatTab from "../ChatTab/ChatTab";
import StatsTab from "./InventoryTabs/StatsTab";
import RecordsList from '../RecordsList/RecordsList';
import { nameList } from '../../utils/constants';
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
    handlerCreateInventory
}) {

    const initialInventory = {
        title: '',
        description: '',
        category: '',
        image: '',
        owner: {id: '', name: ''},
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        customIdFormat: { parts: [], },
        isPublic: false,
        allowedUsers: [],
        fields: [],
        tags: [],
    }

    const currentUser = useContext(CurrentUserContext);
    const formikRef = useRef();
    const [inventory, setInventory] = useState(initialInventory)
    const [version, setVersion] = useState();
    const [activeTab, setActiveTab] = useState('details');

    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY);
    const [updateInventor] = useMutation(UPDATE_INVENTORY_NEW);
    
    const inventoryData = data?.inventory || {}
    
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
        
    }, [isOpen, loading, inventoryId]);


    const updateInitialInventory = (inventoryData) => {
        for(let key in inventoryData) {
                (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeInventory(key, new Date(+inventoryData[key]).toLocaleString())
                    : (key === 'version') 
                        ? setVersion(inventoryData[key])
                        : handlerChangeInventory(key, inventoryData[key])
        }
    }

    const handlerChangeInventory = ((name, value) => {
        setInventory(prev => ({ ...prev, [name]: value, }));
    });

    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setInventory(initialInventory);
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
        try {
            const { data } = await updateInventor({
            variables: { 
                id: inventory.id,
                expectedVersion: version,
                input: {
                    ...inventory,
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
                    allowedUsers: inventory.allowedUsers.filter((user) => !isNaN(user.id)).map((user) => ({ id: user.id })),
                    }
            },
            });
        } catch (error) {

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
                    <Modal.Body className={(loading || error) && "align-self-center"}>
                        <Tabs
                            id='inventory-tabs'
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
                        <OverlayTrigger
                            key='top'
                            placement='top'
                            overlay={(Object.keys(formikRef.current?.errors.length > 0))
                                ? (<Tooltip id='tooltip-error'> Required </Tooltip>)
                                : <Tooltip id="tooltip-empty" className="d-none" />
                            }
                            >
                        <Button variant="secondary" onClick={validation}> { inventoryId ? 'Update' : 'Create' } </Button>
                        </OverlayTrigger>
                    </Modal.Footer>
                </>)}
            </FormValidation>
        </Modal>
    );
}

export default InventoryView;
