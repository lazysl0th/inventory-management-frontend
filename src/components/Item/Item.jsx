import { useContext, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';
import ItemDetailsTab from './ItemTabs/ItemDetailTabs';
import { initialStateItem } from '../../utils/constants';
import { GET_ITEM, GET_INVENTORY_FIELDS, UPDATE_ITEM } from '../../graphql/queries';
import { CurrentUserContext } from '../../context/CurrentUserContext';

export default function Item({ isOpen, inventoryId, itemId, handlerCloseView, handlerCreateItem, onShowToast, onUploadImage }) {
    const currentUser = useContext(CurrentUserContext);
    const [item, setItem] = useState(initialStateItem)
    const [version, setVersion] = useState();
    const [activeTab, setActiveTab] = useState('details');

    const [loadItem, { data: dataItem, loading: loadingItem, error, reset }] = useLazyQuery(GET_ITEM);
    const [loadInventoryFields, { data: dataInventory, loading: loadingInventory}] = useLazyQuery(GET_INVENTORY_FIELDS);
    const [updateItem] = useMutation(UPDATE_ITEM);

    const itemData = dataItem?.item || {}
    const itemFields = dataInventory?.inventory?.fields || []

    useEffect(() => {
        if (itemId) {
            loadItem({ variables: { id: itemId } })
            updateInitialItem(itemData);
        } else {
            if (inventoryId) loadInventoryFields({ variables: { id: inventoryId } });
            updateInitialItem({
                owner: {id: currentUser.id, name: currentUser.name},
                values: itemFields.map((field) => ({ guid: crypto.randomUUID(), value: '', field: field, }))
            })
            
        }
    }, [isOpen, loadingItem, loadingInventory, itemId]);

    const updateInitialItem = (itemData) => {
        const updated = { ...item };
        for (let key in itemData) {
            if (key === 'createdAt' || key === 'updatedAt') updated[key] = new Date(+itemData[key]).toLocaleString();
            else if (key === 'version') setVersion(itemData[key]);
            else updated[key] = itemData[key];
        }
        setItem(updated);
    };

    const handlerChangeItem = ((name, value) => setItem(prev => ({ ...prev, [name]: value, })));

    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setItem(initialStateItem);
        setActiveTab('details');
    }

    const handleCreateItem = () => {
        const { createdAt, updatedAt, values, ...newItem } = item;
        handlerCreateItem({
            inventoryId: inventoryId,
            ...newItem,
            values: values.map(value => ({fieldId: value.field.id, value: value.value})),
        });
    }

    const handleUpdateItem = async() => {
        const { createdAt, updatedAt, values, ...updatedItem } = item;
        try {
            const { data } = await updateItem({
                variables: { 
                    id: updatedItem.id,
                    expectedVersion: version,
                    input: {
                        ...updatedItem,
                        values: values.map(value => ({fieldId: value.field.id, value: value.value})),
                    }
                },
            });
            updateInitialItem(data.updateItem);
            setVersion(data.updateItem.version)

        } catch (e) {

        }
    }

    return (

        
        <Modal
            show={isOpen}
            onHide={handleCloseView}
            size="lg"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body className={(loadingItem || error) && "align-self-center"}>
                <Tabs
                    id={''}
                    className="mb-3"
                    activeKey={activeTab}
                    onSelect={setActiveTab}
                    fill
                >
                    <Tab eventKey="details" title="Details">
                        {loadingItem
                            ? <Spinner animation="border"/>
                            : error
                                ? (<div className="d-flex justify-content-center align-items-center">
                                        <Alert variant="danger">{error.message}</Alert>
                                    </div>)
                                : <ItemDetailsTab
                                    item={item}
                                    handlerChangeItem={handlerChangeItem}
                                    onShowToast={onShowToast}
                                    onUploadImage={onUploadImage}
                                /> }
                    </Tab>
                </Tabs>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={itemId ? handleUpdateItem : handleCreateItem}> { itemId ? 'Update' : 'Create' } </Button>
            </Modal.Footer>
        </Modal>
    );
}