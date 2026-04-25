import { SETTINGS } from '@/shared/config/constants'
import { Nav, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import { INavItemProps } from '../model/types'
import { useCurrentUser } from '@/entities/user'
import { useLogoutMutation } from '@/features/auth'

const UserInfo = ({ onExpanded }: INavItemProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { t: ta } = useTranslation('auth')
    const { t: tad } = useTranslation('admin')
    const { isAdmin, currentUser } = useCurrentUser()
    const [logout] = useLogoutMutation()
    const isProfilePage = location.pathname === SETTINGS.routes.profile
    const logoutHandler = async () => {
        await logout(undefined)
        navigate('/sign-in')
        onExpanded()
    }

    return (
        <>
            {!isProfilePage ? (
                <>
                    <Navbar.Text>
                        {ta('text.signedInAs')}:{' '}
                        <Link to={SETTINGS.routes.profile} onClick={onExpanded}>
                            {currentUser?.name}
                        </Link>
                    </Navbar.Text>
                    <Navbar.Text>
                        {ta('text.headerEmail')}:{' '}
                        <Link
                            onClick={onExpanded}
                            to={`mailto:${currentUser?.email}`}
                        >
                            {currentUser?.email}
                        </Link>
                    </Navbar.Text>
                </>
            ) : (
                isAdmin && (
                    <Nav.Link
                        as={Link}
                        className='text-dark p-0 text-nowrap'
                        to={SETTINGS.routes.admin}
                        onClick={onExpanded}
                    >
                        {tad('links.admin')}
                    </Nav.Link>
                )
            )}
            <Nav.Link
                as='button'
                className='text-dark p-0'
                onClick={logoutHandler}
            >
                {ta('links.signout')}
            </Nav.Link>
        </>
    )
}
export default UserInfo
