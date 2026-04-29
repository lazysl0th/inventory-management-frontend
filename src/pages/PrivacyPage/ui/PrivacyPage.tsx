import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MAIN } from '@/shared/config/constants'

const PrivacyPage = () => {
    const { t } = useTranslation(['privacy', 'common'])

    return (
        <>
            <h1>{t('privacy:pageTitle')}</h1>
            <p>
                <span className='ms-1'>{t('privacy:description')}</span>
                <a href='mailto:u69740384@gmail.com'>
                    support@inventory-management.com
                </a>
                .
            </p>
            <p>{t('privacy:timeframe')}</p>
            <Link to={MAIN}>{t('common:actions.back')}</Link>
        </>
    )
}

export default PrivacyPage
