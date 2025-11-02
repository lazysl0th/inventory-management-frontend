import { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery, } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { GET_INVENTORY } from '../../graphql/queries';
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
    const currentUser = useContext(CurrentUserContext);
    const formikRef = useRef();
    const [inventory, setInventory] = useState({
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
    })
    
    
    const [activeTab, setActiveTab] = useState('details');
    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY);
    const inventoryData = data?.inventory || {}
    
    
    
    useEffect(() => {
        if (inventoryId) {
            loadInventory({ variables: { id: inventoryId } })
            loadTags()
            updateInventory(inventoryData);
            formikRef.current.setValues({ title: inventoryData.title || '', category: inventoryData.category || '', })
            handlerChangeInventory('tags', resultTags?.data?.tags?.filter((tag) => tag.inventories.some((inventory) => inventory.id === inventoryId)))
        } else {
            updateInventory({
                owner: {id: currentUser.id, name: currentUser.name} 
            })
        }
        //if (['items', 'chat'].includes(activeTab)) loadInventory({ variables: { inventoryId: inventoryId } })
        
    }, [isOpen, loading, inventoryId]);


    const updateInventory = (inventoryData) => {
        for(let key in inventoryData) {
                (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeInventory(key, new Date(+inventoryData[key]).toLocaleString())
                    : handlerChangeInventory(key, inventoryData[key])
        }
    }
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
            owner: {},
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
            customIdFormat: { parts: [], },
            isPublic: false,
            allowedUsers: [],
            fields: [],
            tags: []
        });
        setActiveTab('details');
    }

    const handleImageFileSelect = (file) => {
        //console.log("Выбран файл:", file.name);
    };
    const validation = async () => {
        const errors = await formikRef.current.validateForm();
        formikRef.current.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        if (Object.keys(errors).length === 0) formikRef.current.handleSubmit() 
    }


    const handleCreateInventory = () => {
        const { createdAt, updatedAt, ...newInventory } = inventory;
        //handlerChangeInventory('owner', inventory.owner.id)
        //console.log(inventory);
        //console.log(inventory);
        handlerCreateInventory(newInventory);
    }

    const fields = []
    //console.log(inventory?.__typename)
    console.log(inventory);
    const hasErrors = Object.keys(formikRef.current?.errors || {}).length > 0;
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
        <FormValidation
            innerRef={formikRef}
            initialValues={{title: inventory.title, category: inventory.category}}
            validationSchema={InventorySchema}
            onSubmit={inventoryId ? 'handleUpdateInventory' : handleCreateInventory}
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
                        {<InventoryDetailsTab
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
            </>                      )}
            </FormValidation>
        </Modal>
    );
}

export default InventoryView;
