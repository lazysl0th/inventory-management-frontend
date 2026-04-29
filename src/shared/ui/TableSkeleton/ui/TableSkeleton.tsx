import { Placeholder, Table } from 'react-bootstrap'
import type { ITableSkeletonProps } from '../model/types'

export const TableSkeleton = ({
    rows = 5,
    columns = 4,
}: ITableSkeletonProps) => {
    return (
        <Table bordered hover>
            <thead>
                <tr>
                    {Array.from({ length: columns }).map((_, i) => (
                        <th key={i}>
                            <Placeholder animation='glow'>
                                <Placeholder xs={8} />
                            </Placeholder>
                        </th>
                    ))}
                </tr>
            </thead>

            <tbody>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <td key={colIndex}>
                                <Placeholder animation='glow'>
                                    <Placeholder xs={10} />
                                </Placeholder>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </Table>
    )
}

export default TableSkeleton
