import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Container, Spinner } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { SETTINGS } from '@/shared/config/constants'
import {
    getIsAuthChecked,
    getIsAuthenticated,
} from '@/features/auth/model/authSlice'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const ProtectedRoute = () => {
    const location = useLocation()
    const isAuthChecked = useSelector(getIsAuthChecked)
    const isAuthenticated = useSelector(getIsAuthenticated)
    const { isAdmin } = useCurrentUser()

    if (!isAuthChecked) {
        return (
            <Container className='d-flex'>
                <Spinner animation='border' className='mx-auto' />
            </Container>
        )
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                replace
                to={SETTINGS.routes.login}
                state={{ from: location }}
            />
        )
    }

    if (location.pathname === SETTINGS.routes.admin && !isAdmin) {
        return <Navigate to={SETTINGS.routes.main} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
