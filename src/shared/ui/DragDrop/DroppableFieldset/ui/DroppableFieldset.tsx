import { useDroppable } from '@dnd-kit/react'
import { IDroppableFieldset } from '../model/types'

const DroppableFieldset = ({ id, children }: IDroppableFieldset) => {
    const { ref } = useDroppable({ id })

    return (
        <fieldset
            ref={ref}
            className='d-flex flex-column gap-2 border border-transparent border-1 rounded p-2'
        >
            {children}
        </fieldset>
    )
}

export default DroppableFieldset
