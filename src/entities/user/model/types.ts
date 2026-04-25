export interface IUserState {
    currentUser: IUser | null
}

export interface IUser {
    id: number
    name: string
    email: string
    googleId?: string
    facebookId?: string
    status: string
    roles: {
        role: IRole
    }[]
}

interface IRole {
    id: number
    name: string
}

export interface ISearchParam {
    query?: string
}

export interface IDeleteBody {
    userIds: string[]
}

export interface IUpdateBody<T> {
    ids: string[]
    data: Partial<T>
}

export interface UseUserActionsProps {
    onBlock: () => void
    onUnblock: () => void
    onGrant: () => void
    onRevoke: () => void
    onDelete: () => void
    selectedCount: number
}
