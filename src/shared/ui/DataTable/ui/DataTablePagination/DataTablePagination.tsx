import { Button } from '@/shared/ui/Button'
import { IDataTablePaginationProps } from '../../model/types'

export default function DataTablePagination<TData>({
    table,
}: IDataTablePaginationProps<TData>) {
    return (
        <div className='d-flex gap-3 align-self-center align-items-center'>
            <Button
                variant='dark'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Prev
            </Button>
            <span>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
            </span>
            <Button
                variant='dark'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Next
            </Button>
        </div>
    )
}
