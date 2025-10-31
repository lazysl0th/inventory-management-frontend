function Record({ record, render, onClick }) {

    const handleRecordClick = () => onClick(record.original)
    //console.log(onRecordClick)

    return (
        <tr onClick={handleRecordClick}>
            {record.getVisibleCells().map(field => (
                <td key={field.id} className={field.column.id === 'select' ? 'text-center' : 'text-start'} style={{ cursor: 'pointer' }}>
                {render(field.column.columnDef.cell, field.getContext())}
                </td>
            ))}
        </tr>
    );
}

export default Record;
