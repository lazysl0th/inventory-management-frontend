import { useMemo, useState } from "react";
import { Table, Container, Row, Col, OverlayTrigger, Tooltip, Button, Form } from "react-bootstrap";
import { CiLock, CiUnlock } from "react-icons/ci";
import { BsSortDown, BsSortUp, BsFillTrashFill } from "react-icons/bs";
import { VscAdd } from "react-icons/vsc";
import { MdOutlineAdminPanelSettings, MdAdminPanelSettings } from "react-icons/md";
import {
    createColumnHelper,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    flexRender
} from "@tanstack/react-table";
import parse from "html-react-parser";
import { useTranslation } from "react-i18next";
import "./RecordsList.css";
import EditableCell from "./EditableRecord/EditableRecord";
import IndeterminateCheckbox from "../IndeterminateCheckbox/IndeterminateCheckbox";
import Record from "./Record/Record";
import { NAME_LIST, RECORDS_LIST_HEADS } from "../../utils/constants";

export default function RecordsList({
    type,
    records,
    nameRecordList,
    handlerClickRecord,
    handlerDeleteRecords,
    onChangeRecordList,
    handlerAddRecord,
    handlerChangeUsersStatus,
    handlerChangeAccessUsers,
    fields,
    disabled,
}) {
    const [rowSelection, setRowSelection] = useState({});
    const [editingCell, setEditingCell] = useState(null);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const columnHelper = createColumnHelper();
    const { t } = useTranslation("table");


    const onDisabled = () => Object.values(rowSelection).some(Boolean);

    const getUniqIdValue = (row) => {
        if (row.id !== undefined && row.id !== null) return String(row.id)
        else if (row.guid) return String(row.guid);
        return Object.values(row).map(value => (value !== null && value !== undefined ? value.toString() : "")).join("_");
    };

    const handleDeleteRecord = async () => {
        await handlerDeleteRecords(rowSelection)
        setRowSelection({});
    };

    const handleDeleteRow = () => {
        const selectedRowIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);
        const updated = (records ?? []).filter((record) => !selectedRowIds.includes(record.guid ?? String(record.id)));
        onChangeRecordList(updated);
        setRowSelection({});
        setEditingCell(null);
    };

    const handleChangeUserStatus = (e) => {
        handlerChangeUsersStatus(rowSelection, e.currentTarget.value);
        setRowSelection({});
    };

    const handleChangeAccessUsers = (e) => {
        handlerChangeAccessUsers(rowSelection, e.currentTarget.value);
        setRowSelection({});
    }

    const handleDelete = () => (type === "Inventory" || type === 'Item' || nameRecordList == NAME_LIST.USERS) ? handleDeleteRecord() : handleDeleteRow();

    const handleChangeCell = (rowKey, changes) => {
        if (Object.prototype.hasOwnProperty.call(changes, "id") && changes.id != null) {
            const isDuplicate = (records ?? []).some((record) => {
                const key = record.guid ? String(record.guid) : String(record.id);
                return record.id === changes.id && key !== rowKey;
            });
            if (isDuplicate) return { ok: false, reason: "duplicate" };
        }

        const updated = (records ?? []).map((r) => {
            const key = r.guid ? String(r.guid) : String(r.id);
            return key === rowKey ? { ...r, ...changes } : r;
        });

        onChangeRecordList(updated);
        return { ok: true };
    };

    const handleAddRow = () => {
        const existingEmpty = (records ?? []).find((record) => {
            return !record.id && (!record.name || record.name.trim() === "") && (!record.email || record.email.trim() === "")
        });
        if (existingEmpty) return;

        const newAllowedUser = {
            guid: crypto.randomUUID(),
            id: null,
            name: "",
            email: "",
            __typename: "User"
        };

        const updated = [newAllowedUser, ...(records ?? [])];
        onChangeRecordList(updated);
    };

    const handleAdd = () => (type === "Inventory" || type === "Item") ? handlerAddRecord() : handleAddRow();

    const cellRenderer = (info, col) => {
        if (info.row.original[col.highlightKey]) return parse(info.row.original[col.highlightKey]);
        if (typeof info.getValue() === 'boolean') {
            return (
                <Form.Check
                    type="checkbox"
                    checked={info.getValue()}
                    readOnly
                    disabled
                    className="m-0"
                />
            );
        }
        if (info.getValue() === null || info.getValue() === undefined) return '';
        return info.getValue();
    };

    const getRowValue = (row, col, config) => {
        if (col.header === config.fieldCustomIdKey) return row.customId;
        const value = row.values.find((value) => value.field.id === col.id);
        if (!value) return null;
        if (typeof value.value === 'boolean') return value.value;
        if (value.value === 'true') return true;
        if (value.value === 'false') return false;
        return value.value;
    };

    const collectColumn = (fields, config) => {
        const columns = fields.reduce((acc, field) => {
            if (!field.isDeleted && field.showInTable) {
            acc.push({
                id: field[config.fieldIdKey] ?? field.guid,
                header: field[config.fieldTitleKey],
                order: field.order+1
            });
            }
            return acc;
        }, [ config.fieldCustomIdKey ? { id: crypto.randomUUID(), header: config.fieldCustomIdKey, order: 0 } : null]);
        return columns.sort((a, b) => a.order - b.order);
    };

    const buildColumns = (columns, type) => {
        const columnSchema = Array.isArray(RECORDS_LIST_HEADS[type])
            ? {
                columns: RECORDS_LIST_HEADS[type],
                accessorFn: (row, col) =>
                    col.accessor ? col.accessor(row[col.id], row) : row[col.id]
            }
            : {
                columns: collectColumn(columns, RECORDS_LIST_HEADS[type]),
                accessorFn: (row, col) => getRowValue(row, col, RECORDS_LIST_HEADS[type])
            };
        return columnSchema?.columns?.map((column) => 
            columnHelper.accessor(
                (row) => columnSchema.accessorFn(row, column, RECORDS_LIST_HEADS[type]), {
                    id: column.id,
                    header: t(`${column.header}`),
                    cell: (info) => cellRenderer(info, column, type)
                }
            )
        );
    };

    const createCheckboxColumn = () =>
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <IndeterminateCheckbox
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={table.getIsSomeRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                    onClick={(e) => e.stopPropagation()}
                    disabled={disabled}
                />
            ),
        cell: ({ row }) => (
            <IndeterminateCheckbox
                checked={row.getIsSelected()}
                indeterminate={row.getIsSomeSelected()}
                onChange={row.getToggleSelectedHandler()}
                onClick={(e) => e.stopPropagation()}
                disabled={disabled}
            />)
    });

    const getColumnsByType = (type, fields) => {
        if (!RECORDS_LIST_HEADS[type]) return [];
        const columns = buildColumns(fields, type) ?? [];
        const checkboxColumn = createCheckboxColumn();
        return [checkboxColumn, ...columns];
    };

    const filterTable = (row, columnId, filterValue) => Object.values(row.original).some((val) => String(val).toLowerCase().includes(filterValue.toLowerCase()));

    const handelFilterChange = (e) => setGlobalFilter(e.target.value);

    const columns = getColumnsByType(type, fields);

    const table = useReactTable({
        data: useMemo(() => records || [], [records]),
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: getUniqIdValue,
        state: {
            rowSelection,
            globalFilter,
            sorting,
            columnVisibility: {
                select: ([NAME_LIST.OWNER, NAME_LIST.ACCESS, NAME_LIST.USERS, NAME_LIST.INVENTORIES].includes(nameRecordList) || (type == 'Item'))
            }
        },
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        globalFilterFn: filterTable,
        enableRowSelection: true
    });

    return (
        <Container>
                {nameRecordList && <h3 className="mb2 mt-3">{t(`nameList.${nameRecordList}`)}</h3>}
                <Row className="mb-3 align-items-center">
                    {(nameRecordList === NAME_LIST.OWNER || nameRecordList === NAME_LIST.ACCESS
                        || type == 'Item'
                        || location.pathname === "/admin") && ( <Col md="auto" className="d-flex gap-2">
                                {(nameRecordList === NAME_LIST.USERS )
                                    ? (<fieldset disabled={disabled}>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="tooltip-add">Block</Tooltip>}
                                            >
                                                <Button variant="outline-dark" value="Blocked" onClick={handleChangeUserStatus} disabled={!onDisabled()}>
                                                    <CiLock />
                                                </Button>
                                            </OverlayTrigger>

                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="tooltip-add">Unblock</Tooltip>}
                                            >
                                                <Button variant="outline-dark" value="Active" onClick={handleChangeUserStatus} disabled={!onDisabled()}>
                                                    <CiUnlock />
                                                </Button>
                                            </OverlayTrigger>

                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="tooltip-grant">Grant Acces</Tooltip>}
                                            >
                                                <Button variant="outline-success" name="Grant" value="1" onClick={handleChangeAccessUsers} disabled={!onDisabled()}>
                                                    <MdOutlineAdminPanelSettings />
                                                </Button>
                                            </OverlayTrigger>

                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip id="tooltip-revoke">Revoke Access</Tooltip>}
                                            >
                                                <Button variant="outline-danger" name="Revoke" value='' onClick={handleChangeAccessUsers} disabled={!onDisabled()}>
                                                    <MdAdminPanelSettings />
                                                </Button>
                                            </OverlayTrigger>
                                        </fieldset>)

                                    : (<OverlayTrigger
                                            placement="top"
                                            overlay={<Tooltip id="tooltip-add">Add</Tooltip>}
                                        >
                                            <Button variant="outline-success" disabled={disabled} onClick={handleAdd}>
                                                <VscAdd />
                                            </Button>
                                        </OverlayTrigger>)}

                                <OverlayTrigger
                                    placement="top"
                                    overlay={<Tooltip id="tooltip-delete">Delete</Tooltip>}
                                >
                                    <Button variant="outline-danger" onClick={handleDelete} disabled={!onDisabled()} >
                                        <BsFillTrashFill />
                                    </Button>
                                </OverlayTrigger>
                            </Col>
                        )}
                        {records?.length == 0
                            ? (<></>)
                            : ( (type !== 'NumStats' && type !== 'TextStats') && <Col md className="d-flex justify-content-end">
                                <Form.Control
                                    type="text"
                                    placeholder={t("placeholders.filter")}
                                    value={globalFilter}
                                    onChange={handelFilterChange}
                                    style={{ width: "200px" }}
                                />
                            </Col>)}
                </Row>

            <div className="table-scroll-container">
                <Table className="mb-0" hover>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        className={header.id === "select" ? "text-center" : "text-start"}
                                        style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        <span>
                                            {{ asc: <BsSortUp className="m-1" />, desc: <BsSortDown className="m-1" /> }
                                            [header.column.getIsSorted()] ?? ""}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {(table.getRowModel().rows.length === 0)
                            ? <></>
                            : table.getRowModel().rows.map((row) => {
                                const rowKey = row.original.guid ?? String(row.original.id);
                                const isEditing = editingCell?.id === rowKey;
                                const editingField = editingCell?.field;

                                return ( 
                                    (type === "User")
                                        ? (<EditableCell
                                                key={row.id}
                                                record={row}
                                                render={flexRender}
                                                isEditing={isEditing}
                                                editingField={editingField}
                                                setEditingCell={setEditingCell}
                                                onChange={handleChangeCell}
                                                disabled={disabled}
                                            />)
                                        : (<Record
                                                key={row.id}
                                                record={row}
                                                render={flexRender}
                                                onClick={handlerClickRecord?.[type]}
                                            />));
                        })}
                    </tbody>
                </Table>
            </div>
        </Container>
    );
}