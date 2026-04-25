import { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { useDispatch } from 'react-redux'
import { FormikConfig } from 'formik'
import './Item.scss'
import { Typename } from '@/shared/ui/DataTable'
import { getFormatCustomId } from '../lib/itemHelpers'
import { itemSchema } from '../model/validation'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import {
    InventoryFieldType,
    useInventoryAccess,
    useInventoryData,
} from '@/entities/inventory'
import {
    IItemForm,
    resetActiveItem,
    setActiveItem,
    useCreateItemMutation,
    useGetItemQuery,
    useUpdateItemMutation,
} from '@/entities/item'
import { useCurrentUser } from '@/entities/user'
import { LikeButton } from '@/features/likeItem'
import { Checkbox, FormProvider, Input, SubmitButton } from '@/shared/ui/Form'

const initialValuesTemplate = {
    customId: '',
}

const Item = () => {
    const { t } = useTranslation('item')
    const { itemId } = useParams()
    const location = useLocation()
    const modalView = location.state?.modal
    const dispatch = useDispatch()
    const { currentUser } = useCurrentUser()

    const {
        data: inventory,
        isLoading: inventoryIsLoading,
        error: inventoryError,
        isSuccess: inventoryIsSuccess,
        inventoryId,
    } = useInventoryData()

    const {
        data: item,
        isLoading: itemIsLoading,
        error: itemError,
        isSuccess: itemIsSuccess,
    } = useGetItemQuery(
        inventoryId && itemId && itemId !== 'new'
            ? { inventoryId, itemId }
            : skipToken
    )

    const { isAdmin, isOwner, hasWriteAccess } = useInventoryAccess(inventory)

    const customIdRegexPattern = inventory?.customIdFormat.parts
        .map((partId) => getFormatCustomId(partId))
        .join('')

    useEffect(() => {
        if (itemId) dispatch(setActiveItem({ id: Number(itemId) }))
        return () => {
            dispatch(resetActiveItem())
        }
    }, [dispatch])

    const existingItemValuesMap = new Map(
        item?.values.map((value) => [value.field.id, value])
    )

    const itemValues =
        inventory?.fields.map((field) => {
            const existingValue = existingItemValuesMap.get(field.id)
            if (existingValue) {
                return field.type === InventoryFieldType.Boolean
                    ? {
                          ...existingValue,
                          value: existingValue.value === 'true',
                      }
                    : existingValue
            }
            return {
                field: field,
                value: field.type === InventoryFieldType.Boolean ? false : '',
            }
        }) ?? []

    const { openRecord } = useRecordHandlers(Typename.Item)

    const initialItem: IItemForm = {
        ...initialValuesTemplate,
        values: itemValues,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        owner: currentUser?.name ?? '',
    }

    const [createItem] = useCreateItemMutation()
    const [updateItem] = useUpdateItemMutation()

    const submitHandler = async (formValues: IItemForm) => {
        if (!inventoryId) return
        const { createdAt, updatedAt, values, owner, ...itemData } = formValues
        const payload = {
            ...itemData,
            inventoryId: Number(inventoryId),
            values: values.map(({ field, ...value }) => ({
                ...value,
                fieldId: field.id,
            })),
        }
        if (!itemData.id) {
            const item = await createItem(payload).unwrap()
            dispatch(setActiveItem({ id: item.id }))
            openRecord(item.id, true)
        } else {
            await updateItem({
                ...payload,
                id: Number(itemId),
            }).unwrap()
        }
    }

    const formikConfig: FormikConfig<IItemForm> = {
        initialValues: item
            ? {
                  ...item,
                  customId: item.customId || '',
                  values: itemValues,
                  createdAt: new Date(item.createdAt).toLocaleString(),
                  updatedAt: new Date(item.updatedAt).toLocaleString(),
                  owner: item.owner?.name || '',
              }
            : initialItem,
        onSubmit: submitHandler,
        enableReinitialize: true,
        validationSchema: itemSchema(new RegExp(`^${customIdRegexPattern}$`)),
    }

    return (
        <FormProvider<IItemForm> config={formikConfig} id='item'>
            <fieldset disabled={!isAdmin && !isOwner && !hasWriteAccess}>
                <Row
                    className={`g-3 justify-content-end overflow-auto ${modalView ? 'item-modal' : 'item'}`}
                >
                    <Col xs={12}>
                        <Input name='customId' label={t('labels.customId')} />
                    </Col>
                    {itemValues
                        .toSorted((a, b) => a.field.order - b.field.order)
                        .map((value, index) => {
                            return (
                                <Col xs={12} key={value.field.id}>
                                    {value.field.type ===
                                    InventoryFieldType.Boolean ? (
                                        <Checkbox
                                            name={`values[${index}].value`}
                                            label={value.field.title}
                                        />
                                    ) : (
                                        <Input
                                            name={`values[${index}].value`}
                                            label={value.field.title}
                                            as={
                                                value.field.type ===
                                                InventoryFieldType.LongText
                                                    ? 'textarea'
                                                    : undefined
                                            }
                                            rows={
                                                value.field.type ===
                                                InventoryFieldType.LongText
                                                    ? 2
                                                    : undefined
                                            }
                                            type={
                                                value.field.type ===
                                                InventoryFieldType.File
                                                    ? 'file'
                                                    : 'text'
                                            }
                                        />
                                    )}
                                </Col>
                            )
                        })}
                    <Col xs={12} md={4}>
                        <Input
                            name='owner'
                            label={t('labels.owner')}
                            disabled
                            readOnly
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Input
                            name='createdAt'
                            label={t('labels.createdBy')}
                            disabled
                            readOnly
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Input
                            name='updatedAt'
                            label={t('labels.updateAt')}
                            disabled
                            readOnly
                        />
                    </Col>
                    <Col
                        xs={2}
                        className='d-flex justify-content-end align-items-end'
                    >
                        <LikeButton />
                    </Col>
                </Row>
                <Row className={!modalView ? 'mt-5' : 'mt-0'}>
                    <Col className='d-flex justify-content-end'>
                        <SubmitButton
                            containerId={modalView ? 'item-modal--footer' : ''}
                            label={
                                item?.id
                                    ? t('buttons.update')
                                    : t('buttons.create')
                            }
                            form='item'
                        />
                    </Col>
                </Row>
            </fieldset>
        </FormProvider>
    )
}

export default Item
