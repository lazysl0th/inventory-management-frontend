import type { ChangeEventHandler } from 'react'
import { useTranslation } from 'react-i18next'
import { Row, Col } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import './InventoryDetailsFieldset.scss'
import { Category } from '@/entities/inventory/model/types'
import { useUploadImageMutation } from '@/features/integration/api/integrationApi'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { useInventoryAccess } from '@/entities/inventory/lib/useInventoryAccess'
import { showToast } from '@/shared/model/ui'
import { TagsField } from '@/features/selectTags'
import { useGetInventoryCategoriesQuery } from '@/entities/inventory'
import { useInventoryData } from '@/entities/inventory/lib/useInventoryData'
import { Input } from '@/shared/ui/Form/ui/Input'
import { Select } from '@/shared/ui/Form/ui/Select'
import { MarkdownField } from '@/shared/ui/Form/ui/MarkdownField'

const InventoryDetailsFieldset = () => {
    const { data: categories, isLoading: categoriesIsLoading } =
        useGetInventoryCategoriesQuery()

    const { data: inventory, inventoryId } = useInventoryData()

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    const { t } = useTranslation(['inventory', 'common'])
    const dispatch = useDispatch()
    const [uploadImage] = useUploadImageMutation()

    const { field: description } = useFormikApi<string>('description')
    const { field: image } = useFormikApi<string>('image')

    const handlerChangeImageField: ChangeEventHandler<
        HTMLInputElement
    > = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const formData = new FormData()
        formData.append('image', file)
        try {
            const imageUrl = await uploadImage(formData).unwrap()
            image.setValue(imageUrl.url)
        } catch {
            dispatch(
                showToast({
                    message: t('common:notifications.errorAction', {
                        count: 1,
                        actionType: 'loading',
                        recordType: 'image',
                    }),
                })
            )
        }
    }

    return (
        <fieldset>
            <Row className='g-2'>
                <Col xs={12} md={8}>
                    <Input
                        name='title'
                        label={t('inventory:labels.title')}
                        placeholder={t('inventory:placeholders.title')}
                    />
                </Col>
                <Col xs={12} md={4}>
                    <Select
                        name='category'
                        label={
                            categoriesIsLoading
                                ? t('common:options.loading')
                                : t('inventory:labels.category')
                        }
                    >
                        <option value={Category.None} disabled>
                            {t('inventory:options.category')}
                        </option>
                        {categories &&
                            categories.map((category) => (
                                <option key={category} value={category}>
                                    {t(`inventory:categories.${category}`)}
                                </option>
                            ))}
                    </Select>
                </Col>
                <Col xs={12}>
                    {!!inventoryId && !isAdmin && !isOwner ? (
                        <MarkdownField
                            name='description'
                            label={t('inventory:labels.description')}
                            value={description.value}
                            className='d-block p-2 border rounded bg-light fieldset--description-markdown'
                        />
                    ) : (
                        <Input
                            as='textarea'
                            name='description'
                            label={t('inventory:labels.description')}
                            placeholder={t(
                                'inventory:placeholders.descriptionInventory'
                            )}
                            rows={6}
                        />
                    )}
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Input
                        name='image'
                        label={t('inventory:labels.image')}
                        type='file'
                        accept='image/*'
                        alt={t('inventory:alts.imagePreview')}
                        placeholder={t('inventory:placeholders.noImage')}
                        onChange={handlerChangeImageField}
                    />
                </Col>
                {
                    <Col xs={12} md={6} lg={4}>
                        <TagsField disabled={!!inventoryId && !isAdmin && !isOwner} />
                    </Col>
                }
                <Col md={12} lg={4}>
                    <div className='d-flex flex-column gap-1'>
                        <Input
                            name='owner'
                            label={t('common:labels.owner')}
                            readOnly
                            disabled
                        />
                        <Input
                            name='createdAt'
                            label={t('common:labels.createdBy')}
                            readOnly
                            disabled
                        />
                        <Input
                            name='updatedAt'
                            label={t('common:labels.updateAt')}
                            readOnly
                            disabled
                        />
                    </div>
                </Col>
            </Row>
        </fieldset>
    )
}

export default InventoryDetailsFieldset
