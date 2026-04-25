import { ChangeEventHandler } from 'react'
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
import {
    useGetInventoryCategoriesQuery,
    useInventoryData,
} from '@/entities/inventory'
import { Input, MarkdownField, Select } from '@/shared/ui/Form'

const InventoryDetailsFieldset = () => {
    const { data: categories, isLoading: categoriesIsLoading } =
        useGetInventoryCategoriesQuery()

    const { data: inventory } = useInventoryData()

    const { isAdmin, isOwner } = useInventoryAccess(inventory)

    const { t } = useTranslation('inventory')
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
            dispatch(showToast({message: t('toasts.image')}))
        }
    }

    return (
        <fieldset>
            <Row className='g-2'>
                <Col xs={12} md={8}>
                    <Input
                        name='title'
                        label={t('labels.title')}
                        placeholder='Enter title...'
                    />
                </Col>
                <Col xs={12} md={4}>
                    <Select name='category' label={t('labels.category')}>
                        <option value={Category.None} disabled>
                            {t('options.selectCategory')}
                        </option>
                        {categories &&
                            categories.map((category) => (
                                <option key={category} value={category}>
                                    {t(`categories.${category}`)}
                                </option>
                            ))}
                    </Select>
                </Col>
                <Col xs={12}>
                    {!isAdmin && !isOwner ? (
                        <MarkdownField
                            name='description'
                            label={t('labels.description')}
                            value={description.value}
                            className='d-block p-2 border rounded bg-light fieldset--description-markdown'
                        />
                    ) : (
                        <Input
                            as='textarea'
                            name='description'
                            label={t('labels.description')}
                            placeholder={t('placeholders.descriptionInventory')}
                            rows={6}
                        />
                    )}
                </Col>
                <Col xs={12} md={6} lg={4}>
                    <Input
                        name='image'
                        label={t('labels.image')}
                        type='file'
                        accept='image/*'
                        onChange={handlerChangeImageField}
                    />
                </Col>
                {
                    <Col xs={12} md={6} lg={4}>
                        <TagsField disabled={!isAdmin && !isOwner} />
                    </Col>
                }
                <Col md={12} lg={4}>
                    <div className='d-flex flex-column gap-1'>
                        <Input
                            name='owner'
                            label={t('labels.owner')}
                            readOnly
                            disabled
                        />
                        <Input
                            name='createdAt'
                            label={t('labels.createdBy')}
                            readOnly
                            disabled
                        />
                        <Input
                            name='updatedAt'
                            label={t('labels.updateAt')}
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
