import { useMemo, useState, useEffect } from 'react';
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
import parse from 'html-react-parser'
import './RecordsList.css'
import IndeterminateCheckbox from '../IndeterminateCheckbox/IndeterminateCheckbox';
import Record from '../Record/Record';
import { RECORDS_LIST_HEADS } from '../../utils/constants'


export default function RecordsList({ records, nameList, handlerRecordClick }) {
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);

    const type = records?.find(record => record.__typename)?.__typename;
    const columnHelper = createColumnHelper();

    //console.log(type);
    //console.log(handlerRecordClick?.[type]);

    const getUniqIdValue = (row) => {
        if (row.id !== undefined && row.id !== null) {
            return row.id.toString();
        }
        return Object.values(row).map(value => (value !== null && value !== undefined ? value.toString() : "")).join("_");
    };

    const cellRenderer = (info, col) => {
        if (info.row.original[col.highlightKey]) return parse(info.row.original[col.highlightKey]);
        return info.getValue();
    }

    const collectColumn = (records, config) => {
        
        const colemn = records.find(record => record.values.length > 0)?.values?.map((value) => ({
            id: value.field[config.fieldIdKey], 
            header: value.field[config.fieldTitleKey],
            order: value.field.order
        })).sort((a, b) => a.order - b.order)
        return colemn;
    }

    const getRowValue = (row, col, config) => row.values.find(v => v.field.id === col.id)?.[config.fieldValueKey]

    const buildColumns = (records, config) => {
        const columnSchema = Array.isArray(config)
            ? { columns: config, accessorFn: (row, col) => (col.accessor ? col.accessor(row[col.id], row) : row[col.id]) }
            : { columns: collectColumn(records, config), accessorFn: (row, col) => getRowValue(row, col, config) };
        return columnSchema?.columns.map(column => columnHelper.accessor(row => columnSchema.accessorFn(row, column, config), {
            id: column.id,
            header: column.header,
            cell: info => cellRenderer(info, column),
        }))
    };

    const createCheckboxColumn = () => {
        return columnHelper.display({
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                checked={row.getIsSelected()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
                />)
        })
    }


    const getColumnsByType = (type) => {
        if (!RECORDS_LIST_HEADS[type]) return [];
        const columns = buildColumns(records, RECORDS_LIST_HEADS[type]);
        const checkboxColumn = createCheckboxColumn();
        return [ 
            checkboxColumn,
            ...columns
        ]
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
  
 
    const columns = useMemo(() => getColumnsByType(type) || [], [type])

    const table = useReactTable({
        data: useMemo(() => records || [], [records]),
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
            {nameList && <h3 className="mb-3">{nameList}</h3>}
                <Table className='mb-0' hover>
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
                    {table.getRowModel().rows.map((row) => (
                        <Record
                            key={row.id} 
                            record={row}
                            render={flexRender}
                            onRecordClick={handlerRecordClick?.[type]}
                        />))}
                </tbody>
                </Table>
        </Container>
    );
}