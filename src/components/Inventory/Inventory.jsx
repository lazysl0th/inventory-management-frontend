import { useState, useEffect, useContext, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { GET_INVENTORY, UPDATE_INVENTORY_NEW, GET_ITEMS } from '../../graphql/queries';
import FormValidation from '../FormValidator/FormValidator';
import InventoryDetailsTab from './InventoryTabs/InventoryDetailsTab';
import CustomIdTab from './InventoryTabs/CustomIdTab';
import FieldsTab from './InventoryTabs/FieldsTab';
import AccessTab from "./InventoryTabs/AccessTab";
import ItemsTab from './InventoryTabs/ItemsTab'
import DiscussionTab from "./InventoryTabs/DiscussionTab";
import StatsTab from "./InventoryTabs/StatsTab";
import { initialStateInventory, titleInfoTooltip, } from '../../utils/constants';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { InventorySchema } from '../../utils/validationSchema';


export default function Inventory({
    isOpen,
    onOpenTooltip,
    categories,
    loadTags,
    resultTags,
    inventoryId,
    handlerCloseView,
    handlerClickRecord,
    handlerCreateInventory,
    handlerAddRecord,
    handlerDeleteRecords,
    onShowToast,
    onUploadImage
}) {

    const currentUser = useContext(CurrentUserContext);
    const formikRef = useRef();
    const [inventory, setInventory] = useState(initialStateInventory)
    const [version, setVersion] = useState();
    const [activeTab, setActiveTab] = useState('details');

    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY);
    const [updateInventory] = useMutation(UPDATE_INVENTORY_NEW, {
            refetchQueries: [{ query: GET_ITEMS, variables: { inventoryId: inventoryId } }],
            awaitRefetchQueries: true,
        });
    
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
    }, [isOpen, data, inventoryId]);

    const updateInitialInventory = (inventoryData) => {
        const updated = { ...inventory };
        for (let key in inventoryData) {
            if (key === 'createdAt' || key === 'updatedAt') updated[key] = new Date(+inventoryData[key]).toLocaleString();
            else if (key === 'version') setVersion(inventoryData[key]);
            else updated[key] = inventoryData[key];
        }
        setInventory(updated);
    };
    
    const handlerChangeInventory = ((name, value) => {
        setInventory(prev => ({ ...prev, [name]: value, }))});

    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setInventory(initialStateInventory);
        setActiveTab('details');
    }



    const validation = async () => {
        const errors = await formikRef.current.validateForm();
        formikRef.current.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        if (Object.keys(errors).length === 0) formikRef.current.handleSubmit()
        else onShowToast('Заполните обязательные поля', 'bottom-center');
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
        const { createdAt, updatedAt, ...updatedInventory } = inventory;
        try {
            const { data } = await updateInventory({
                variables: { 
                    id: updatedInventory.id,
                    expectedVersion: version,
                    input: {
                        ...updatedInventory,
                        tags: updatedInventory.tags?.map((tag) => ({
                            id: tag.id, name: tag.name,
                        })),
                        fields: updatedInventory.fields.map((field) => ({
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
            console.log(e);
            onOpenTooltip(titleInfoTooltip.ERROR, e.message)
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
                                    ? (<div className="d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" className="align-self-center"/>
                                    </div>)
                                    : error
                                        ? (<div className="d-flex justify-content-center align-items-center">
                                            <Alert variant="danger">{error.message}</Alert>
                                            </div>)
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
                                            onUploadImage={onUploadImage}
                                            onShowToast={onShowToast}
                                        />}
                            </Tab>
                            <Tab eventKey="customId" title="Custom ID">
                                {loading
                                    ? (<div className="d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" className="align-self-center"/>
                                    </div>)
                                    : error
                                        ? (<div className="d-flex justify-content-center align-items-center">
                                            <Alert variant="danger">{error.message}</Alert>
                                            </div>)
                                        : <CustomIdTab
                                            customIdFormat={inventory?.customIdFormat}
                                            handlerChangeCustomIdFormat={handlerChangeInventory}
                                            loading={loading}
                                            error={error}
                                        />}
                            </Tab>
                            <Tab eventKey="fields" title="Fields">
                                {loading
                                    ? (<div className="d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" className="align-self-center"/>
                                    </div>)
                                    : error
                                        ? (<div className="d-flex justify-content-center align-items-center">
                                            <Alert variant="danger">{error.message}</Alert>
                                            </div>)
                                        :(<FieldsTab
                                            itemFields={inventory.fields}
                                            handlerChangeFields={handlerChangeInventory}
                                            onShowToast={onShowToast}
                                            loading={loading}
                                            error={error}
                                        />)}
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
                            <Tab eventKey="items" title="Items" mountOnEnter>
                                <ItemsTab
                                    inventoryId={inventory.id}
                                    handlerClickRecord={handlerClickRecord}
                                    handlerAddRecord={handlerAddRecord}
                                    handlerDeleteRecords={handlerDeleteRecords}
                                    itemFields={inventory.fields}
                                />
                            </Tab>
                            <Tab eventKey="discussion" title="Discussion" mountOnEnter>
                                <DiscussionTab inventoryId={inventory.id} onShowToast={onShowToast}/>
                            </Tab>
                            <Tab eventKey="stats" title="Stats">
                                {loading
                                    ? (<div className="d-flex justify-content-center align-items-center">
                                        <Spinner animation="border" className="align-self-center"/>
                                    </div>)
                                    : error
                                        ? (<div className="d-flex justify-content-center align-items-center">
                                            <Alert variant="danger">{error.message}</Alert>
                                            </div>)
                                        : <StatsTab inventory={inventory}
                                        /> }
                            </Tab>
                            <Tab eventKey="export" title="Export"></Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={validation}> { inventoryId ? 'Update' : 'Create' } </Button>
                    </Modal.Footer>
                </>)}
            </FormValidation>
        </Modal>
    );
}