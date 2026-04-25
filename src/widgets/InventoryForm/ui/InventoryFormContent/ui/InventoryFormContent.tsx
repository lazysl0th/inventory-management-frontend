import { Tab } from 'react-bootstrap'
import { useEffect } from 'react'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useAutoSave from '@/shared/lib/hooks/useAutoSave'
import { SETTINGS } from '@/shared/config/constants'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { DragDropContext } from '@/shared/ui/DragDrop'
import DragDropMonitor from '@/features/dragDrop/lib/DragDropMonitor'
import { IField, IInventoryForm, IPartId } from '@/entities/inventory'
import {
    IDragDropHandlers,
    InventoryTabs,
} from '@/widgets/InventoryForm/model/types'
import { inventoryFormTabs } from '@/widgets/InventoryForm/model/inventoryFromContentConfig'

const InventoryFormContent = () => {
    const { form } = useFormikApi<IInventoryForm>()

    const { scheduleSave, cancelSave } = useAutoSave<IInventoryForm>({
        delay: SETTINGS.delay.autoSave,
        saveFn: form.submitForm,
    })

    useEffect(() => {
        if (form.dirty) scheduleSave()
        if (!form.dirty) cancelSave()
        return () => {
            cancelSave()
        }
    }, [form.dirty, form.values])

    const { field: partsIdField } = useFormikApi<IPartId[]>(
        'customIdFormat.parts'
    )
    const { field: fieldsField } = useFormikApi<IField[]>('fields')

    const partsIdSortableHandlers = useSortableHandlers<IPartId>(
        partsIdField.value,
        partsIdField.setValue,
        (partId) => partId.guid
    )
    const fieldsSortableHandlers = useSortableHandlers<IField>(
        fieldsField.value,
        fieldsField.setValue,
        (field) => field.id
    )

    const sortableTabHandlers: Partial<
        Record<InventoryTabs, IDragDropHandlers>
    > = {
        [InventoryTabs.CustomId]: partsIdSortableHandlers,
        [InventoryTabs.Fields]: fieldsSortableHandlers,
    }

    return (
        <Tab.Content>
            {Object.entries(inventoryFormTabs).map(([eventKey, Component]) => {
                const sortableHandlers =
                    sortableTabHandlers[eventKey as InventoryTabs]
                return sortableHandlers ? (
                    <Tab.Pane eventKey={eventKey} key={eventKey}>
                        <DragDropContext>
                            <DragDropMonitor
                                onDelete={sortableHandlers.deleteHandler}
                                onSort={sortableHandlers.sortHandler}
                            />
                            <Component />
                        </DragDropContext>
                    </Tab.Pane>
                ) : (
                    <Tab.Pane eventKey={eventKey} key={eventKey}>
                        <Component />
                    </Tab.Pane>
                )
            })}
        </Tab.Content>
    )
}

export default InventoryFormContent
