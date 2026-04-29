import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TRowData, Typename } from '@/shared/ui/DataTable/model/types'
import { INVENTORIES, ITEMS, USERS } from '@/shared/config/constants'

export const EntityRoutesSettings = {
    [Typename.Inventory]: {
        route: INVENTORIES,
        absolute: true,
    },
    [Typename.Item]: {
        route: ITEMS,
        absolute: false,
    },
    [Typename.User]: {
        route: USERS,
        absolute: true,
        backgroundLocation: null,
    },
} as const

export type TEntity = keyof typeof EntityRoutesSettings

export default function useEntityNavigation<TData extends TRowData>() {
    const navigate = useNavigate()
    const { activeTab } = useParams()
    const location = useLocation()

    const baseState = {
        backgroundLocation: location.state?.backgroundLocation || location,
        activeTab: location.state?.activeTab || activeTab,
        modal: true,
    }

    const navigateTo = (
        type: TEntity,
        param: string | number,
        replace: boolean = false,
        data?: TData
    ) => {
        const route = EntityRoutesSettings[type]

        const path = route.absolute
            ? `/${route.route}/${param}`
            : `../${route.route}/${param}`

        navigate(path, {
            ...(route.absolute ? {} : { relative: 'route' }),
            state: {
                ...baseState,
                ...(type === Typename.User && { backgroundLocation: null }),
                data,
            },
            replace: replace,
        })
    }

    const open = (
        type: TEntity,
        id: string | number,
        replace?: boolean,
        data?: TData
    ) => navigateTo(type, id, replace, data)

    const create = (type: TEntity) => navigateTo(type, 'new')

    return { open, create }
}
