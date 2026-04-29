import { Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { VscAdd } from 'react-icons/vsc'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { DroppableFieldset } from '@/shared/ui/DragDrop'
import { Button } from '@/shared/ui/Button'
import { Tooltip } from '@/shared/ui/Tooltip'
import type { IPartId } from '@/entities/inventory'
import PartIdFieldset from './PartIdFieldset'

const initialPartId: IPartId = {
    guid: '',
    type: null,
    format: null,
    separator: '',
    currentSequence: '',
    value: '',
    order: 0,
    position: null,
}

const CustomIdFieldset = () => {
    const { t } = useTranslation('common')

    const { field: partsId } = useFormikApi<IPartId[]>('customIdFormat.parts')
    const { field: summary } = useFormikApi<string>('customIdFormat.summary')

    const partIdSortableHandlers = useSortableHandlers<IPartId>(
        partsId.value,
        partsId.setValue,
        (partId) => partId.guid
    )

    const addPartIdHandle = () => {
        partIdSortableHandlers.addHandler({
            ...initialPartId,
            guid: crypto.randomUUID(),
        })
    }

    useEffect(() => {
        summary.setValue(partsId.value.map((partId) => partId.value).join(''))
    }, [partsId.value])

    return (
        <>
            <DroppableFieldset id='customId'>
                {partsId.value.map((partId, index) => (
                    <PartIdFieldset
                        key={partId.guid}
                        partId={partId}
                        index={index}
                    />
                ))}
            </DroppableFieldset>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button
                    name='addPartId'
                    placement='top'
                    overlay={
                        <Tooltip
                            tooltip={t('common:actions.addRecord', {
                                recordType: 'partId',
                            })}
                        />
                    }
                    variant='outline-success'
                    onClick={addPartIdHandle}
                >
                    <VscAdd />
                </Button>
                {true && (
                    <Badge bg='dark' className='p-2'>
                        {t('inventory:badges.example')}&nbsp;{summary.value}
                    </Badge>
                )}
            </div>
        </>
    )
}

export default CustomIdFieldset
