import { useMemo, useState } from 'react';
import { Table, Container, Row, Col, OverlayTrigger, Tooltip, Button, Form } from 'react-bootstrap';
import { BsSortDown, BsSortUp, BsFillTrashFill } from "react-icons/bs";
import { VscAdd } from 'react-icons/vsc';
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table';
import parse from 'html-react-parser';
import './RecordsList.css';
import EditableCell from './EditableCell/EditableCell';
import IndeterminateCheckbox from '../IndeterminateCheckbox/IndeterminateCheckbox';
import Record from './Record/Record';
import { nameList, RECORDS_LIST_HEADS } from '../../utils/constants';


export default function RecordsList({
    records,
    nameRecordList,
    handlerClickRecord,
    handlerDeleteRecords,
    onChangeRecordList,
    onAdd,
    onRefetch,
    renderRow
}) {
    const [rowSelection, setRowSelection] = useState({});
    const [editingCell, setEditingCell] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const type = records?.find(record => record.__typename)?.__typename;
    const columnHelper = createColumnHelper();
    const onDisabled = () => Object.values(rowSelection).some(Boolean)

    const getUniqIdValue = (row) => {
        if (row.id !== undefined && row.id !== null)  return row.id.toString();
        return Object.values(row).map(value => (value !== null && value !== undefined ? value.toString() : "")).join("_");
    };

    const handleBlock = () => {
        onBlock(rowSelection);
        setRowSelection({});
    };

    //console.log(type)

    const handleDeleteRecord = async () => {
        await handlerDeleteRecords(rowSelection);
        await onRefetch();
        setRowSelection({});
    };

    const handleDeleteRow = () => {
        const deleteRecordIds = Object.keys(rowSelection).filter(id => rowSelection[id]);
        const updatedRecords = records.filter((record) => !deleteRecordIds.includes(String(record.id)));
        onChangeRecordList([...updatedRecords]);
        setRowSelection({});
    setEditingCell(null);
    };



    const handleDelete = () => { 
        type === 'Inventory' ? handleDeleteRecord() : handleDeleteRow()
    } 


    const handleChangeCell = ((id, changes) => {
        const updatedRecords = records.map((record) => (record.id === id ? { ...record, ...changes } : record));
        onChangeRecordList(updatedRecords);
    });


        const handleAddRecord = () => {
        const newAllowedUser = {
            id: crypto.randomUUID(),
            name: "",
            email: '',
            isNew: true,
            __typename: "User"
        };
            const updated = [newAllowedUser, ...(records ?? [])];
            setEditingCell({ id: newAllowedUser.id, field: "name" });
            onChangeRecordList(updated);
        };


    const createEditableCell = (info, col) => {
    return (
        <EditableCell
            isEditing={editingCell?.id === String(info.row.original.id) && editingCell?.field === col.id}
            column={col}
            value={info.getValue()}
            onStartEdit={() => setEditingCell({ id: String(info.row.original.id), field: col.id})}
            onEndEdit={() => setEditingCell(null)}
            onChange={(newValue) => handleChangeCell(info.row.original.id, { [col.id]: newValue } )}
        />);
    }

    const cellRenderer = (info, col) => {
        if (info.row.original[col.highlightKey]) return parse(info.row.original[col.highlightKey])
        //if (type === 'User') return createEditableCell(info, col);
        return info.getValue();
    }

    const getRowValue = (row, col, config) => row.values.find(v => v.field.id === col.id)?.[config.fieldValueKey]

    const collectColumn = (records, config) => {
        const column = records.find(record => record.values.length > 0)?.values?.map((value) => ({
            id: value.field[config.fieldIdKey], 
            header: value.field[config.fieldTitleKey],
            order: value.field.order
        })).sort((a, b) => a.order - b.order)
        return column;
    }

    const buildColumns = (records, type) => {
        const columnSchema = Array.isArray(RECORDS_LIST_HEADS[type])
            ? { columns: RECORDS_LIST_HEADS[type], accessorFn: (row, col) => (col.accessor ? col.accessor(row[col.id], row) : row[col.id]) }
            : { columns: collectColumn(records, config), accessorFn: (row, col) => getRowValue(row, col, config) };
        return columnSchema?.columns.map(column => columnHelper.accessor(row => columnSchema.accessorFn(row, column, RECORDS_LIST_HEADS[type]), {
            id: column.id,
            header: column.header,
            cell: info => cellRenderer(info, column, type),
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
                    onClick={(e) => e.stopPropagation()}
                />),
            cell: ({ row }) => (
                <IndeterminateCheckbox
                    checked={row.getIsSelected()}
                    indeterminate={row.getIsSomeSelected()}
                    onChange={row.getToggleSelectedHandler()}
                    onClick={(e) => e.stopPropagation()}
                />)
        })
    }

    const getColumnsByType = (type) => {
        if (!RECORDS_LIST_HEADS[type]) return [];
        const columns = buildColumns(records, type);
        const checkboxColumn = createCheckboxColumn();
        return [ checkboxColumn, ...columns ]
    };

    const filterTable = (row, columnId, filterValue) => {
        return Object.values(row.original).some(val => String(val).toLowerCase().includes(filterValue.toLowerCase()))
    }

    const sortDate = (a, b, columnId) => {
        return new Date(a.getValue(columnId)).getTime() - new Date(b.getValue(columnId)).getTime();
    };

    const handelFilterChange = (e) => setGlobalFilter(e.target.value)
  
 
    const columns = useMemo(() => getColumnsByType(type) || [], [type, editingCell])

    const table = useReactTable({
        data: useMemo(() => records || [], [records]),
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getUniqIdValue,
        state: { rowSelection, globalFilter, sorting, columnVisibility: { select: location.pathname === '/profile' ? true : false } },
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
            {nameRecordList && <h3 className='mb-4 mt-4'>{nameRecordList}</h3>}
                <Row className="mb-3 align-items-center">
                    { (location.pathname === '/profile' && nameRecordList === nameList.OWNER) || (nameRecordList === nameList.ACCESS) || (nameRecordList === nameList.ITEMS)
                        ? (<Col md="auto" className="d-flex gap-2">
                            <OverlayTrigger
                                key='add'
                                placement='top'
                                overlay={ <Tooltip id={`tooltip-add`}> Add </Tooltip> }
                            >
                                <Button 
                                    variant="outline-success" 
                                    onClick={onAdd ?? handleAddRecord}
                                >
                                    <VscAdd/> 
                                </Button>
                            </OverlayTrigger>
                            
                            <OverlayTrigger
                                key='delete'
                                placement='top'
                                overlay={ <Tooltip id={`tooltip-delete`}> Delete </Tooltip> }
                            >
                                <Button 
                                    variant="outline-danger"
                                    onClick={handleDelete} 
                                    disabled={!onDisabled()}
                                >
                                    <BsFillTrashFill />
                                </Button>
                            </OverlayTrigger>
                        </Col>)
                    : (<></>) }
                    <Col md className="d-flex justify-content-end" >
                        <Form.Control
                            type="text"
                            placeholder="Filter..."
                            value={globalFilter}
                            onChange={handelFilterChange}
                            style={{ width: '200px' }}
                        />
                    </Col>
                </Row>
            <div className='table-scroll-container'>
                <Table className='mb-0'  hover>
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
                    {}
                    {table.getRowModel().rows.map((row) => (
                        type === 'User'
                            ? (<EditableCell 
                                    key={row.id}
                                    record={row}

                                    //isEditing={editingCell?.id === String(info.row.original.id) && editingCell?.field === col.id}
                                    //column={col}
                                    //value={info.getValue()}
                                    //onStartEdit={() => setEditingCell({ id: String(info.row.original.id), field: col.id})}
                                    //onEndEdit={() => setEditingCell(null)}
                                    //onChange={(newValue) => handleChangeCell(info.row.original.id, { [col.id]: newValue } )}
                                />)
                            : (<Record
                                    key={row.id} 
                                    record={row}
                                    render={flexRender}
                                    onClick={handlerClickRecord?.[type]}
                            />)))}
                </tbody>
                </Table>
                </div>
        </Container>
    );
}