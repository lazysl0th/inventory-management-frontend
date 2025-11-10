import { Row, Col, Form, Button, Badge, ButtonGroup } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { FIELD_TYPES } from "../../utils/constants";
import { useTranslation } from "react-i18next";


export default function ItemFieldsForm({ field, index, total, onUpdate, onMove, disabled }) {
    const { t } = useTranslation("inventory");
    
    const handleChange = (fieldGuid, index) => (e) => {
        const { name, value, checked} = e.currentTarget;
        switch (name) {
            case 'showInTable':
                onUpdate(fieldGuid, { [name]: checked });
                break;
            case "order":
                value === 'up' ? onMove(index, index - 1) : onMove(index, index + 1)
                break;
            default:
                onUpdate(fieldGuid, { [name]: value });
                break;
        }
    }
    
    const stop = (e) => e.stopPropagation();
    
    return (
        <fieldset disabled={disabled}>
        <Row className="align-items-start g-3 gy-4">
            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">{t("labels.title")}</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={field?.title || ""}
                        placeholder={t("placeholders.title")}
                        onMouseDown={stop}
                        onChange={handleChange(field?.guid || field?.id)}
                    />
                </Form.Group>
            </Col>

            <Col xs={12} md={6}>
                <Form.Group>
                    <Form.Label className="fw-semibold">{t("labels.description")}</Form.Label>
                    <Form.Control
                        as="textarea"
                        name='description'
                        rows={2}
                        value={field.description || ""}
                        placeholder={t("placeholders.descriptionField")}
                        onMouseDown={stop}
                        onChange={handleChange(field?.guid || field?.id)}
                    />
                </Form.Group>
            </Col>

            <Col xs={12} sm={5}>
                <Form.Group>
                    <Form.Label className="fw-semibold">{t("labels.type")}</Form.Label>
                    <Form.Select
                        value={field.type}
                        onMouseDown={stop}
                        name='type'
                        onChange={handleChange(field?.guid || field?.id)}
                    >
                        {Object.entries(FIELD_TYPES).map(([key, cfg]) => (
                            <option key={key} value={key}>
                            {t(`fieldsTypes.${cfg.label}`)}
                        </option>))}
                    </Form.Select>
                </Form.Group>
            </Col>

            <Col xs={12} sm={4}>
                <Form.Check
                    type="checkbox"
                    name='showInTable'
                    label={t("labels.showInTable")}
                    checked={!!field?.showInTable}
                    onMouseDown={stop}
                    onChange={handleChange(field?.guid || field?.id)}
                />
            </Col>

            <Col xs={12} sm={3} className="d-flex flex-column align-items-center align-self-center justify-content-between">
                <Badge bg="light" text="dark" className="mb-2 w-100 text-center">
                    {t("badges.position")} {index}
                </Badge>
                <ButtonGroup size="sm">
                    <Button
                        variant="outline-secondary"
                        name='order'
                        value='up'
                        disabled={index === 0}
                        onMouseDown={stop}
                        onClick={handleChange(field?.guid || field?.id, index)}
                    >
                        <FaChevronUp />
                    </Button>
                    <Button
                        variant="outline-secondary"
                        name='order'
                        value='down'
                        disabled={index === total - 1}
                        onMouseDown={stop}
                        onClick={handleChange(field?.guid || field?.id, index)}
                    >
                        <FaChevronDown />
                    </Button>
                </ButtonGroup>
            </Col>
        </Row>
        </fieldset>
    )
}
