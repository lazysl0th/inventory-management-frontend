import { useState } from "react";
import AsyncSelect from "react-select/async";
import { useLazyQuery } from '@apollo/client/react';
import { SEARCH_USERS } from '../../../graphql/queries';


export default function EditableCell ({ record, onChange }) {
    const [editing, setEditing] = useState(false);
    console.log(record);
    const user = record.original; 
    const [searchUsers] = useLazyQuery(SEARCH_USERS, { fetchPolicy: 'no-cache' });
    
    const loadOptions = async (value) => {
        const by = column?.id === "email" ? "EMAIL" : "NAME";
        const { data } = await searchUsers({ variables: { searchQuery: value, by } });
        return (
            data?.searchUsers?.map((u) => ({
                label: `${u.name} (${u.email})`,
                value: column?.id === "email" ? u.email : u.name,
            })) ?? []
        );
    }
    
    const handleSelectOption = (option) => {
        if (!option) return;
        onChange(option.value);
    };

      const handleClick = () => setEditing(true);

  const handleBlur = () => setTimeout(() => setEditing(false), 150);
    
    //const handleChange = (val, meta) => { if (meta.action === "input-change") onChange(val); }
/*
    const handleBlur = () => {
        onEndEdit();
    }

    const stop = (e) => e.stopPropagation();

    const editHandle = (e) => {
        stop(e);
        onStartEdit()
    }
    */    

    return (
<tr>
      {editing ? (
        <td colSpan={2}>
          <AsyncSelect
            autoFocus
            cacheOptions
            defaultOptions={false}
            loadOptions={loadOptions}
            onChange={handleSelectOption}
            onBlur={handleBlur}
            placeholder="Введите имя или email..."
            noOptionsMessage={() => "Нет совпадений"}
            menuPortalTarget={document.body}
            menuPlacement="auto"
            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                minHeight: "28px",
                height: "28px",
                border: "1px solid #ddd",
                fontSize: "0.875rem",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 4px",
              }),
            }}
          />
        </td>
      ) : (
        <>
          <td onClick={handleClick} style={{ cursor: "pointer" }}>
            {user.name || <em className="text-muted">Имя</em>}
          </td>
          <td onClick={handleClick} style={{ cursor: "pointer" }}>
            {user.email || <em className="text-muted">Email</em>}
          </td>
        </>
      )}
    </tr>
        /*isEditing ? (
          <AsyncSelect
            cacheOptions
            defaultOptions={false}
            loadOptions={loadOptions}
            placeholder="Введите имя или email..."
            onChange={handleSelectOption}
            onBlur={handleBlur}
            noOptionsMessage={() => "Нет совпадений"}
            menuPortalTarget={document.body}
            menuPlacement="auto"
            components={{ DropdownIndicator: null, IndicatorSeparator: null }}
            styles={{
              menuPortal: (base) => ({ ...base, zIndex: 9999 }),
              menu: (base) => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                minHeight: "28px",
                height: "28px",
                border: "1px solid #ddd",
                fontSize: "0.875rem",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 4px",
              }),
            }}
          />
        ) : (
          <div
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              height: "28px",
              padding: "0 4px",
              borderRadius: 4,
              background: "transparent",
              fontSize: "0.875rem",
            }}
            onClick={handleCellClick}
          >
            <span>
              {record.name ? `${record.name}` : <em className="text-muted">Имя</em>}{" "}
              {record.email ? `(${record.email})` : ""}
            </span>
            <span style={{ color: "#999", fontSize: 12 }}>✏️</span>
          </div>
        )}
      </td>
    </tr>
  );*/
     /* { isEd
                ? (<AsyncSelect
                        ref={selectRef}
                        value={value ? { label: value, value } : null}
                        autoFocus
                        loadOptions={loadOptions}
                        defaultOptions={false}
                        onChange={handleSelectOption}
                        onBlur={handleBlur}
                        placeholder={column.header}
                    
                        menuPortalTarget={document.body}
                        defaultInputValue={value ?? ""}
                        menuPlacement="auto"
                        components={{ DropdownIndicator: null, IndicatorSeparator: null }}
                        noOptionsMessage={() => "Нет совпадений"}
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
                    />) 
                : ( <span 
                        style={{
    cursor: "text",
    display: "block",
    height: 26,
    lineHeight: "26px",
    padding: "0 2px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }}
                        onClick={editHandle}
                    >
                        {value || <em className="text-muted">—</em>}
                    </span>
                )}
        </>)
        }*/)}