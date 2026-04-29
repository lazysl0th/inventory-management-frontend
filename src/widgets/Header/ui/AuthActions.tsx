import { Nav } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { INavItemProps } from '../model/types'
import { LOGIN, REGISTER } from '@/shared/config/constants'

const AuthActions = ({ onExpanded }: INavItemProps) => {
    const { t } = useTranslation('auth')

    return (
        <>
            <Nav.Link
                as={Link}
                className='text-dark p-0'
                to={LOGIN}
                onClick={onExpanded}
            >
                {t('auth:actions.signin')}
            </Nav.Link>
            <Nav.Link
                as={Link}
                className='text-dark p-0'
                to={REGISTER}
                onClick={onExpanded}
            >
                {t('auth:actions.signup')}
            </Nav.Link>
        </>
    )
}

export default AuthActions
