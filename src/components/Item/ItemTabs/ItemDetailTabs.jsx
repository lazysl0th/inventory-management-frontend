import { useMemo } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import FieldInput from './FieldInput';
import LikeButton from "./LikeButton";


export default function ItemDetailsTab({ item, customIdFormat, handlerChangeItem, onShowToast, onUploadImage, readAccess, disabled }) {
    const { t } = useTranslation("item");

    const getKey = (value) => value.guid ?? value.id;
    const handlerChange = (id, changes) => {
        const updated = item.values.map(value => getKey(value) === id ? { ...value, ...changes } : value);
        handlerChangeItem('values', updated)
    }
    const handleChangeCustomID = (name) => (e) => handlerChangeItem(name, e.target.value)

    const buildMaskFromSummary = (summary = "") => {
        const chars = Array.from(summary);
        const pattern = chars.map((ch) => {
            if (/\p{Number}/u.test(ch)) return "\\p{Number}";
            if (/\p{Letter}/u.test(ch)) return "\\p{Letter}";
            if (/\p{Emoji}/u.test(ch)) return "\\p{Emoji}";
            return ch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }).join("");
        return new RegExp(`^${pattern}$`, "u");
    };
    const mask = useMemo(() => buildMaskFromSummary(customIdFormat?.summary ?? ""),[customIdFormat?.summary]);
    return (
        <Form>
            <Row className="g-3 justify-content-end">
                <Col xs={12}>
                    <Form.Group controlId="id">
                        <Form.Label>{t("labels.customId")}</Form.Label>
                        <Form.Control
                            name="customId"
                            value={item?.customId}
                            onChange={handleChangeCustomID("customId")}
                            className="form-control"
                            isInvalid={item?.customId && !mask.test(item.customId)}
                            disabled={disabled}
                        />
                        <Form.Control.Feedback type="invalid">
                            {t("feedback.invalidCustomId")} {customIdFormat?.summary}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    {item?.values.toSorted((a, b) => a.order - b.order).map(value => 
                        (<FieldInput
                            key={value?.field.id}
                            field={value.field}
                            value={{id: getKey(value), value: value.value}}
                            handlerChangeFieldInput={handlerChange}
                            onUploadImage={onUploadImage}
                            onShowToast={onShowToast}
                            disabled={disabled}
                        />))}
                </Col>
                <Col xs={12}>
                    <Row className="g-3">
                        <Col xs={12} md={4}>
                            <Form.Group controlId="owner">
                                <Form.Label>{t("labels.owner")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="owner"
                                    value={item?.owner?.name ?? ''}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Group controlId="created">
                                <Form.Label>{t("labels.createdBy")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="createdBy"
                                        value={item?.createdAt ?? ''}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={3}>
                            <Form.Group controlId="updated">
                                <Form.Label>{t("labels.updateAt")}</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="updateAt"
                                        value={item?.updatedAt ?? ''}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>
                        <Col xs={2} className="d-flex justify-content-end align-items-end">
                              <LikeButton
                                itemId={item.id}
                                likedByMe={item.likedByMe}
                                likesCount={item.likesCount}
                                readAccess={readAccess}
                                onShowToast={onShowToast}
                            />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}