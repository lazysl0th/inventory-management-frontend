import { useTranslation } from 'react-i18next'
import { VscAdd } from 'react-icons/vsc'
import FieldFieldset from './FieldFieldset'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { DroppableFieldset } from '@/shared/ui/DragDrop'
import { Button } from '@/shared/ui/Button'
import { Tooltip } from '@/shared/ui/Tooltip'
import { IField } from '@/entities/inventory'

const initialField: IField = {
    id: '',
    title: '',
    description: '',
    type: null,
    showInTable: false,
    isDeleted: false,
    order: 0,
}

const FieldsFieldset = () => {
    const { t } = useTranslation('inventory')

    const { field: fieldsField } = useFormikApi<IField[]>('fields')

    const fieldSortableHandlers = useSortableHandlers<IField>(
        fieldsField.value,
        fieldsField.setValue,
        (field) => field.id
    )

    const addFieldhandle = () => {
        fieldSortableHandlers.addHandler({
            ...initialField,
            id: crypto.randomUUID(),
            isNew: true,
        })
    }

    return (
        <>
            <DroppableFieldset id='fields'>
                {fieldsField.value.map((field) => (
                    <FieldFieldset key={field.id} field={field} />
                ))}
            </DroppableFieldset>
            <div className='d-flex justify-content-between align-items-center mt-3'>
                <Button
                    name='addField'
                    placement='top'
                    overlay={<Tooltip tooltip='Add field' />}
                    variant='outline-success'
                    onClick={addFieldhandle}
                >
                    <VscAdd />
                </Button>
            </div>
        </>
    )
}

export default FieldsFieldset
