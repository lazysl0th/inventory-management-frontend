import { useState, useEffect, useMemo } from "react";
import { Form, Row, Col, Image } from "react-bootstrap";

export default function InventoryDetailsTab({ inventory, onChange, onImageFileSelect, categories, readOnly }) {


    //console.log(categories);
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
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={inventory.title  ?? ''}
                            onChange={handleChangeFields}
                            placeholder="Enter title..."
                            disabled={readOnly}
                        />
                    </Form.Group>
                </Col>
                <Col xs={12} md={8}>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="description"
                            value={inventory?.description  ?? ''}
                            onChange={handleChangeFields}
                            placeholder="Description…"
                            disabled={readOnly}
                        />
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={inventory.category  ?? ''}
                            onChange={handleChangeFields}
                            disabled={readOnly}
                            name="category"
                        >
                            <option value="" disabled> Select category… </option>
                            { categories.map((category) => ( <option key={category.name} value={category.name}> {category.name} </option>)) }
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Value definition develop (enum).
                        </Form.Text>
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="image">
                        <Form.Label>Image</Form.Label>
                        <div className="d-flex flex-column gap-2">
                            {'previewSrc' ? (
                                <Image
                                    src={'previewSrc'}
                                    alt="Preview"
                                    thumbnail
                                    style={{ maxHeight: 160, objectFit: "cover" }}
                                />
                            ) : (
                                <div
                                    className="border rounded d-flex align-items-center justify-content-center p-3 text-muted"
                                    style={{ height: 160 }}
                                >No image</div>)}

                            <Form.Control
                                type="file"
                                name="imgae"
                                accept="image/*"
                                onChange={handleFileChange}
                                disabled={readOnly}
                            />
                        </div>
                    </Form.Group>
                </Col>

                <Col xs={12} md={8}>
                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <Form.Group controlId="owner">
                                <Form.Label>Owner</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="owner"
                                    value={inventory?.owner?.name ?? ''}
                                    readOnly
                                    disabled
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="created">
                                <Form.Label>Created by</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="createdBy"
                                        value={new Date(+inventory.createdAt).toLocaleString()}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="invUpdated">
                                <Form.Label>Update at</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="updateAt"
                                        value={new Date(+inventory.updatedAt).toLocaleString()}
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
