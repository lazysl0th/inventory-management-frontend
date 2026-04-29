import { ListGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GrUpdate } from 'react-icons/gr'
import { MdSaveAlt } from 'react-icons/md'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { closeModal, getModal, showToast } from '@/shared/model/ui'
import {
    useLazyGetInventoryQuery,
    useUpdateInventoryMutation,
} from '@/entities/inventory'

const VersionConflictDialog = () => {
    const match = useMatch('/inventories/:inventoryId')
    const inventoryId = match?.params.inventoryId
    const [container, setContainer] = useState<HTMLElement | null>(null)
    const dispatch = useDispatch()
    const { payload } = useSelector(getModal)
    const { t } = useTranslation('common')

    const [getInventory] = useLazyGetInventoryQuery()
    const [updateInventory] = useUpdateInventoryMutation()

    const handleRewrite = async () => {
        if (!payload || !inventoryId) return
        try {
            const inventory = await getInventory({ inventoryId }).unwrap()
            if (inventory) {
                await updateInventory({
                    ...payload,
                    version: inventory.version,
                }).unwrap()
                dispatch(closeModal())
                dispatch(showToast({message: t('common:notifications.successAction', { count: 1, actionType: 'overwrited', recordType: 'inventory' })}))
            }
        } catch (e) {
            dispatch(closeModal())
            dispatch(showToast({message: t('common:notifications.eerorAction', { count: 1, actionType: 'overwriting', recordType: 'inventory' })}))
            console.log(e)
        }
    }

    const handleClose = async() => {
        dispatch(closeModal());
        dispatch(showToast({message: t('common:notifications.successAction', { count: 1, actionType: 'updated', recordType: 'inventory' })}))
    }

    useEffect(() => {
        setContainer(document.getElementById('infoTooltip--footer'))
    }, [])

    return (
        <>
            <ListGroup variant='flush'>
                <p className='mb-2'>{t('common:versionConflict.paragraph')}</p>
                <ListGroup.Item className='d-flex align-items-start'>
                    <div>
                        <strong>{t('common:versionConflict.listItems.update')}</strong>{' '}
                        — {t('common:versionConflict.listItems.textUpdate')}
                    </div>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex align-items-start'>
                    <div>
                        <strong>
                            {t('common:versionConflict.listItems.overwrite')}
                        </strong>{' '}
                        — {t('common:versionConflict.listItems.textOverwrite')}
                    </div>
                </ListGroup.Item>
            </ListGroup>

            {container &&
                createPortal(
                    <>
                        <Button
                            variant='dark'
                            onClick={handleClose}
                        >
                            <GrUpdate /> {t('common:actions.update')}
                        </Button>
                        <Button variant='danger' onClick={handleRewrite}>
                            <MdSaveAlt /> {t('common:actions.overwrite')}
                        </Button>
                    </>,
                    container
                )}
        </>
    )
}

export default VersionConflictDialog
