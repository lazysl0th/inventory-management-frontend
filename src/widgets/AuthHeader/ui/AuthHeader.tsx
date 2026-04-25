import { HelpButton } from '@/shared/ui/HelpButton'
import { useTranslation } from 'react-i18next'
import { BiArrowBack } from 'react-icons/bi'
import { Link } from 'react-router-dom'

const AuthHeader = () => {
    const { t } = useTranslation('auth')

    return (
        <div className='d-flex justify-content-around align-items-center py-5'>
            <Link
                to='/'
                className='text-decoration-none text-dark d-flex align-items-center gap-1'
            >
                <BiArrowBack size={16} /> {t('links.back')}
            </Link>
            <HelpButton />
        </div>
    )
}

export default AuthHeader
