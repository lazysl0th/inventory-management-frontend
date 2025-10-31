import { Row, Col, Form, Button, Badge, ButtonGroup } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { PART_DEFINITIONS } from "../../utils/constants";
import { getAvailableParts, IdGenerator } from "../../utils/utils";


export default function CustomIdForm({ part, index, total, onUpdate, onMove }) {

    const def = PART_DEFINITIONS[part.type] || {};
    const formats = def.formats || [];
    const piecePreview = IdGenerator.generatePart(PART_DEFINITIONS, part);

    const stop = (e) => e.stopPropagation();


    const handleChange = (partId, index) => (e) => {
        const { name, value } = e.currentTarget
        switch (name) {
            case "type":
            onUpdate((partId), { 
                [name]: value, 
                value: "", 
                format: PART_DEFINITIONS[value].defaultFormat || PART_DEFINITIONS[value].formats?.[0]?.value || "" } )
            break;
            case "format":
                onUpdate(partId, { [name]: value });
                break;
            case "order":
                value === 'up' ? onMove(index, --index) : onMove(index, ++index)
                break;
            default:
                onUpdate(partId, { [name]: value });
                break;
        }
    }

  return (
    
            <Row className="align-items-start g-3 gy-4">
              {/* Тип части */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Тип</Form.Label>
                  <Form.Select
                    value={part?.type}
                    onMouseDown={stop}
                    name='type'
                    onChange={handleChange(part?.guid)}
                  >
                    <option value="">Выберите...</option>
                    {getAvailableParts(PART_DEFINITIONS).map((part) => (
                      <option key={part.type} value={part.type}>
                        {part.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted small d-block mt-1">
                    {def?.help || "Выберите тип элемента."}
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Формат */}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Формат</Form.Label>
                  {formats.length > 0 ? (
                    <Form.Select
                        value={part?.format || ""}
                        name='format'
                        onMouseDown={stop}
                        onChange={handleChange(part?.guid)}
                    >
                      {formats.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                        </option>
                      ))}
                    </Form.Select>
                  ) : (
                    <Form.Control
                      type="text"
                      name='format'
                      value={part?.format || ""}
                      placeholder="Пользовательский формат"
                      onMouseDown={stop}
                      onChange={handleChange(part?.guid)}
                    />
                  )}
                  <Form.Text className="text-muted small d-block mt-1">
                    {def?.formatHelp || "Укажите или выберите формат."}
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Значение / Разделитель */}
              <Col xs={12} sm={5}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Значение / Разделитель</Form.Label>
                  <Form.Control
                    type="text"
                    name='value'
                    value={part?.value || ""}
                    placeholder="Напр., INV- или _"
                    onMouseDown={stop}
                    onChange={handleChange(part?.guid)}
                  />
                  <Form.Text className="text-muted small d-block mt-1">
                    Добавляет префикс или суффикс.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Позиция */}
              <Col xs={6} sm={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Позиция</Form.Label>
                  <Form.Select
                    name='position'
                    value={part?.position}
                    onMouseDown={stop}
                    onChange={handleChange(part?.guid)}
                  >
                    <option value="prefix">Перед</option>
                    <option value="suffix">После</option>
                  </Form.Select>
                  <Form.Text className="text-muted small d-block mt-1">
                    Определяет, где добавляется разделитель.
                  </Form.Text>
                </Form.Group>
              </Col>

              {/* Управление */}
              <Col
                xs={6}
                sm={3}
                className="d-flex flex-column align-items-center align-self-center justify-content-between"
              >

                <ButtonGroup size="sm">
                  <Button
                    name='order'
                    value='up'
                    variant="outline-secondary"
                    disabled={part?.order === 0}
                    onMouseDown={stop}
                    onClick={handleChange(part?.guid, index)}
                  >
                    <FaChevronUp />
                  </Button>
                  <Button
                    name='order'
                    value='down'
                    variant="outline-secondary"
                    disabled={part?.order === total - 1}
                    onMouseDown={stop}
                    onClick={handleChange(part?.guid, index)}
                  >
                    <FaChevronDown />
                  </Button>
                </ButtonGroup>
                <Badge bg="light" text="dark" className="my-3 w-100 text-center">
                  {piecePreview || "—"}
                </Badge>
              </Col>
            </Row>
          
  );
}
