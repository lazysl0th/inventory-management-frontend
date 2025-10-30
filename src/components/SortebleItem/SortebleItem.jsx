import { useCallback, useMemo } from "react";
import {
  Row, Col, Form, ButtonGroup, Button, Badge
} from "react-bootstrap";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { getAvailableParts, IdGenerator } from "../../utils/utils";
import { PART_DEFINITIONS } from "../../utils/constants";


export default function SortableItem({ part, index, total, onUpdate, onMove }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: part.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        cursor: "grab",
        background: isDragging ? "#fafafa" : "white",
        border: "1px solid #e5e7eb",
        borderRadius: "0.75rem",
        padding: "1rem",
        marginBottom: "0.75rem",
        boxShadow: isDragging ? "0 2px 8px rgba(0,0,0,.08)" : "none",
    };

    const def = PART_DEFINITIONS[part.type] || {};
    const formats = def.formats || [];

    const handleTypeChange = useCallback((e) => {
        const newType = e.target.value;
        const newDef = PART_DEFINITIONS[newType] || {};
        const defaultFormat = (newDef.formats && newDef.formats[0]?.value) || "";
        onUpdate(part.id, { type: newType, value: "", format: defaultFormat });
    }, [part.id, onUpdate]);

    const handleChange = useCallback(
        (key) => (e) => onUpdate(part.id, { [key]: e.target.value }),
        [part.id, onUpdate]
    );

    const handleMove = useCallback(
        (dir) => () => onMove(index, index + dir),
        [index, onMove]
    );

    const piecePreview = useMemo(() => IdGenerator.generatePart(PART_DEFINITIONS, part, index), [part, index]);

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Row className="align-items-start g-3 gy-4">
                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">Type</Form.Label>
                        <Form.Select value={part.type} onChange={handleTypeChange}>
                            <option value="">Choose...</option>
                                {getAvailableParts(PART_DEFINITIONS).map((p) => (
                                    <option key={p.type} value={p.type}>
                                        {p.label}
                                    </option>
                                ))}
                        </Form.Select>
                        <Form.Text className="text-muted small d-block mt-1">
                            {def?.help || "Select element type."}
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col xs={12} md={6}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">Format</Form.Label>
                        {formats.length > 0 
                            ? (<Form.Select
                                    value={part.format || formats[0]?.value || ""}
                                    onChange={handleChange("format")}
                                    disabled={part.type === "GUID"}
                                >
                                    {formats.map((f) => (
                                        <option key={f.value} value={f.value}>
                                            {f.label}
                                        </option>))}
                                </Form.Select>)
                            : (<Form.Control
                                    type="text"
                                    value={part.format || ""}
                                    onChange={handleChange("format")}
                                    placeholder="Custom format"
                                    disabled={part.type === "GUID"}
                                />)}
                        <Form.Text className="text-muted small d-block mt-1">
                        {   def?.formatHelp || "Select or enter custom format."}
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col xs={12} sm={5}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">Value / Separator</Form.Label>
                        <Form.Control
                            type="text"
                            value={part.value || ""}
                            onChange={handleChange("value")}
                            placeholder={part.type === "TEXT" ? "E.g. INV-" : "Optional symbol, e.g. - or _"}
                            disabled={part.type === "GUID"}
                        />
                        <Form.Text className="text-muted small d-block mt-1">
                            Adds prefix/suffix or static text.
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col xs={6} sm={4}>
                    <Form.Group>
                        <Form.Label className="fw-semibold">Position</Form.Label>
                        <Form.Select
                            value={part.position || "prefix"}
                            onChange={handleChange("position")}
                        >
                            <option value="prefix">Before</option>
                            <option value="suffix">After</option>
                        </Form.Select>
                        <Form.Text className="text-muted small d-block mt-1">
                            Where to add “Value”.
                        </Form.Text>
                    </Form.Group>
                </Col>
                <Col xs={6} sm={3} className="d-flex flex-column align-items-end justify-content-between">
                    <Badge bg="light" text="dark" className="mb-2 w-100 text-center">
                        {piecePreview || "—"}
                    </Badge>
                    <ButtonGroup size="sm">
                        <Button variant="outline-secondary" disabled={index === 0} onClick={handleMove(-1)}>
                            <FaChevronUp />
                        </Button>
                        <Button variant="outline-secondary" disabled={index === total - 1} onClick={handleMove(1)}>
                            <FaChevronDown />
                        </Button>
                    </ButtonGroup>
                </Col>
            </Row>
        </div>
    );
}
