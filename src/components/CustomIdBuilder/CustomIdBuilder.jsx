import { useState, useMemo, useCallback, useRef } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { VscAdd } from "react-icons/vsc";
import { DndContext, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SortableItem from "../SortebleItem/SortebleItem";
import { SafeMouseSensor, SafeTouchSensor, IdGenerator } from "../../utils/utils";


export default function CustomIdForm({ parts: initial = [], onChange }) {
    const [parts, setParts] = useState(initial);
    const formRef = useRef(null);

    const sensors = useSensors(
        useSensor(SafeMouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(SafeTouchSensor)
    );

    const handleUpdate = useCallback((id, changes) => { setParts(prev => prev.map(p => (p.id === id ? { ...p, ...changes } : p))); }, []);

    const handleAdd = useCallback(() => {
        setParts(prev => [
            ...prev,
            { id: crypto.randomUUID(), type: "TEXT", format: "", value: "", position: "prefix" },
        ]);
    }, []);

    const handleMove = useCallback((from, to) => {
        setParts(prev => {
            if (to < 0 || to >= prev.length) return prev;
            return arrayMove(prev, from, to);
        });
    }, []);

    const handleDragEnd = useCallback(({ active, over, delta }) => {
        const rect = formRef.current?.getBoundingClientRect();
        if (rect && (Math.abs(delta.y) > rect.height/2 || Math.abs(delta.x) > rect.width/2)) {
            setParts(prev => prev.filter(p => p.id !== active.id));
            return;
        }
        if (over && active.id !== over.id) {
            setParts(items => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }, []);

  const fullId = useMemo(() => IdGenerator.generateFromParts(parts), [parts]);
  if (typeof onChange === "function") onChange(parts, fullId);

    return (
        <Card className="p-3 shadow-sm">
            <p className="text-muted mb-2"> Add elements, choose a format, drag to reorder, or drag out to delete.</p>
            <div ref={formRef}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={parts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                    {parts.map((p, i) => (
                    <SortableItem
                        key={p.id}
                        part={p}
                        index={i}
                        total={parts.length}
                        onUpdate={handleUpdate}
                        onMove={handleMove}
                    />
                    ))}
                </SortableContext>
                </DndContext>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                <Button variant="outline-primary" size="sm" onClick={handleAdd}>
                    <VscAdd/> Add element
                </Button>
                <Badge bg="dark" className="p-2">Example:&nbsp;{fullId || "—"}</Badge>
            </div>
        </Card>
    );
}
