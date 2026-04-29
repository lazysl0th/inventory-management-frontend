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
} from '@/entities/inventory'
import {
    type IItemForm,
    type IUpdateItemData,
    resetActiveItem,
    setActiveItem,
    type TCreateItemData,
    useCreateItemMutation,
    useGetItemQuery,
    useUpdateItemMutation,
} from '@/entities/item'
import { LikeButton } from '@/features/likeItem'
import { showToast } from '@/shared/model/ui'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'
import { FormProvider } from '@/shared/ui/Form/ui/FormProvider'
import { Input } from '@/shared/ui/Form/ui/Input'
import { Checkbox } from '@/shared/ui/Form/ui/Checkbox'
import { SubmitButton } from '@/shared/ui/Form/ui/SubmitButton'

const initialValuesTemplate = {
    customId: '',
}

const Item = () => {
    const { t } = useTranslation(['item', 'common'])
    const { itemId } = useParams()
    const location = useLocation()
    const modalView = location.state?.modal
    const dispatch = useDispatch()
    const { currentUser } = useCurrentUser()

    const {
        data: inventory,
        inventoryId,
    } = useInventoryData()

    const {
        data: item,
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

    const create = async(payload: TCreateItemData) => {
        try {
            const item = await createItem(payload).unwrap()
            dispatch(setActiveItem({ id: item.id }))
            dispatch(showToast({message: t('common:notifications.successAction', { count: 1, actionType: 'created', recordType: 'item' })}))
            openRecord(item.id, true)
        } catch (e) {
            dispatch(showToast({message: t('common:notifications.errorAction', { count: 1, actionType: 'creating', recordType: 'item' })}))
            console.log(e)
        }
    }

    const update = async(payload: IUpdateItemData) => {
        try {
            await updateItem(payload).unwrap()
            dispatch(showToast({message: t('common:notifications.successAction', { count: 1, actionType: 'updated', recordType: 'item' })}))
        } catch(e) {
            dispatch(showToast({message: t('common:notifications.errorAction', { count: 1, actionType: 'updating', recordType: 'item' })}))
            console.log(e)
        }
    }

    const preparePayload = (formValues: IItemForm, inventoryId: string | number) => {
        const { createdAt, updatedAt, values, owner, ...itemData } = formValues;
        
        return {
            ...itemData,
            inventoryId: Number(inventoryId),
            values: values.map(({ field, ...value }) => ({
                ...value,
                fieldId: field.id,
            })),
        };
    };

    const submitHandler = async (formValues: IItemForm) => {
        if (!inventoryId) return
        const payload = preparePayload(formValues, inventoryId);
        if (!payload.id) {
            await create(payload)
        } else {
            await update({id: payload.id, ...payload})
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
        validationSchema: itemSchema(new RegExp(`^${customIdRegexPattern}$`), !itemId),
    }

    return (
        <FormProvider<IItemForm> config={formikConfig} id='item'>
            <fieldset disabled={!isAdmin && !isOwner && !hasWriteAccess}>
                <Row
                    className={`g-3 justify-content-end overflow-auto ${modalView ? 'item-modal' : 'item'}`}
                >
                    <Col xs={12}>
                        <Input name='customId' label={t('item:labels.customId')} />
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
                            label={t('common:labels.owner')}
                            disabled
                            readOnly
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Input
                            name='createdAt'
                            label={t('common:labels.createdBy')}
                            disabled
                            readOnly
                        />
                    </Col>
                    <Col xs={12} md={3}>
                        <Input
                            name='updatedAt'
                            label={t('common:labels.updateAt')}
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
                                    ? t('common:actions.update')
                                    : t('common:actions.create')
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
