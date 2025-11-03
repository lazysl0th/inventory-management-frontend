import { useRef, useEffect, useCallback, useMemo } from "react";
import AsyncSelect from "react-select/async";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "../../../graphql/queries";

export default function EditableRecord({
    record,
    render,
    onChange,
    isEditing,
    editingField,
    setEditingCell
}) {
    const selectRef = useRef(null);
    const [searchUsers] = useLazyQuery(SEARCH_USERS, { fetchPolicy: "no-cache" });

    const row = record.original;

    useEffect(() => {
        if (isEditing && ["name", "email"].includes(editingField)) {
            selectRef.current?.focus();
        }
    }, [isEditing, editingField]);

    const currentOption = useMemo(() => {
        if (!row?.id) return null;
        const baseData = {
            id: row.id,
            name: row.name,
            email: row.email,
            __typename: "User"
        };
        if (editingField === "name" && row.name) return { label: row.name, value: row.id, data: baseData };
        if (editingField === "email" && row.email) {
            const label = row.name ? `${row.name} (${row.email})` : row.email;
            return { label, value: row.id, data: baseData };
        }
        return null;
    }, [row.id, row.name, row.email, editingField]);

    const loadOptions = useCallback (
        async (inputValue, colId) => {
            if (!inputValue?.trim()) return [];
            const by = colId === "email" ? "EMAIL" : "NAME";
            const { data } = await searchUsers({ variables: { searchQuery: inputValue, by } });
            return (
                data?.searchUsers?.map((u) => ({
                    label: `${u.name} (${u.email})`,
                    value: u.id,
                    data: u
                })) ?? []
            );
        }, [searchUsers]
    );

    const handleClick = (colId) => (e) => {
        e.stopPropagation();
        if (["name", "email"].includes(colId)) setEditingCell({ id: row.guid ?? String(row.id), field: colId });
    }

    const handleSelectOption = (option, colId, meta) => {
        if (!option) {
            setEditingCell(null);
            return;
        }

        const currentVal = currentOption?.value;
        
        if (option.value === currentVal && meta?.action === "select-option") {
            setEditingCell(null);
            return;
        }

        const user = option.data;
        const ok = onChange(row.guid ?? String(row.id), {
            id: user.id,
            name: user.name,
            email: user.email,
            __typename: "User"
        });

        if (ok !== false) setEditingCell(null);
    };

    const renderDisplayText = (value) => (
        <span
            style={{
                display: "inline-block",
                width: "100%",
                height: "28px",
                lineHeight: "28px",
                padding: "0 4px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                color: value ? "#212529" : "#999",
                fontStyle: value ? "normal" : "italic"
            }}
        >
            {value || "Имя / Email"}
        </span>
    );

    return (
        <tr>
            {record.getVisibleCells().map((cell) => {
                const isThisEditing = isEditing && editingField === cell.column.id;
                const valueFromRow = row[cell.column.id];

                return (
                <td
                    key={cell.id}
                    className={cell.column.id === "select" ? "text-center" : "text-start"}
                    style={{
                        cursor: cell.column.id === "select" ? "default" : "pointer",
                        verticalAlign: "middle"
                    }}
                    onClick={handleClick(cell.column.id)}
                >
                    { cell.column.id === "select"
                        ? render(cell.column.columnDef.cell, cell.getContext())
                        : isThisEditing 
                            ? (<AsyncSelect
                                    key={`${row.guid}-${cell.column.id}`}
                                    ref={selectRef}
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={(txt) => loadOptions(txt, cell.column.id)}
                                    value={currentOption}
                                    onChange={(opt, meta) => handleSelectOption(opt, cell.column.id, meta)}
                                    openMenuOnFocus={false}
                                    openMenuOnClick={false}
                                    menuIsOpen={undefined}
                                    closeMenuOnSelect
                                    blurInputOnSelect={false}
                                    isClearable={false}
                                    backspaceRemovesValue={false}
                                    placeholder={`Введите ${cell.column.id === "email" ? "email" : "имя"}...`}
                                    noOptionsMessage={() => "Нет совпадений"}
                                    menuPortalTarget={document.body}
                                    menuPlacement="auto"
                                    components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                        menu: (base) => ({ ...base, zIndex: 9999 }),
                                        control: (base) => ({
                                            ...base,
                                            minHeight: "26px",
                                            height: "26px",
                                            border: "none",
                                            boxShadow: "none",
                                            backgroundColor: "transparent",
                                            fontSize: "0.875rem",
                                            lineHeight: "1.2",
                                            padding: "0 2px",
                                            display: "flex",
                                            alignItems: "center"
                                            }),
                                        valueContainer: (base) => ({
                                            ...base,
                                            padding: 0,
                                            margin: 0,
                                            height: "26px"
                                            }),
                                        input: (base) => ({
                                            ...base,
                                            margin: 0,
                                            padding: 0,
                                            height: "26px"
                                            }),
                                        indicatorsContainer: (base) => ({ ...base, display: "none" })
                                    }}
                                />)
                                : (renderDisplayText(valueFromRow))}
                </td>);
            })}
        </tr>
    );
}
