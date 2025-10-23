import { useMemo, useState } from 'react';
import { Table, Container, } from 'react-bootstrap';
import { BsSortDown, BsSortUp } from "react-icons/bs";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import IndeterminateCheckbox from '../IndeterminateCheckbox/IndeterminateCheckbox';

export default function RecordsList({ records, nameList }) {

    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const getUniqIdValue = (row) => {
        if (row.id !== undefined && row.id !== null) {
            return row.id.toString();
        }
        return Object.values(row).map(value => (value !== null && value !== undefined ? value.toString() : "")).join("_");
    };

    const onDisabled = () => {
        return Object.values(rowSelection).some(Boolean);
    }

    const filterTable = (row, columnId, filterValue) => {
        return Object.values(row.original).some(val => String(val).toLowerCase().includes(filterValue.toLowerCase()))
    }

    const sortDate = (a, b, columnId) => {
        return new Date(a.getValue(columnId)).getTime() - new Date(b.getValue(columnId)).getTime();
    };

    const handelFilterChange = (e) => setGlobalFilter(e.target.value)
  
    const columnHelper = createColumnHelper();
  
    const columns = useMemo(
        () => [
        columnHelper.display({
            id: 'select', header: ({ table }) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        }),
        columnHelper.accessor('title', { header: 'Title', cell: info => info.getValue() }),
        columnHelper.accessor('description', { header: 'Description', cell: info => info.getValue() }),
        columnHelper.accessor('image', { header: 'Image', cell: info => info.getValue() }),
        columnHelper.accessor('owner', { header: 'Owner', cell: info => info.getValue().name }),
        ], []
    );

    const table = useReactTable({
        data: records,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getUniqIdValue,
        state: { rowSelection, globalFilter, sorting, columnVisibility: { select: false } },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        globalFilterFn: filterTable,
        enableRowSelection: true,
    });

    return (
        <Container>
            <h3 className="mb-3">{nameList}</h3>
                <Table className='mb-0'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                        <th 
                            key={header.id}
                            className={header.id === 'select' ? 'text-center' : 'text-start'}
                            style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                            onClick={header.column.getToggleSortingHandler()}
                            >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span>
                            {{
                                asc: <BsSortUp className='m-1'/>,
                                desc: <BsSortDown className='m-1'/>,
                            }[header.column.getIsSorted()] ?? ''}
                            </span>
                        </th>
                        ))}
                    </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className={cell.column.id === 'select' ? 'text-center' : 'text-start'}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                        ))}
                    </tr>
                    ))}
                </tbody>
                </Table>
        </Container>
    );
}