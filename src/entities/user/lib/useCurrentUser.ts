import { useSelector } from 'react-redux'
import { SETTINGS } from '@/shared/config/constants'
import { getCurrentUser } from '../model/userSlice'

export function useCurrentUser() {
    const currentUser = useSelector(getCurrentUser)
    const isAdmin =
        currentUser?.roles.some(
            (userRole) => userRole.role.name === SETTINGS.adminRole
        ) || false

    return { isAdmin, currentUser }
}
