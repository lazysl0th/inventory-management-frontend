import { useState, useEffect, useContext, forwardRef, useImperativeHandle, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab } from 'react-bootstrap';
import { GET_INVENTORY, UPDATE_INVENTORY_NEW, GET_ITEMS } from '../../graphql/queries';
import { useAutoSave } from '../../hooks/useAutoSave';
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
import { mergeInventory } from '../../utils/utils'

function Inventory({
    isOpen,
    onOpenTooltip,
    categories,
    loadTags,
    inventoryId,
    handlerCloseView,
    handlerClickRecord,
    handlerCreateInventory,
    handlerAddRecord,
    handlerDeleteRecords,
    onShowToast,
    onUploadImage
}, ref) {

    const currentUser = useContext(CurrentUserContext);
    const formikRef = useRef();
    const timerRef = useRef(null);
    const [inventory, setInventory] = useState(initialStateInventory)
    const [version, setVersion] = useState();
    const [activeTab, setActiveTab] = useState('details');

    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY);
    const [updateInventory] = useMutation(UPDATE_INVENTORY_NEW, {
            refetchQueries: [{ query: GET_ITEMS, variables: { inventoryId: inventoryId } }],
            awaitRefetchQueries: true,
        });
    
    const inventoryData = data?.inventory || {}
    
    useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

    useEffect(() => {
        if (inventoryId) {
            loadInventory({ variables: { id: inventoryId } })
            loadTags()
            updateStateInventory(inventoryData);
            formikRef.current.setValues({ title: inventoryData.title || '', category: inventoryData.category || '', })
        } else {
            updateStateInventory({
                owner: {id: currentUser.id, name: currentUser.name} 
            })
        }
    }, [isOpen, data, inventoryId]);

    const updateStateInventory = (inventoryData) => {
        const updated = { ...inventory };
        for (let key in inventoryData) {
            if (key === 'createdAt' || key === 'updatedAt') updated[key] = new Date(+inventoryData[key]).toLocaleString();
            else if (key === 'version') setVersion(inventoryData[key]);
            else updated[key] = inventoryData[key];
        }
        setInventory(updated);
    };

    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setInventory(initialStateInventory);
        setActiveTab('details');
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

    const handleUpdateInventory = async(updatedInventory = inventory, expectedVersion) => {
        const { createdAt, updatedAt, ...data } = updatedInventory;
        try {
            const { data: res } = await updateInventory({
                variables: { 
                    id: data.id,
                    ...(expectedVersion !== undefined ? { expectedVersion } : {}),
                    input: {
                        ...data,
                        tags: data.tags?.map((tag) => ({
                            id: tag.id, name: tag.name,
                        })),
                        fields: data.fields.map((field) => ({
                            id: field.id, 
                            title: field.title, 
                            type: field.type,
                            description: field.description,
                            showInTable: field.showInTable,
                            order: field.order,
                            isDeleted: field.isDeleted, 
                        })),
                        allowedUsers: data.allowedUsers.filter((user) => !isNaN(user.id)).map((user) => ({ id: user.id })),
                    }
                },
            });
            setVersion(res.updateInventory.version);
        } catch (e) {
            console.log(e);
            onOpenTooltip((titleInfoTooltip.ERROR), e.message);
        }
    }

    const forceSaveInventory = async () => {
        const { data: fresh } = await loadInventory({ variables: { id: inventoryId }, fetchPolicy: "network-only", });
        const merged = mergeInventory(fresh.inventory, inventory);
        const updated = await handleUpdateInventory(merged, fresh.inventory.version);
        updateStateInventory(updated);
    };

    const { isDirty, isSaving, errorAutoSave, scheduleSave, flushSave } = useAutoSave(8000, handleUpdateInventory);

    const handlerChangeInventory = ((name, value) => {
        setInventory(prev => {
            const updated = { ...prev, [name]: value, }
            if (inventoryId) scheduleSave(updated, version);
            return updated;
        });
    });

    const validation = async () => {
        const errors = await formikRef.current.validateForm();
        formikRef.current.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
        if (Object.keys(errors).length === 0) formikRef.current.handleSubmit()
        else onShowToast('Заполните обязательные поля', 'bottom-center');
    }

    useImperativeHandle(ref, () => ({ forceSaveInventory }));

    const handleFlashSave = () => {
        flushSave(inventory, version)
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
            onSubmit={inventoryId ? handleFlashSave : handleCreateInventory}
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
                                        : <StatsTab 
                                            inventoryId={inventoryId}
                                            itemsCount={inventory.itemsCount}

                                            /> }
                            </Tab>
                            <Tab eventKey="export" title="Export"></Tab>
                        </Tabs>
                    </Modal.Body>
                    <Modal.Footer>
                        {isSaving && <Spinner animation="border" size="sm" />}
                        {errorAutoSave && onShowToast(errorAutoSave, 'bottom-center')}
                        <Button
                            variant="primary"
                            onClick={validation}
                            disabled={!isDirty}
                        > { inventoryId ? 'Update' : 'Create' } </Button>
                    </Modal.Footer>
                </>)}
            </FormValidation>
        </Modal>
    );
}

export default forwardRef(Inventory);