import { flexRender } from '@tanstack/react-table'
import './DataTableRow.scss'
import type { IDataTableRowProps, TRowData } from '../../model/types'

export default function DataTableRow<TData extends TRowData>({
    row,
    meta,
}: IDataTableRowProps<TData>) {
    const handleRowClick = () => {
        if (meta?.onRowClick) meta.onRowClick(row.original.id)
    }

    return (
        <tr
            className={`${meta?.onRowClick ? 'table-row' : ''}`}
            onClick={handleRowClick}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    className={`align-middle ${cell.column.id === 'select' ? 'text-center' : 'text-start'}`}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    )
}
