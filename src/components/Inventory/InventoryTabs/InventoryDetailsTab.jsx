import { useContext, useState, useEffect, } from 'react';
import { useLazyQuery, } from '@apollo/client/react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { Form, Row, Col, Image } from "react-bootstrap";
import { CurrentUserContext } from '../../../context/CurrentUserContext';
import { uploadImage } from '../../../utils/imageApi';
import { SEARCH_TAGS } from '../../../graphql/queries';

export default function InventoryDetailsTab({
    formikValues,
    categories,
    inventoryTags,
    details,
    formikHandlerChange,
    formikErrors,
    formikBlur,
    formikTouched,
    handlerChangeDetails,
    readOnly
}) {
    const currentUser = useContext(CurrentUserContext);
    const [searchTags] = useLazyQuery(SEARCH_TAGS, { fetchPolicy: "no-cache" });

    const loadOptions = async (inputValue, callback) => {
        const { data } = await searchTags({ variables: { searchQuery: inputValue } });
        const selectedIds = new Set(inventoryTags?.map((tag) => tag.id));
        const options = data?.searchTags?.filter((tag) => !selectedIds.has(tag.id)).map((tag) => ({ value: tag.id, label: tag.name })) ?? [];
        callback(options);
    };

    const handleFormikChange = (e) => {
        formikHandlerChange(e);
        handlerChangeDetails(e.target.name, e.target.value);
    };

    const handleChange = (options) => {
        if (options?.map) handlerChangeDetails('tags', (options).map((o) => ({ id: o.value, name: o.label })));
        else if (options.target.files?.[0]) handlerChangeImage(options);
        else handleFormikChange(options);
    }

    const handlerChangeImage = async (e) => {
        if (!e.target.files[0]) return;
        const image = await handleUploadImage(e.target.files[0]);
        handlerChangeDetails(e.target.name, image.url);
    };

    const handleUploadImage = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        try {
            const data = uploadImage(formData);
            console.log("Ответ сервера:", data);
            return data;
        } catch (e) {
            console.log("Ошибка при загрузке:", e);
        }
    }

    const handleAddTag = (inputValue) => {
        const name = inputValue.trim();
        if (!name) return;
        const newTag = {
            guid: crypto.randomUUID(),
            id: null,
            name: name,
        };
        handlerChangeDetails('tags', [...inventoryTags || [], newTag]);
    };

    return (
        <Form>
            <Row className="g-3">
                <Col xs={12}>
                    <Form.Group controlId="title">
                        <Form.Label className="required">Title</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formikValues.title}
                            onChange={handleFormikChange}
                            placeholder="Enter title..."
                            disabled={readOnly}
                            onBlur={formikBlur}
                            isInvalid={formikTouched?.title && !!formikErrors?.title}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {formikErrors?.title}
                        </Form.Control.Feedback>
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
                        />
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="category">
                        <Form.Label className="required">Category</Form.Label>
                        <Form.Select
                            value={formikValues.category}
                            onChange={handleFormikChange}
                            disabled={readOnly}
                            name="category"
                            isInvalid={formikTouched?.category && !!formikErrors?.category}
                        >
                            <option value="" disabled> Select category… </option>
                            { categories?.enumValues?.map((category) => ( 
                                <option key={category.name} value={category.name}> {category.name} </option>)) }
                        </Form.Select>
                        <Form.Text className="text-muted">
                            Value definition develop (enum).
                        </Form.Text>
                        <Form.Control.Feedback type='invalid'>
                            {formikErrors?.category}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Col>

                <Col xs={12} md={4}>
                    <Form.Group controlId="image">
                        <Form.Label>Image</Form.Label>
                        <div className="d-flex flex-column gap-2">
                            {details?.image ? (
                                <Image
                                    src={details.image}
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
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                disabled={readOnly}
                            />
                        </div>
                    </Form.Group>
                </Col>

                <Col xs={12} md={8}>
                    <Row className="g-3">
                        <Col xs={12} md={6}>
                            <Form.Group controlId="owner">
                                <Form.Label>Tags</Form.Label>
                                <AsyncCreatableSelect
                                    isMulti
                                    cacheOptions
                                    defaultOptions
                                    loadOptions={loadOptions}
                                    onChange={handleChange}
                                    onCreateOption={handleAddTag}
                                    value={inventoryTags?.map(tag => ({ value: tag.id, label: tag.name }))}
                                    placeholder={'Tags'}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue ? "Ничего не найдено" : "Начните ввод для поиска"
                                    }
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={6}>
                            <Form.Group controlId="owner">
                                <Form.Label>Owner</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="owner"
                                    value={details?.owner?.name ?? ''}
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
                                        value={details?.createdAt ?? ''}
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
                                        value={details?.updatedAt ?? ''}
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
