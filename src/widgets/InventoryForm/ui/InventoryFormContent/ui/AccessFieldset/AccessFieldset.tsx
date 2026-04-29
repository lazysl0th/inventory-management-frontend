import { Row, Col } from 'react-bootstrap'
import { FaKey } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { useFormikApi } from '@/shared/lib/hooks/useFormikApi'
import { Button } from '@/shared/ui/Button'
import { AllowedUserList } from '@/features/manageAllowedUser'
import { useLazyGetInventoryTokenQuery } from '@/entities/inventory'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { showToast } from '@/shared/model/ui'
import { Checkbox } from '@/shared/ui/Form/ui/Checkbox'

const AccessFieldset = () => {
    const {inventoryId} = useParams()
    const { t } = useTranslation('inventory')
    const { field: isPublicField } = useFormikApi<boolean>('isPublic')
    const [getInventoryToken] = useLazyGetInventoryTokenQuery()
    const dispatch = useDispatch()

    const getTokenHandle = async () => {
        if (!inventoryId) return;
        const token = await getInventoryToken({ inventoryId }).unwrap()
        dispatch(showToast({header: t('inventory:toasts.headers.token'), message: token}))
    }

    return (
        <Row className='g-2'>
            <Col xs={12} className='d-flex justify-content-between'>
                <Checkbox
                    name='isPublic'
                    label={t('inventory:labels.publicAccess')}
                    helpText={
                        isPublicField.value
                            ? t('inventory:texts.publicAccess')
                            : t('inventory:texts.privateAccess')
                    }
                />
                <Button variant='dark' onClick={getTokenHandle}>
                    <FaKey />
                    <span className='ms-2 text-nowrap'>
                        {t('inventory:actions.getToken')}
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
