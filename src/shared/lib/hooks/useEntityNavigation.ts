import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { SETTINGS } from '../../config/constants'
import { TRowData, Typename } from '@/shared/ui/DataTable/model/types'

export const EntityRoutesSettings = {
    [Typename.Inventory]: {
        route: SETTINGS.routes.inventories,
        absolute: true,
    },
    [Typename.Item]: {
        route: SETTINGS.routes.items,
        absolute: false,
    },
    [Typename.User]: {
        route: SETTINGS.routes.users,
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
