export interface IDragDropMonitorProps {
    onDelete: (id: (number | string)[]) => void
    onSort: (initialIndex: number, index: number) => void
}
