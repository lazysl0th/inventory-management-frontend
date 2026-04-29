import type { ChangeEventHandler } from 'react'
import type { IDataTableToolbarProps, TRowData } from '../../model/types'
import { useTranslation } from 'react-i18next'
import { FormControl } from 'react-bootstrap'

export default function DataTableToolbar<TData extends TRowData>({
    table,
    children,
}: IDataTableToolbarProps<TData>) {
    const tableId = table.options.meta?.tableId
    const { t } = useTranslation('common')
    const globalFilter = table.getState().globalFilter as string
    const onChangeFilter: ChangeEventHandler<HTMLInputElement> = (e) =>
        table.setGlobalFilter(e.target.value)
    return (
        <div
            className={
                'd-flex gap-2 ' +
                (children ? 'justify-content-between' : 'align-self-end')
            }
        >
            {children}
            <FormControl
                className='w-auto'
                value={globalFilter}
                name={`globalFilter_${tableId}`}
                placeholder={t('common:placeholders.search')}
                type='search'
                onChange={onChangeFilter}
            />
        </div>
    )
}
