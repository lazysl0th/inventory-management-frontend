import { Form, Row, Col, Image } from "react-bootstrap";
import FieldInput from './FileInput'

export default function ItemDetailsTab({ item, handlerChangeItem }) {
    const getKey = (value) => value.guid ?? value.id;

    const handlerChange = (id, changes) => {        
        const updated = item.values.map(value => getKey(value) === id ? { ...value, ...changes } : value);
        handlerChangeItem('values', updated)
    }

    

    return (
        <Form>
            <Row className="g-3">
                <Col xs={12}>
                    <Form.Group controlId="id">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="id"
                            value={item?.customId}
                            readOnly
                            disabled
                        />
                    </Form.Group>
                </Col>
                <Col xs={12}>
                    {item?.values.toSorted((a, b) => a.order - b.order).map(value => 
                        (<FieldInput
                            key={value?.field.id}
                            field={value.field}
                            value={{id: getKey(value), value: value.value}}
                            handlerChangeFieldInput={handlerChange}
                        />))}
                </Col>
                <Col xs={12}>
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
                                        value={item?.createdAt ?? ''}
                                        readOnly
                                        disabled
                                    />
                            </Form.Group>
                        </Col>

                        <Col xs={12} md={4}>
                            <Form.Group controlId="updated">
                                <Form.Label>Update at</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="updateAt"
                                        value={item?.updatedAt ?? ''}
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