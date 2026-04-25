import { ListGroup } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GrUpdate } from 'react-icons/gr'
import { MdSaveAlt } from 'react-icons/md'
import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatch } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'
import { closeModal, getModal } from '@/shared/model/ui'
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
            }
        } catch (e) {
            dispatch(closeModal())
            console.log(e)
        }
    }

    useEffect(() => {
        setContainer(document.getElementById('infoTooltip--footer'))
    }, [])

    return (
        <>
            <ListGroup variant='flush'>
                <p className='mb-2'>{t('versionConflict.paragraph')}</p>
                <ListGroup.Item className='d-flex align-items-start'>
                    <div>
                        <strong>{t('versionConflict.listItems.update')}</strong>{' '}
                        — {t('versionConflict.listItems.textUpdate')}
                    </div>
                </ListGroup.Item>
                <ListGroup.Item className='d-flex align-items-start'>
                    <div>
                        <strong>
                            {t('versionConflict.listItems.rewrite')}
                        </strong>{' '}
                        — {t('versionConflict.listItems.textRewrite')}
                    </div>
                </ListGroup.Item>
            </ListGroup>

            {container &&
                createPortal(
                    <>
                        <Button
                            variant='dark'
                            onClick={() => dispatch(closeModal())}
                        >
                            <GrUpdate /> {t('versionConflict.buttons.update')}
                        </Button>
                        <Button variant='danger' onClick={handleRewrite}>
                            <MdSaveAlt /> {t('versionConflict.buttons.rewrite')}
                        </Button>
                    </>,
                    container
                )}
        </>
    )
}

export default VersionConflictDialog
