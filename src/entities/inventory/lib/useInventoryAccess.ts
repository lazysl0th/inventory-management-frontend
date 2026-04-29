import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import type { IInventory } from '../model/types'

export function useInventoryAccess(inventory?: IInventory) {
    const { currentUser, isAdmin } = useCurrentUser()

    const isOwner = inventory?.owner?.id === currentUser?.id

    const hasWriteAccess =
        isAdmin ||
        isOwner ||
        inventory?.isPublic ||
        inventory?.allowedUsers.some((user) => user.id === currentUser?.id)

    return {
        isOwner,
        isAdmin,
        hasWriteAccess,
    }
}
