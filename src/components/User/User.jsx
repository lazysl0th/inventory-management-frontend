import { useContext, useState, useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Modal, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ItemDetailsTab from './ItemTabs/ItemDetailTabs';
import { initialStateItem, titleInfoTooltip } from '../../utils/constants';
import { GET_ITEM, UPDATE_ITEM } from '../../graphql/itemQuery';
import { GET_INVENTORY_INFO } from '../../graphql/inventoryQueries'
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { useAutoSave } from '../../hooks/useAutoSave';
import { mergeItem } from '../../utils/utils';
import useAccess from '../../hooks/useAccess';

function User({
    isOpen,
    userId,
    handlerCloseView,
    onShowToast,
}) {
    const currentUser = useContext(CurrentUserContext);
    const timerRef = useRef(null);
    const [item, setItem] = useState(initialStateItem)
    const [version, setVersion] = useState();
    const { t } = useTranslation("item");

    const [loadItem, { data: dataItem, loading: loadingItem, error, reset }] = useLazyQuery(GET_ITEM);
    const [loadInventory, { data: dataInventory, loading: loadingInventory}] = useLazyQuery(GET_INVENTORY_INFO);
    const [updateItem] = useMutation(UPDATE_ITEM);

    const itemData = dataItem?.item || {}
    const itemFields = dataInventory?.inventory?.fields || []
    const inventoryCustomIdFormat = dataInventory?.inventory?.customIdFormat || {}

    const { readOnly, readAccess, writeAccess } = useAccess([dataInventory?.inventory]);

    useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current); }; }, []);

    useEffect(() => {
        if (itemId) {
            loadItem({ variables: { id: itemId } })
            updateStateItem(itemData);
        } else {
            updateStateItem({
                owner: {id: currentUser.id, name: currentUser.name},
                values: itemFields.map((field) => ({ guid: crypto.randomUUID(), value: '', field: field, }))
            })
        }
    }, [isOpen, dataItem, itemId]);
    
    useEffect(() => {
        if (inventoryId) {
            loadInventory({ variables: { id: inventoryId } });
        }
    }, [isOpen, dataInventory, inventoryId]);

    const updateStateItem = (itemData) => {
        const updated = { ...item };
        for (let key in itemData) {
            if (key === 'createdAt' || key === 'updatedAt') updated[key] = new Date(+itemData[key]).toLocaleString();
            else if (key === 'version') setVersion(itemData[key]);
            else updated[key] = itemData[key];
        }
        setItem(updated);
    };

    const handleCloseView = () => {
        handlerCloseView();
        reset?.();
        setItem(initialStateItem);
        cancelSave()
    }

    const handleCreateItem = () => {
        const { createdAt, updatedAt, values, ...newItem } = item;
        handlerCreateItem({
            inventoryId: inventoryId,
            ...newItem,
            values: values.map(value => ({fieldId: value.field.id, value: value.value})),
        });
    }

    const handleUpdateItem = async(updatedItem = item, expectedVersion) => {
        const { createdAt, updatedAt, likesCount, likedByMe, values, ...data } = updatedItem;
        try {
            const { data: res } = await updateItem({
                variables: { 
                    id: data.id,
                    ...(expectedVersion !== undefined ? { expectedVersion } : {}),
                    input: {
                        ...data,
                        inventoryId: inventoryId,
                        values: values.map(value => ({fieldId: value.field.id, value: value.value})),
                    }
                },
            });
            updateStateItem(res.updateItem);
            setVersion(res.updateItem.version)
        } catch (e) {
            console.log(e);
            onOpenTooltip(t(`${titleInfoTooltip.ERROR}`), e.message);
        }
    }

    const forceSaveItem = async () => {
        const { data: fresh } = await loadItem({ variables: { id: itemId }, fetchPolicy: "network-only", });
        const merged = mergeItem(fresh.item, item);
        await handleUpdateItem(merged, fresh.item.version);
    };

    const { isDirty, isSaving, errorAutoSave, scheduleSave, flushSave, cancelSave } = useAutoSave(8000, handleUpdateItem);

    const handlerChangeItem = ((name, value) => {
        setItem(prev => { 
            const updated = { ...prev, [name]: value, }
            if (itemId) scheduleSave(updated, version);
            return updated;
        })
    });

    const handleFlashSave = () => {
        flushSave(item, version)
    }

    useImperativeHandle(ref, () => ({ forceSaveItem }));

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
                            customIdFormat={inventoryCustomIdFormat}
                            readAccess={readAccess}
                            disabled={!!(readOnly && !writeAccess && itemId)}
                        /> }
            </Modal.Body>
            <Modal.Footer>
                {isSaving && <Spinner animation="border" size="sm" />}
                {errorAutoSave && onShowToast(errorAutoSave, 'bottom-center')}
                <Button disabled={!isDirty && itemId} variant="dark" onClick={itemId ? handleFlashSave : handleCreateItem}> { itemId ? 'Update' : 'Create' } </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default User;