import { useDragDropMonitor } from '@dnd-kit/react'
import { isSortable } from '@dnd-kit/react/sortable'
import type { IDragDropMonitorProps } from '../model/types'

const DragDropMonitor = ({ onDelete, onSort }: IDragDropMonitorProps) => {
    useDragDropMonitor({
        onDragEnd(event) {
            if (event.canceled) return
            const { source, target } = event.operation
            if (isSortable(source)) {
                const { initialIndex, index } = source
                if (initialIndex !== index) onSort(initialIndex, index)
            }
            if (source && target === null) onDelete([source.id])
        },
    })

    return null
}

export default DragDropMonitor
