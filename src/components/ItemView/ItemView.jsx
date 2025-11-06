import { useContext, useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert, Tabs, Tab, } from 'react-bootstrap';
import ItemDetailsTab from './ItemTabs.jsx/ItemDetailTab.jsx/ItemDetailTabs';
import ChatTab from '../ChatTab/ChatTab';
import { initialStateItem } from '../../utils/constants';
import { GET_ITEM, GET_INVENTORY_FIELDS, UPDATE_ITEM } from '../../graphql/queries';
import { CurrentUserContext } from '../../context/CurrentUserContext';

function ItemView({ isOpen, inventoryId, itemId, handlerCloseView, handlerCreateItem }) {
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
            //if (['chat'].includes(activeInventoryTab)) {
                //loadItem({ variables: { [`${selectedItem.__typename.toLowerCase()}Id`]: selectedItem.id } })
            //}
            //else loadItem({ variables: { id: selectedItem.id } })
        } else {
            if (inventoryId) loadInventoryFields({ variables: { id: inventoryId } });
            updateInitialItem({
                owner: {id: currentUser.id, name: currentUser.name},
                values: itemFields.map((field) => ({ guid: crypto.randomUUID(), value: '', field: field, }))
            })
            
        }
    }, [isOpen, loadingItem, loadingInventory, itemId]);

    const updateInitialItem = (itemData) => {
        for(let key in itemData) {
                (key === 'createdAt' || key === 'updatedAt')
                    ? handlerChangeItem(key, new Date(+itemData[key]).toLocaleString())
                    : (key === 'version') 
                        ? setVersion(itemData[key])
                        : handlerChangeItem(key, itemData[key]);
        }
    }
    
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
            size="xl"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{}</Modal.Title>
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
                                ? <Alert variant="danger">{error.message}</Alert>
                                : <ItemDetailsTab
                                    item={item}
                                    //itemFields={itemFields}
                                    handlerChangeItem={handlerChangeItem}
                                /> }
                    </Tab>
                    <Tab eventKey="chat" title="Chat">
                        {loadingItem
                            ? <Spinner animation="border" className="align-self-center"/>
                            : error
                                ? <Alert variant="danger" className="align-self-center">{error.message}</Alert>
                                : <ChatTab
                                    comments={[]}
                                    onAddComment={async (text) => {
                                        // 🔹 Здесь потом будет GraphQL mutation
                                        console.log("Добавить комментарий:", text);
                                    }}
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

export default ItemView;
