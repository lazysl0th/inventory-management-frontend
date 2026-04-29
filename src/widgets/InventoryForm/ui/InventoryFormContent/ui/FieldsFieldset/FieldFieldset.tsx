import { Badge, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { SortableFieldset } from '@/shared/ui/DragDrop'
import { useFieldsetActions } from '@/widgets/InventoryForm/lib/useFieldsetAction'
import {
    type IField,
    InventoryFieldType,
} from '@/entities/inventory'
import type { IFieldFieldsetProps } from '@/widgets/InventoryForm/model/types'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'
import { Select } from '@/shared/ui/Form/ui/Select'
import { Input } from '@/shared/ui/Form/ui/Input'
import { Checkbox } from '@/shared/ui/Form/ui/Checkbox'

const FieldFieldset = ({ field }: IFieldFieldsetProps) => {
    const { t } = useTranslation('inventory')

    const { data: inventory } = useInventoryData()

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    const { field: fieldsField } = useFormikApi<IField[]>('fields')

    const fieldSortableHandlers = useSortableHandlers<IField>(
        fieldsField.value,
        fieldsField.setValue,
        (field) => field.id
    )

    const moveUpHandler = () =>
        fieldSortableHandlers.sortHandler(field.order, field.order - 1)
    const moveDownHandler = () =>
        fieldSortableHandlers.sortHandler(field.order, field.order + 1)
    const deleteHandler = () => fieldSortableHandlers.deleteHandler([field.id])

    const sortableActions = useFieldsetActions({
        onMoveUp: moveUpHandler,
        onMoveDown: moveDownHandler,
        onDelete: deleteHandler,
    })

    return (
        <SortableFieldset
            id={field.id}
            index={field.order}
            disabled={!isAdmin && !isOwner}
        >
            <Row className='g-2'>
                <Col xs={12} md={4} lg={3}>
                    <Select
                        name={`fields[${field.order}].type`}
                        label={t('inventory:labels.type')}
                    >
                        <option value='' disabled>
                            {t('inventory:options.type')}
                        </option>
                        {Object.values(InventoryFieldType).map((fieldType) => (
                            <option key={fieldType} value={fieldType}>
                                {fieldType}
                            </option>
                        ))}
                    </Select>
                </Col>
                <Col xs={12} md={4} lg={6}>
                    <Input
                        name={`fields[${field.order}].title`}
                        label={t('inventory:labels.title')}
                        placeholder={t('inventory:placeholders.title')}
                    />
                </Col>
                <Col xs={12} md={4} lg={3}>
                    <Checkbox
                        name={`fields[${field.order}].showInTable`}
                        label={t('inventory:labels.showInTable')}
                    />
                </Col>
                <Col xs={12} md={9}>
                    <Input
                        as='textarea'
                        name={`fields[${field.order}].description`}
                        label={t('inventory:labels.description')}
                        placeholder={t('inventory:placeholders.descriptionField')}
                        rows={2}
                    />
                </Col>

                <Col
                    xs={12}
                    sm={3}
                    className='d-flex flex-column align-items-center align-self-center justify-content-between'
                >
                    <Badge
                        bg='light'
                        text='dark'
                        className='mb-2 w-100 text-center'
                    >
                        {t('inventory:badges.position')} {field.order}
                    </Badge>
                    <ActionButtons size='sm' actions={sortableActions} />
                </Col>
            </Row>
        </SortableFieldset>
    )
}

export default FieldFieldset
