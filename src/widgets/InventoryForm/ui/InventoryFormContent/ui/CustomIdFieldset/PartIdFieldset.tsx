import { useTranslation } from 'react-i18next'
import { Badge, Col, Row } from 'react-bootstrap'
import { type ChangeEventHandler, lazy, Suspense } from 'react'
import { ActionButtons } from '@/shared/ui/ActionButtons'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import useSortableHandlers from '@/shared/lib/hooks/useSortableHandlers'
import { SortableFieldset } from '@/shared/ui/DragDrop'
import { EmojiButton } from '@/shared/ui/EmojiButton'
import {
    PartIdFormat,
    PartIdTypes,
    SeparatorPosition,
} from '@/entities/inventory'
import type { IPartId } from '@/entities/inventory'
import type { IPartIdFieldsetProps } from '@/widgets/InventoryForm/model/types'
import { partIdSettings } from '@/widgets/InventoryForm/model/partIdConfig'
import { useFieldsetActions } from '@/widgets/InventoryForm/lib/useFieldsetAction'
import { getPartIdExample } from '@/widgets/InventoryForm/lib/getPartIdExample'
import { Select } from '@/shared/ui/Form/ui/Select'
import { Input } from '@/shared/ui/Form/ui/Input'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'

const PartIdFieldset = ({ partId, index }: IPartIdFieldsetProps) => {
    const { t } = useTranslation('inventory')

    const { data: inventory } = useInventoryData()

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    const formats = partId.type ? partIdSettings[partId.type].formats : null

    const { field: partsId } = useFormikApi<IPartId[]>('customIdFormat.parts')

    const { field: partIdType } = useFormikApi<string>(
        `customIdFormat.parts[${index}].type`
    )

    const { field: partIdFormat } = useFormikApi<string>(
        `customIdFormat.parts[${index}].format`
    )

    const { field: partIdValue } = useFormikApi<string>(
        `customIdFormat.parts[${index}].value`
    )

    const partsIdSortableHandlers = useSortableHandlers<IPartId>(
        partsId.value,
        partsId.setValue,
        (partId) => partId.guid
    )

    const moveUpHandler = () =>
        partsIdSortableHandlers.sortHandler(index, index - 1)
    const moveDownHandler = () =>
        partsIdSortableHandlers.sortHandler(index, index + 1)
    const deleteHandler = () =>
        partsIdSortableHandlers.deleteHandler([partId.guid])

    const sortableActions = useFieldsetActions({
        onMoveUp: moveUpHandler,
        onMoveDown: moveDownHandler,
        onDelete: deleteHandler,
    })

    const handleChangePartIdType: ChangeEventHandler<HTMLSelectElement> = (
        e
    ) => {
        partIdType.onChange(e)
        partIdFormat.setValue('')
    }

    const handleChangePartIdFormat: ChangeEventHandler<
        HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    > = (e) => {
        const newFormat = e.target.value as PartIdFormat
        partIdFormat.onChange(e)
        partIdValue.setValue(getPartIdExample({ ...partId, format: newFormat }))
    }

    return (
        <SortableFieldset
            id={partId.guid}
            index={index}
            disabled={!isAdmin && !isOwner}
        >
            <Row className='g-2'>
                <Col xs={12} md={partId.type === PartIdTypes.Sequence ? 4 : 6}>
                    <Select
                        name={`customIdFormat.parts[${index}].type`}
                        label={t('inventory:labels.type')}
                        helpText={t(
                            partId.type ? partIdSettings[partId.type].hint : ''
                        )}
                        onChange={handleChangePartIdType}
                    >
                        <option value='' disabled>
                            {t('inventory:options.type')}
                        </option>
                        {Object.values(PartIdTypes).map((partIdType) => (
                            <option key={partIdType} value={partIdType}>
                                {t(`${partIdSettings[partIdType].label}`)}
                            </option>
                        ))}
                    </Select>
                </Col>
                <Col
                    xs={partId.type === PartIdTypes.Sequence ? 7 : 12}
                    md={partId.type === PartIdTypes.Sequence ? 5 : 6}
                >
                    
                    {partId.type && partId.type === PartIdTypes.Text ? (
                        <Suspense fallback={<div>Загрузка смайликов...</div>}>
                        <Input
                            label={t('inventory:labels.format')}
                            name={`customIdFormat.parts[${index}].format`}
                            onChange={handleChangePartIdFormat}
                            helpText={t(
                                partId.type &&
                                    partIdSettings[partId.type].formatHint
                            )}
                        >
                            
                                <EmojiButton
                                    formatValue={partId.format}
                                    onEmojiClick={partIdFormat.setValue}
                                />
                        </Input>
                        </Suspense>
                    ) : (
                        <Select
                            label={t('inventory:labels.format')}
                            name={`customIdFormat.parts[${index}].format`}
                            disabled={
                                partId.type === null ||
                                partIdSettings[partId.type].formats === null
                            }
                            onChange={handleChangePartIdFormat}
                            helpText={t(
                                partId.type
                                    ? partIdSettings[partId.type].formatHint
                                    : ''
                            )}
                        >
                            <option value='' disabled>
                                {t('inventory:options.format')}
                            </option>
                            {formats !== null &&
                                Object.entries(formats).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {t(`${label}`)}
                                    </option>
                                ))}
                        </Select>
                    )}
                </Col>
                {partId.type === PartIdTypes.Sequence && (
                    <Col xs={5} md={3}>
                        <Input
                            name={`customIdFormat.parts[${index}].currentSequence`}
                            label='Initial value'
                            placeholder={t('inventory:placeholders.initialValue')}
                        />
                    </Col>
                )}
                <Col xs={12} sm={5}>
                    <Input
                        name={`customIdFormat.parts[${index}].separator`}
                        label={t('inventory:labels.separator')}
                        placeholder={t('inventory:placeholders.separator')}
                        helpText={t('inventory:hints.separator')}
                    />
                </Col>
                <Col xs={6} sm={4}>
                    <Select
                        name={`customIdFormat.parts[${index}].position`}
                        label={t('inventory:labels.position')}
                        helpText={t('inventory:hints.position')}
                    >
                        <option value='' disabled>
                            {t('inventory:options.separator')}
                        </option>
                        {Object.entries(SeparatorPosition).map(
                            ([value, label]) => (
                                <option key={value} value={value}>
                                    {t(`${label}`)}
                                </option>
                            )
                        )}
                    </Select>
                </Col>
                <Col
                    xs={6}
                    sm={3}
                    className='d-flex flex-column align-items-center align-self-center justify-content-between'
                >
                    <ActionButtons size='sm' actions={sortableActions} />
                    <Badge
                        bg='light'
                        text='dark'
                        className='my-3 w-100 text-center text-truncate'
                    >
                        {partIdValue.value}
                    </Badge>
                </Col>
            </Row>
        </SortableFieldset>
    )
}

export default PartIdFieldset
