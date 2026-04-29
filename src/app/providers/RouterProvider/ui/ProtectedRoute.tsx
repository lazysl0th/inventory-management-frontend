import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import { getIsAuthChecked, getIsAuthenticated } from '@/features/auth/'
import { Loader } from '@/shared/ui/Loader'
import { ADMIN, LOGIN, MAIN } from '@/shared/config/constants'

const ProtectedRoute = () => {
    const location = useLocation()
    const isAuthChecked = useSelector(getIsAuthChecked)
    const isAuthenticated = useSelector(getIsAuthenticated)
    const { isAdmin } = useCurrentUser()

    if (!isAuthChecked) {
        return (
            <Container className='d-flex'>
                <Loader />
            </Container>
        )
    }

    if (!isAuthenticated) {
        return <Navigate replace to={LOGIN} state={{ from: location }} />
    }

    if (location.pathname === ADMIN && !isAdmin) {
        return <Navigate to={MAIN} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
