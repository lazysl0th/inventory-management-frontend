import { TTableIds } from '@/shared/model/table/model/tableSlice'

export interface IAllowedUserList {
    tableId?: TTableIds
}

export interface UseAllowedUserActionsProps {
    onAdd: () => void
    onDelete: () => void
    onAddState: boolean
    onDeleteState: boolean
}
