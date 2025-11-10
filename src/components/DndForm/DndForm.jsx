import { useCallback, useRef } from "react";
import { Card, Button, Badge} from "react-bootstrap";
import { DndContext, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { VscAdd } from "react-icons/vsc";
import { useTranslation } from 'react-i18next';
import { SafeMouseSensor, SafeTouchSensor } from "../../utils/utils";

export default function DndForm({
    title,
    fields = [],
    onChange,
    createNewItem,
    renderItem,
    fullId,
    disabled,
    addLabel,
    className,
}) {
    const formRef = useRef(null);
    const { t } = useTranslation("inventory");
    const sensors = useSensors(
        useSensor(SafeMouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(SafeTouchSensor)
    );

    const getKey = useCallback((field) => field.guid ?? field.id, []);

    const handleUpdate = useCallback((key, changes) => {
        const updated = fields.map((field) => (getKey(field) === key ? { ...field, ...changes } : field));
        onChange(updated);
    }, [fields, onChange, getKey]);

    const handleAdd = useCallback(() => {
        const newItem = createNewItem(fields);
        if (newItem == null) return;
        onChange([...fields, newItem]);
    }, [fields, createNewItem, onChange]);

    const handleMove = useCallback((from, to) => {
        if (!onChange) return;
        if (to < 0 || to >= fields.length) return;
        onChange(arrayMove(fields, from, to));
    }, [fields, onChange]);

    const handleDragEnd = useCallback(({ active, over, delta }) => {
        if (!onChange) return;
        const rect = formRef.current?.getBoundingClientRect();
        if (rect && (Math.abs(delta.y) > rect.height / 2 || Math.abs(delta.x) > rect.width / 2)) {
            onChange(fields.filter((field) => (getKey(field) !== active.id)));
            return;
        }
        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((field) => getKey(field) === active.id);
            const newIndex = fields.findIndex((field) => getKey(field) === over.id);
            onChange(arrayMove(fields, oldIndex, newIndex));
        }
    }, [fields, onChange]);

    return (
        <Card className={`p-3 shadow-sm ${className}`}>
            {title && <h5 className="mb-3">{t(`dndForm.${title}`)}</h5>}

            <div ref={formRef}>
                <DndContext sensors={disabled ? undefined : sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields?.map(getKey)?.filter(Boolean)} strategy={verticalListSortingStrategy} disabled={disabled}>
                        {fields?.toSorted((a, b) => a.order - b.order).map((field, index) => (
                            <div key={getKey(field)}>
                                {renderItem({
                                    field,
                                    index,
                                    total: fields.length,
                                    onUpdate: handleUpdate,
                                    onMove: handleMove,
                                })}
                            </div>))}
                    </SortableContext>
                </DndContext>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <Button variant="outline-primary" size="sm" disabled={disabled} onClick={handleAdd}>
                    <VscAdd /> {t(`dndForm.${addLabel}`)}
                </Button>
                { fullId ? (<Badge bg="dark" className="p-2">{t("badges.example")}&nbsp;{fullId || "—"}</Badge>) : (<></>) }
            </div>
        </Card>
    );
}
