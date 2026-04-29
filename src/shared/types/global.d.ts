import '@tanstack/react-table'
import { TRowData } from '../DataTable'

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends TRowData> {
        onRowClick?: (id: number) => void
        align?: 'left' | 'center' | 'right'
        tableId: string
    }
}
