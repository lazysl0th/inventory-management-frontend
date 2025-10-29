import { useContext, useState, useEffect } from 'react';
import { Form, Row, Col, Image } from "react-bootstrap";
import { CurrentUserContext } from '../../../context/CurrentUserContext';

export default function InventoryDetailsTab({
    categories,
    details,
    handlerChangeDetails,
    onImageFileSelect,
    readOnly
}) {
    //console.log(details);
    const currentUser = useContext(CurrentUserContext);


    //console.log(categories);


    const handleChange = (e) => {
        const { name, value } = e.target
        handlerChangeDetails(name, value);
    }
    
    
    //const [image, setImage] = useRef();
    


    
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
                            value={details.title}
                            onChange={handleChange}
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
                            value={details.description}
                            onChange={handleChange}
                            placeholder="Description…"
                            disabled={readOnly}
                        />
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="category">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                            value={details.category}
                            onChange={handleChange}
                            disabled={readOnly}
                            name="category"
                        >
                            <option value="" disabled> Select category… </option>
                            { categories?.enumValues.map((category) => ( 
                                <option key={category.name} value={category.name}> {category.name} </option>)) }
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
                                    value={details.owner ? details.owner : currentUser.name}
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
                                        name="createdAt"
                                        value={details.createdAt}
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
                                        value={details.updatedAt}
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
