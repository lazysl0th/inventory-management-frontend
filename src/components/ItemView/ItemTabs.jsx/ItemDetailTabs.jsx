import { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";

export default function ItemDetailsTab({ item, onChange, onImageFileSelect, readOnly = false }) {


    //console.log(item);
    //console.log(item.values);


    const [localPreview, setLocalPreview] = useState(null);

    // 🖼️ Вычисляем источник для превью
    /*const previewSrc = useMemo(() => {
        return localPreview ?? value?.imageUrl ?? null;
    }, [localPreview, value?.imageUrl]);*/

    // Очистка blob-ссылок при размонтировании
    useEffect(() => {
        return () => {
            if (localPreview && localPreview.startsWith("blob:")) {
                URL.revokeObjectURL(localPreview);
            }
        };
    }, [localPreview]);

    const handleChangeFields = (e) => onChange(e.target.name, e.target.value)

    // ✅ Стандартный onChange, никакого кастомного event handler в DOM
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const blobUrl = URL.createObjectURL(file);
        setLocalPreview((prev) => {
            if (prev && prev.startsWith("blob:")) URL.revokeObjectURL(prev);
            return blobUrl;
        });

        // вызываем кастомный проп — он не идёт в DOM
        if (onImageFileSelect) onImageFileSelect(file);
    };


    return (
        <Form>
            <Row className="g-3">
                <Col xs={12}>
                    {
                        item.values?.toSorted((a, b) => a.field.order - b.field.order).map(value => 
                        (
                            <Form.Group key={value.field.id} controlId={value.field.title}>
                                <Form.Label>{value.field.title}</Form.Label>
                                <Form.Control
                                    type={value.field.type}
                                    name={value.field.title}
                                    value={value?.value  ?? ''}
                                    onChange={handleChangeFields}
                                    placeholder="Enter value..."
                                    disabled={readOnly}
                                />
                            </Form.Group>
                        )
                        )
                    }

                </Col>

                <Col xs={12} md={8}>
                    <Row className="g-3">
                        <Col xs={12} md={4}>
                            <Form.Group controlId="owner">
                                <Form.Label>Owner</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="owner"
                                    value={item?.owner?.name ?? ''}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={4}>
                            <Form.Group controlId="created">
                                <Form.Label>Created by</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="createdBy"
                                        value={new Date(+item?.createdAt).toLocaleString()}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={4}>
                            <Form.Group controlId="invUpdated">
                                <Form.Label>Update at</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="updateAt"
                                        value={new Date(+item?.updatedAt).toLocaleString()}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}