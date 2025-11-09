import { useRef, useState } from "react";

export const useAutoSave = (delay = 8000, saveFn) => {
    const timerRef = useRef(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorAutoSave, setErrorAutoSave] = useState(null);

    const scheduleSave = (updated, version) => {
        setIsDirty(true);
        setErrorAutoSave(null);
        if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
            save(updated, version);
        }, delay);
    };

    const save = async (updated, version) => {
        setIsSaving(true);
        try {
            await saveFn(updated, version);
            setIsDirty(false);
        } catch (e) {
            setErrorAutoSave(e?.message || "Ошибка сохранения");
        } finally {
            setIsSaving(false);
        }
    };

    const flushSave = (updated, version) => {
        if (timerRef.current) clearTimeout(timerRef.current);
         save(updated, version);;
    };

    return { isDirty, isSaving, errorAutoSave, scheduleSave, flushSave };
};
