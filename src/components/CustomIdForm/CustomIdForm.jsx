import { useState, useRef } from "react";
import { Row, Col, Form, Button, Badge, ButtonGroup, InputGroup, Overlay, Popover} from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";
import { PART_DEFINITIONS } from "../../utils/constants";
import { getAvailableParts, IdGenerator } from "../../utils/utils";


export default function CustomIdForm({ part, index, total, onUpdate, onMove }) {
    const target = useRef(null);
    const [showPicker, setShowPicker] = useState(false);
    const partDefinition = PART_DEFINITIONS[part.type] || {};
    const formats = partDefinition.formats || [];
    const piecePreview = IdGenerator.generatePart(PART_DEFINITIONS, part);

    const stop = (e) => e.stopPropagation();


    const handleChange = (partId, index) => (e) => {
        console.log(part)
        const { name, value } = e.currentTarget
        switch (name) {
            case "type":
            onUpdate((partId), { 
                [name]: value, 
                format: PART_DEFINITIONS?.[value].defaultFormat || PART_DEFINITIONS?.[value].formats?.[0]?.value || "" } )
            break;
            case "format":
                onUpdate(partId, { [name]: value });
                break;
            case "order":
                value === 'up' ? onMove(index, index - 1) : onMove(index, index + 1)
                break;
            default:
                onUpdate(partId, { [name]: value });
                break;
        }
    }
    return (
        <Row className="align-items-start g-3 gy-4">
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
                                </option>))}
                    </Form.Select>
                    <Form.Text className="text-muted small d-block mt-1">
                        {partDefinition?.help || "Выберите тип элемента."}
                    </Form.Text>
                </Form.Group>
            </Col>
            <Col xs={12} md={6}>
                <Form.Group>
                        <Form.Label className="fw-semibold">Формат</Form.Label>
                        {part.type === 'SEQUENCE'
                            ? (<>
                                    <InputGroup>
                                        <Form.Select
                                            value={part?.format || ''}
                                            name="format"
                                            onMouseDown={stop}
                                            onChange={handleChange(part?.guid)}
                                        >
                                            {formats.map((format) => (
                                                <option key={format.value} value={format.value}>
                                                    {format.label}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        <Form.Control
                                            type="number"
                                            name="value"
                                            value={part?.value || ''}
                                            placeholder="Начальное значение"
                                            min="0"
                                            onMouseDown={stop}
                                            onChange={handleChange(part?.guid)
                                            }
                                        />
                                    </InputGroup>

                                    <Form.Text className="text-muted small d-block mt-1">
                                        Укажите формат и стартовое значение для последовательности.
                                    </Form.Text>
                                </>)
                            : formats.length > 0 
                                ? (<Form.Select
                                        value={part?.format || ''}
                                        name="format"
                                        onMouseDown={stop}
                                        onChange={handleChange(part?.guid)}
                                    >
                                        {formats.map((format) => (
                                            <option key={format.value} value={format.value}>
                                                {format.label}
                                            </option>
                                        ))}
                                    </Form.Select>)
                                : (<>
                                        <InputGroup>
                                            <Form.Control
                                                type="text"
                                                name="format"
                                                value={part?.format || ''}
                                                placeholder="Пользовательский формат"
                                                onMouseDown={stop}
                                                onChange={handleChange(part?.guid)}
                                            />
                                            <Button
                                                ref={target}
                                                variant="light"
                                                onClick={() => setShowPicker(!showPicker)}
                                            >
                                                😊
                                            </Button>
                                        </InputGroup>

                                        <Overlay target={target.current} show={showPicker} placement="bottom-end">
                                            {(props) => (
                                                <Popover {...props}>
                                                    <Popover.Body>
                                                        <EmojiPicker
                                                        onEmojiClick={(emojiData) => {
                                                            const newFormat = (part.format || '') + emojiData.emoji;
                                                            onUpdate(part.guid, { format: newFormat });
                                                            setShowPicker(false);
                                                        }}
                                                        />
                                                    </Popover.Body>
                                                </Popover>)}
                                        </Overlay>
                                    </>)}

                            <Form.Text className="text-muted small d-block mt-1">
                                {partDefinition?.formatHelp || "Укажите или выберите формат."}
                            </Form.Text>
                </Form.Group>
            </Col>

            <Col xs={12} sm={5}>
                <Form.Group>
                    <Form.Label className="fw-semibold">Разделитель</Form.Label>
                    <Form.Control
                        type="text"
                        name='separator'
                        value={part?.separator || ""}
                        placeholder="Напр., INV- или _"
                        onMouseDown={stop}
                        onChange={handleChange(part?.guid)}
                    />
                    <Form.Text className="text-muted small d-block mt-1">
                        Добавляет префикс или суффикс.
                    </Form.Text>
                </Form.Group>
            </Col>

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

            <Col xs={6} sm={3} className="d-flex flex-column align-items-center align-self-center justify-content-between">
                <ButtonGroup size="sm">
                    <Button
                        name='order'
                        value='up'
                        variant="outline-secondary"
                        disabled={index === 0}
                        onMouseDown={stop}
                        onClick={handleChange(part?.guid || part?.id, index)}
                    >
                        <FaChevronUp />
                    </Button>
                    <Button
                        name='order'
                        value='down'
                        variant="outline-secondary"
                        disabled={index === total - 1}
                        onMouseDown={stop}
                        onClick={handleChange(part?.guid || part?.id, index)}
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
