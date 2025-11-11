import { useRef, useState } from "react";
import { useTranslation } from 'react-i18next';

export const useAutoSave = (delay = 8000, saveFn) => {
    const timerRef = useRef(null);
    const [isDirty, setIsDirty] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [errorAutoSave, setErrorAutoSave] = useState(null);
    const { t } = useTranslation("common");

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
            setErrorAutoSave(e?.message || t("toasts.saveError"));
        } finally {
            setIsSaving(false);
        }
    };

    const flushSave = (updated, version) => {
        if (timerRef.current) clearTimeout(timerRef.current);
         save(updated, version);;
    };

    const cancelSave = () => {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        setIsDirty(false);
    };

    return { isDirty, isSaving, errorAutoSave, scheduleSave, flushSave, cancelSave };
};
