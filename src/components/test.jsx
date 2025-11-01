import React, { useState, useMemo } from 'react'
import { useLazyQuery } from '@apollo/client/react';
import AsyncSelect from 'react-select/async'
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table'
import { SEARCH_USERS } from '../graphql/queries'

export default function AllowedUsersTable({ users, onAddUser }) {
  const [data, setData] = useState(users)
  const [getUsers] = useLazyQuery(SEARCH_USERS)
  const [newRow, setNewRow] = useState(null)

  const loadUserOptions = async (inputValue) => {
    if (!inputValue) return []
     const by = "EMAIL";
    const { data } = await getUsers({ variables: { searchQuery: value, by } })
    return data?.searchUsers?.map(u => ({ label: `${u.name} (${u.email})`, value: u })) || []
  }

  const handleAddRow = () => {
    setNewRow({ id: crypto.randomUUID(), name: '', email: '', isNew: true })
  }

  const handleSelectUser = (selectedOption) => {
    const u = selectedOption.value
    setData(prev => [...prev, u])
    setNewRow(null)
    onAddUser?.(u)
  }

  const columns = useMemo(() => [
    { accessorKey: 'name', header: 'Имя', cell: info => info.getValue() },
    { accessorKey: 'email', header: 'Email', cell: info => info.getValue() },
  ], [])

  const table = useReactTable({
    data: newRow ? [...data, newRow] : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <button onClick={handleAddRow}>Добавить пользователя</button>

      <table className="table">
        <thead>
          {table.getHeaderGroups().map(hg => (
            <tr key={hg.id}>
              {hg.headers.map(header => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.original.isNew ? (
                <td colSpan={2}>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadUserOptions}
                    placeholder="Введите имя или email"
                    onChange={handleSelectUser}
                  />
                </td>
              ) : (
                row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
