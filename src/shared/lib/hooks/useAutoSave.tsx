import { useRef } from 'react'

interface useAutoSaveProps<T> {
    delay: number
    saveFn: () => Promise<T>
}

const useAutoSave = <T,>({ delay = 8000, saveFn }: useAutoSaveProps<T>) => {
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

    const scheduleSave = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            saveFn()
        }, delay)
    }

    const cancelSave = () => {
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = null
    }

    return {
        scheduleSave,
        cancelSave,
    }
}

export default useAutoSave
