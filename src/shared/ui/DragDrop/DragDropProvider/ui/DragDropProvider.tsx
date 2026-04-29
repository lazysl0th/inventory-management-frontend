import { DragDropProvider } from '@dnd-kit/react'
import type { IDragDropContextProps } from '../model/types'

const DragDropContext = ({ children }: IDragDropContextProps) => {
    return <DragDropProvider>{children}</DragDropProvider>
}

export default DragDropContext
