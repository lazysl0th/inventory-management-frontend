export default function Record({ record, render, onClick }) {

    const handleRecordClick = () => { onClick ? onClick(record.original) : null }

    return (
        <tr onClick={handleRecordClick}>
            {record.getVisibleCells().map(cell => (
                <td key={cell.id} className={cell.column.id === 'select' ? 'text-center' : 'text-start'} style={{ cursor: 'pointer' }}>
                    {render(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
}
