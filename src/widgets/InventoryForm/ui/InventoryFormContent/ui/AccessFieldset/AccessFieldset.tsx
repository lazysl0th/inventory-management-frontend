import { Row, Col } from 'react-bootstrap'
import { FaKey } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { Button } from '@/shared/ui/Button'
import { AllowedUserList } from '@/features/manageAllowedUser'
import { Checkbox } from '@/shared/ui/Form'
import { useLazyGetInventoryTokenQuery } from '@/entities/inventory'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showToast } from '@/shared/model/ui'

const AccessFieldset = () => {
    const {inventoryId} = useParams()
    const { t } = useTranslation('inventory')
    const { field: isPublicField } = useFormikApi<boolean>('isPublic')
    const [getInventoryToken] = useLazyGetInventoryTokenQuery()
    const dispatch = useDispatch()

    const getTokenHandle = async () => {
        if (!inventoryId) return;
        const token = await getInventoryToken({ inventoryId }).unwrap()
        dispatch(showToast({header: 'Inventory token', message: token}))
    }

    return (
        <Row className='g-2'>
            <Col xs={12} className='d-flex justify-content-between'>
                <Checkbox
                    name='isPublic'
                    label={t('labels.publicAccess')}
                    helpText={
                        isPublicField.value
                            ? t('texts.publicAccess')
                            : t('texts.privateAccess')
                    }
                />
                <Button variant='dark' onClick={getTokenHandle}>
                    <FaKey />
                    <span className='ms-2 text-nowrap'>
                        {t('buttons.token')}
                    </span>
                </Button>
            </Col>
            <Col>
                <AllowedUserList tableId='allowedUsers' />
            </Col>
        </Row>
    )
}

export default AccessFieldset
