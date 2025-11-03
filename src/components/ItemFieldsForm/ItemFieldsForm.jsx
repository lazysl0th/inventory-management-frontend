import { Row, Col, Form, Button, Badge, ButtonGroup } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { FIELD_TYPES } from "../../utils/constants";

export default function ItemFieldsForm({ field, index, total, onUpdate, onMove }) {
    const handleChange = (fieldGuid, index) => (e) => {
        const { name, value, checked} = e.target;
        switch (name) {
            case 'showInTable':
                onUpdate(fieldGuid, { [name]: checked });
                break;
            case "order":
                value === 'up' ? onMove(index, --index) : onMove(index, ++index)
                break;
            default:
                onUpdate(fieldGuid, { [name]: value });
                break;
        }
    }
    
    const stop = (e) => e.stopPropagation();
    
    return (
        <Row className="align-items-start g-3 gy-4">
            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">Заголовок</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={field?.title || ""}
                        placeholder="Введите заголовок"
                        onMouseDown={stop}
                        onChange={handleChange(field.guid)}
                    />
                </Form.Group>
            </Col>

            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        name='description'
                        rows={2}
                        value={field.description || ""}
                        placeholder="Описание (опционально)"
                        onMouseDown={stop}
                        onChange={handleChange(field.guid)}
                    />
                </Form.Group>
            </Col>

            <Col xs={12} sm={5}>
                <Form.Group>
                    <Form.Label className="fw-semibold">Тип</Form.Label>
                    <Form.Select
                        value={field.type}
                        onMouseDown={stop}
                        name='type'
                        onChange={handleChange(field.guid)}
                    >
                        {Object.entries(FIELD_TYPES).map(([key, cfg]) => (
                            <option key={key} value={key}>
                            {cfg.label}
                        </option>))}
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
                <Form.Check
                    type="checkbox"
                    name='showInTable'
                    label="Показывать в таблице"
                    checked={field?.showInTable}
                    onMouseDown={stop}
                    onChange={handleChange(field.guid)}
                />
            </Col>

            <Col xs={12} sm={3} className="d-flex flex-column align-items-center align-self-center justify-content-between">
                <Badge bg="light" text="dark" className="mb-2 w-100 text-center">
                    Position {field.order}
                </Badge>
                <ButtonGroup size="sm">
                    <Button
                        variant="outline-secondary"
                        name='order'
                        value='up'
                        disabled={field?.order === 0}
                        onMouseDown={stop}
                        onClick={handleChange(field?.guid || field?.id, index)}
                    >
                        <FaChevronUp />
                    </Button>
                    <Button
                        variant="outline-secondary"
                        name='order'
                        value='down'
                        disabled={field?.order === total - 1}
                        onMouseDown={stop}
                        onClick={handleChange(field?.guid || field?.id, index)}
                    >
                        <FaChevronDown />
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
    )
}
