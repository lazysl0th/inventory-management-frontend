import { useMemo, useState } from 'react';
import { Table, Row, Col, Button, Form, Container, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { BsFillLockFill, BsFillUnlockFill, BsFillTrashFill, BsSortDown, BsSortUp } from "react-icons/bs";
import { AiOutlineUsergroupDelete } from "react-icons/ai";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import IndeterminateCheckbox from '../IndeterminateCheckbox/IndeterminateCheckbox';

export default function TableUsers({ users = [
  {name: 1, email: 1, status: 1, number: 1},
  {name: 2, email: 2, status: 2, number: 2},
  {name: 3, email: 3, status: 3, number: 3},
], onBlock, onUnblock, onDelete, onDeleteUnverified}) {
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);

  const handleBlock = () => {
    onBlock(rowSelection);
    setRowSelection({});
  };

  const handleUnblock = () => {
    onUnblock(rowSelection);
    setRowSelection({});
  };

  const handleDelete = () => {
    onDelete(rowSelection);
    setRowSelection({});
  };

  const handleDeleteUnverified = () => {
    onDeleteUnverified();
    setRowSelection({});
  }

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
        id: 'select',
        header: ({ table }) => (
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
      columnHelper.accessor('name', { header: 'Name', cell: info => info.getValue() }),
      columnHelper.accessor('email', { header: 'Email', cell: info => info.getValue() }),
      columnHelper.accessor('status', { header: 'Status', cell: info => info.getValue() }),
      columnHelper.accessor('last_login', 
        { header: 'Last seen', cell: info => new Date(info.getValue()).toLocaleString(), sortingFn: sortDate }),
    ], []
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getUniqIdValue,
    state: { rowSelection, globalFilter, sorting },
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
      <Row className="mb-3 align-items-center">
        <Col md="auto" className="d-flex gap-2">
           <OverlayTrigger
              key='block'
              placement='top'
              overlay={
                <Tooltip id={`tooltip-block`}>Block all select user</Tooltip>
              }
            >
            <span className="d-inline-block">
              <Button 
                variant="outline-primary" 
                onClick={handleBlock} 
                disabled={!onDisabled()}>
                  <BsFillLockFill/> 
                  Block
              </Button>
            </span>
          </OverlayTrigger>
           <OverlayTrigger
              key='unblock'
              placement='top'
              overlay={
                <Tooltip id={`tooltip-unblock`}>
                  Unblock all select user
                </Tooltip>
              }
            >
              <span className="d-inline-block">
          <Button 
            variant="outline-primary" 
            onClick={handleUnblock}
            disabled={!onDisabled()}>
              <BsFillUnlockFill />
          </Button>
          </span>
          </OverlayTrigger>
                     <OverlayTrigger
              key='delete-select'
              placement='top'
              overlay={
                <Tooltip id={`tooltip-delete-select`}>
                  Delete all select user
                </Tooltip>
              }
            >
              <span className="d-inline-block">
          <Button 
            variant="outline-danger"
            onClick={handleDelete} 
            disabled={!onDisabled()}>
              <BsFillTrashFill />
          </Button>
          </span>
          </OverlayTrigger>
           <OverlayTrigger
              key='delete-unverified'
              placement='top'
              overlay={
                <Tooltip id={`tooltip-delete-unverified`}>
                  Delete all unverified user
                </Tooltip>
              }
            >
              <span className="d-inline-block">
          <Button 
            variant="outline-danger"
            onClick={handleDeleteUnverified} >
              <AiOutlineUsergroupDelete />
          </Button>
          </span>
          </OverlayTrigger>
        </Col>
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
      <div className="table-scroll-container">
        <Table>
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
      </div>
    </Container>
  );
}