import { useSelector } from 'react-redux'
import { getCurrentUser } from '../model/userSlice'
import { ADMINISTRATOR } from '@/shared/config/constants'

export function useCurrentUser() {
    const currentUser = useSelector(getCurrentUser)
    const isAdmin =
        currentUser?.roles.some(
            (userRole) => userRole.role.name === ADMINISTRATOR
        ) || false

    return { isAdmin, currentUser }
}
