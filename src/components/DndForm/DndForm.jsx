import { useCallback, useRef } from "react";
import { Card, Button, Badge} from "react-bootstrap";
import { DndContext, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { SafeMouseSensor, SafeTouchSensor } from "../../utils/utils";

export default function DndForm({
    title,
    fields = [],
    onChange,
    createNewItem,
    renderItem,
    fullId,
    addLabel = "Add element",
    className = "",
}) {

    //console.log(fields);

    const formRef = useRef(null);
    
    const sensors = useSensors(
        useSensor(SafeMouseSensor, { activationConstraint: { distance: 5 } }),
        useSensor(SafeTouchSensor)
    );

    const handleUpdate = useCallback((guid, changes) => {
        //console.log(guid, changes)
        const updated = fields.map((field) => (field.guid === guid ? { ...field, ...changes } : field));
                console.log(updated)

        onChange(updated);
    }, [fields, onChange]
  );

  const handleAdd = useCallback(() => {
    if (typeof createNewItem !== "function" && !onChange) return;
    const newItem = createNewItem(fields);
    onChange([...fields, newItem]);
  }, [fields, createNewItem, onChange]);

  const handleMove = useCallback(
    (from, to) => {
      if (!onChange) return;
      if (to < 0 || to >= fields.length) return;
      onChange(arrayMove(fields, from, to));
    },
    [fields, onChange]
  );

  const handleDragEnd = useCallback(
    ({ active, over, delta }) => {
      if (!onChange) return;
      const rect = formRef.current?.getBoundingClientRect();

      if (rect && (Math.abs(delta.y) > rect.height / 2 || Math.abs(delta.x) > rect.width / 2)) {
        onChange(fields.filter((it) => it.id !== active.id));
        return;
      }

      if (over && active.id !== over.id) {
        const oldIndex = fields.findIndex((i) => i.id === active.id);
        const newIndex = fields.findIndex((i) => i.id === over.id);
        onChange(arrayMove(fields, oldIndex, newIndex));
      }
    },
    [fields, onChange]
  );

    return (
        <Card className={`p-3 shadow-sm ${className}`}>
            {title && <h5 className="mb-3">{title}</h5>}

            <div ref={formRef}>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={fields.map(field => field?.id).filter(Boolean)} strategy={verticalListSortingStrategy}>
                        {fields.filter(Boolean).map((field, index) => (
                            <div key={field.id || field.guid}>
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
                <Button variant="outline-primary" size="sm" onClick={handleAdd}> + {addLabel} </Button>
                { fullId ? (<Badge bg="dark" className="p-2">Example:&nbsp;{fullId || "—"}</Badge>) : (<></>) }
            </div>
        </Card>
    );
}
