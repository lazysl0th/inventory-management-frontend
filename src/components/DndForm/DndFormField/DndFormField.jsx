import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function DndFormField({ id, disabled, children, }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
        background: isDragging ? "#fafafa" : "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "0.75rem",
        boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,.1)" : "none",
        opacity: isDragging ? 0.9 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...(!disabled ? listeners : {})}>
            {children}
        </div>
    );
}
