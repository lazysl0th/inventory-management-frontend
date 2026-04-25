import { useCallback } from 'react'

interface ISortableHandlers<T> {
    addHandler: (item: T) => void
    deleteHandler: (ids: (string | number)[]) => void
    sortHandler: (from: number, to: number) => void
}

export default function useSortableHandlers<T extends object>(
    value: T[],
    setValue: (value: T[]) => void,
    getId: (item: T) => string | number
): ISortableHandlers<T> {
    const deleteHandler = useCallback(
        (ids: (string | number)[]) => {
            const setIds = new Set(ids)
            setValue(
                value
                    .filter((item) => !setIds.has(getId(item)))
                    .map((item, index) =>
                        'order' in item && typeof item.order === 'number'
                            ? {
                                  ...item,
                                  order: index,
                              }
                            : item
                    )
            )
        },
        [value, setValue, getId]
    )

    const addHandler = useCallback(
        (newItem: T) => {
            setValue([
                ...value,
                'order' in newItem && typeof newItem.order === 'number'
                    ? {
                          ...newItem,
                          order: value.length,
                      }
                    : newItem,
            ])
        },
        [value, setValue]
    )

    const sortHandler = useCallback(
        (from: number, to: number) => {
            if (to < 0 || to >= value.length) return

            const sortArray = [...value]
            const [moved] = sortArray.splice(from, 1)
            sortArray.splice(to, 0, moved)

            setValue(
                sortArray.map((item, index) => ({
                    ...item,
                    order: index,
                }))
            )
        },
        [value, setValue]
    )

    return { addHandler, deleteHandler, sortHandler }
}
