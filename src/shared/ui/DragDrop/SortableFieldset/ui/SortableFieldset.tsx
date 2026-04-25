import { DragOverlay } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import './SortableFieldset.scss'
import { IFieldsetProps } from '../model/types'

const SortableFieldset = ({
    id,
    index,
    children,
    disabled,
}: IFieldsetProps) => {
    const { ref } = useSortable({
        id,
        index,
        disabled,
    })

    return (
        <>
            <fieldset
                ref={ref}
                role={disabled ? 'fieldset' : 'button'}
                className={`border border-transparent border-1 rounded p-2 bg-white ${disabled ? '' : 'fieldset-sortable'}`}
            >
                {children}
            </fieldset>
            <DragOverlay>
                <fieldset className='border border-transparent border-1 rounded p-2 bg-white part-id'>
                    {children}
                </fieldset>
            </DragOverlay>
        </>
    )
}

export default SortableFieldset
