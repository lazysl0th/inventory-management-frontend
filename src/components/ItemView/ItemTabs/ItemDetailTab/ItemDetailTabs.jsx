import { useContext } from "react";
import { useMutation } from '@apollo/client/react';
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import FieldInput from './FileInput';
import { TOGGLE_LIKE } from '../../../../graphql/queries';
import { CurrentUserContext } from '../../../../context/CurrentUserContext';

export default function ItemDetailsTab({ item, handlerChangeItem, onShowToast }) {
    const currentUser = useContext(CurrentUserContext);
    const [toggleLike, { loadingToggleLike }] = useMutation(TOGGLE_LIKE);

    const getKey = (value) => value.guid ?? value.id;

    const handlerChange = (id, changes) => {
        const updated = item.values.map(value => getKey(value) === id ? { ...value, ...changes } : value);
        handlerChangeItem('values', updated)
    }


    const handleLikeItem = async () => {
        try {
            const { data } = await toggleLike({
                variables: { id: item.id },
                optimisticResponse: {
                    __typename: "Mutation",
                    toggleLikeItem: {
                        __typename: "Item",
                        id: item.id,
                        likesCount: item.likedByMe ? item.likesCount - 1 : item.likesCount + 1,
                        likedByMe: !item.likedByMe,
                    },
                },
            })
            const updatedLike = { __typename: data.toggleLikeItem.__typename, ...data.toggleLikeItem };
            for (let key in updatedLike) handlerChangeItem(key, updatedLike[key]);
        } catch (e) {
            console.log(e)
        }
    }

    const handleClick = () => (currentUser.loggedIn ? handleLikeItem() : onShowToast('Нельзя', 'bottom-center'))



    return (
        <Form>
            <Row className="g-3 justify-content-end">
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

                        <Col xs={12} md={3}>
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

                        <Col xs={12} md={3}>
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
                        <Col xs={2} className="d-flex justify-content-end align-items-end">
                            <Button
                                    className="d-flex align-items-center gap-1"
                                    onClick={handleClick}
                                    disabled={loadingToggleLike}
                                >
                                <FaHeart className={`${item.likedByMe ? 'text-danger' : ''}`}/> 
                                <span>{item.likesCount}</span>
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Form>
    );
}