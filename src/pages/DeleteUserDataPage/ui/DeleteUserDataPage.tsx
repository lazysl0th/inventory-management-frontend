import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MAIN } from '@/shared/config/constants'

const DeleteUserDataPage = () => {
    const { t } = useTranslation(['user', 'common'])
    return (
        <>
            <h1>{t('user:pageTitle.deleteData')}</h1>
            <p>
                <span className='ms-1'>{t('user:deleteData.description')}</span>
                <a href='mailto:support@inventory-management.com'>
                    support@inventory-management.com
                </a>
                .
            </p>
            <p>{t('user:deleteData.timeframe')}</p>

            <Link to={MAIN}>{t('common:actions.back')}</Link>
        </>
    )
}

export default DeleteUserDataPage
