import { MAIN } from '@/shared/config/constants'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
    const { t } = useTranslation('common')

    return (
        <>
            <h1>404</h1>
            <p>{t('common:pageDescription.notFoundPage')}</p>
            <Link to={MAIN} className='text-dark'>
                {t('common:actions.back')}
            </Link>
        </>
    )
}

export default NotFoundPage
