import { Table } from '@tanstack/react-table'
import { ChangeEventHandler, FocusEventHandler, ReactNode } from 'react'
import { TRowData } from '../model/types'
import { IFieldApi } from '@/shared/lib/hooks/useFormikApi'
import { Input } from '../../Form'

export interface IChildrenProps {
    selectedIds: any
    resetSelection: () => void
}

interface IDataTableToolbarProps<TData> {
    table: Table<TData>
    children?: ReactNode
}

export default function DataTableToolbar<TData extends TRowData>({
    table,
    children,
}: IDataTableToolbarProps<TData>) {
    const tableId = table.options.meta?.tableId
    const globalFilter = table.getState().globalFilter as string
    const onChangeFilter: ChangeEventHandler<HTMLInputElement> = (e) =>
        table.setGlobalFilter(e.target.value)
    const onBlurFilter: FocusEventHandler<HTMLInputElement> = (e) => {}

    const field: IFieldApi<string> = {
        value: globalFilter,
        onChange: onChangeFilter,
        onBlur: onBlurFilter,
        setValue: () => undefined,
        setError: () => undefined,
    }

    return (
        <div
            className={
                'd-flex gap-2 ' +
                (children ? 'justify-content-between' : 'align-self-end')
            }
        >
            {children}
            <Input
                name={`globalFilter_${tableId}`}
                type='search'
                placeholder='Search...'
                api={{ field }}
            />
        </div>
    )
}
