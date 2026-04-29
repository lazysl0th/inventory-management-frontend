import { Nav, Navbar } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import type { INavItemProps } from '../model/types'
import { useLogoutMutation } from '@/features/auth'
import { ADMIN, PROFILE } from '@/shared/config/constants'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const UserInfo = ({ onExpanded }: INavItemProps) => {
    const location = useLocation()
    const navigate = useNavigate()
    const { t } = useTranslation(['auth', 'admin', 'common'])
    const { isAdmin, currentUser } = useCurrentUser()
    const [logout] = useLogoutMutation()
    const isProfilePage = location.pathname === PROFILE
    const logoutHandler = async () => {
        await logout(undefined)
        navigate('/sign-in')
        onExpanded()
    }

    return (
        <>
            {!isProfilePage ? (
                <>
                    <Navbar.Text className='me-1'>
                        {t('auth:text.signedInAs')}:
                        <Link to={PROFILE} onClick={onExpanded}>
                            {currentUser?.name}
                        </Link>
                    </Navbar.Text>
                    <Navbar.Text className='me-1'>
                        {t('common:labels.email')}:
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
                        to={ADMIN}
                        onClick={onExpanded}
                    >
                        {t('admin:links.admin')}
                    </Nav.Link>
                )
            )}
            <Nav.Link
                as='button'
                className='text-dark p-0'
                onClick={logoutHandler}
            >
                {t('auth:actions.signout')}
            </Nav.Link>
        </>
    )
}
export default UserInfo
