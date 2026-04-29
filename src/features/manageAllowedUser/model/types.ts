import { TTableIds } from "@/shared/model/table"

export interface IAllowedUserList {
    tableId?: TTableIds
}

export interface UseAllowedUserActionsProps {
    onAdd: () => void
    onDelete: () => void
    onAddState: boolean
    onDeleteState: boolean
    selectedCount: number
}
