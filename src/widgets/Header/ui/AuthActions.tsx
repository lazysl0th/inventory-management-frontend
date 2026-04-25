import { SETTINGS } from '@/shared/config/constants'
import { Nav } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { INavItemProps } from '../model/types'

const AuthActions = ({ onExpanded }: INavItemProps) => {
    const { t: ta } = useTranslation('auth')

    return (
        <>
            <Nav.Link
                as={Link}
                className='text-dark p-0'
                to={SETTINGS.routes.login}
                onClick={onExpanded}
            >
                {ta('links.signin')}
            </Nav.Link>
            <Nav.Link
                as={Link}
                className='text-dark p-0'
                to={SETTINGS.routes.register}
                onClick={onExpanded}
            >
                {ta('links.signup')}
            </Nav.Link>
        </>
    )
}

export default AuthActions
