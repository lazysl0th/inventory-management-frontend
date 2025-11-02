import { useState } from "react";
import AsyncSelect from "react-select/async";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_USERS } from "../../../graphql/queries";

export default function EditableRecord({ record, render, onChange }) {
  const [editingCell, setEditingCell] = useState(null); // "name" | "email"
  const [tempValue, setTempValue] = useState("");       // текст в инпуте select'a
  const [searchUsers] = useLazyQuery(SEARCH_USERS, { fetchPolicy: "no-cache" });

  const row = record.original;

  const loadOptions = async (inputValue, columnId) => {
    const by = columnId === "email" ? "EMAIL" : "NAME";
    const { data } = await searchUsers({ variables: { searchQuery: inputValue, by } });
    return (
      data?.searchUsers?.map((u) => ({
        label: `${u.name} (${u.email})`,
        value: u.id,
        data: u,
      })) ?? []
    );
  };

  const handleSelectOption = (option) => {
    if (!option || !option.data) {
      // отмена/клик мимо — просто закрыть
      setEditingCell(null);
      return;
    }

    const u = option.data;

    // выбрали того же пользователя — ничего не меняем
    if (u.name === row.name && u.email === row.email) {
      setEditingCell(null);
      return;
    }

    // обновляем всю строку
    onChange(row.id, {
      id: u.id,
      name: u.name,
      email: u.email,
      __typename: "User",
    });

    setEditingCell(null);
  };

  const handleBlur = () => {
    // закрыть без обнулений
    requestAnimationFrame(() => setEditingCell(null));
  };

  return (
    <tr>
      {record.getVisibleCells().map((cell) => {
        const colId = cell.column.id;
        const isEditing = editingCell === colId;
        const value = row[colId]; // показываем ИСКЛЮЧИТЕЛЬНО из родителя

        return (
          <td
            key={cell.id}
            className={colId === "select" ? "text-center" : "text-start"}
            style={{ cursor: colId === "select" ? "default" : "pointer", verticalAlign: "middle" }}
            onClick={(e) => {
              e.stopPropagation();
              if (colId === "name" || colId === "email") {
                setEditingCell(colId);
                setTempValue(String(value ?? "")); // инициализация инпута
              }
            }}
          >
            {colId === "select" ? (
              render(cell.column.columnDef.cell, cell.getContext())
            ) : isEditing ? (
              <AsyncSelect
                autoFocus
                cacheOptions
                defaultOptions={false}
                loadOptions={(txt) => loadOptions(txt, colId)}
                onChange={(opt) => handleSelectOption(opt, colId)}
                // 👇 Критично: НЕ обновляем tempValue, когда react-select сам чистит инпут
                onInputChange={(val, meta) => {
                  if (meta.action === "input-change") setTempValue(val);
                }}
                inputValue={tempValue}
                onBlur={handleBlur}
                onKeyDown={(e) => handleKeyDown(e, colId)}
                isClearable={false}
                backspaceRemovesValue={false}
                closeMenuOnSelect
                blurInputOnSelect
                placeholder={`Введите ${colId === "email" ? "email" : "имя"}...`}
                noOptionsMessage={() => "Нет совпадений"}
                menuPortalTarget={document.body}
                menuPlacement="auto"
                components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                styles={{
            menuPortal: base => ({ ...base, zIndex: 9999 }),
  menu: base => ({ ...base, zIndex: 9999 }),
  control: base => ({ ...base,
    minHeight: "26px",
    height: "26px",
    boxSizing: "border-box",
    border: "none",
    boxShadow: "none",
    backgroundColor: "transparent",
    fontSize: "0.875rem",
    lineHeight: "1.2",
    padding: "0 2px",
    display: "flex",
    alignItems: "center",}),
    valueContainer: (base) => ({
    ...base,
       padding: 0,
    margin: 0,
    height: "26px",
  }),
  input: (base) => ({
    ...base,
    margin: 0,
    padding: 0,
    height: "26px",
  }),
  indicatorsContainer: (base) => ({
    ...base,
    display: "none", // убираем стрелку и иконки, чтобы не влияли на высоту
  }),
                }}
              />
            ) : (
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
                  fontStyle: value ? "normal" : "italic",
                }}
              >
                {value || (colId === "name" ? "Имя" : "Email")}
              </span>
            )}
          </td>
        );
      })}
    </tr>
  );
}
