import { useContext, useMemo } from "react";
import { useMutation } from '@apollo/client/react';
import { Form, Row, Col, Button } from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import FieldInput from './FieldInput';
import { TOGGLE_LIKE } from '../../../graphql/queries';
import { CurrentUserContext } from '../../../context/CurrentUserContext';

export default function ItemDetailsTab({ item, customIdFormat, handlerChangeItem, onShowToast, onUploadImage }) {
    const currentUser = useContext(CurrentUserContext);
    const [toggleLike, { loadingToggleLike }] = useMutation(TOGGLE_LIKE);

    const getKey = (value) => value.guid ?? value.id;

    const handlerChange = (id, changes) => {
        const updated = item.values.map(value => getKey(value) === id ? { ...value, ...changes } : value);
        handlerChangeItem('values', updated)
    }
    (val) => handlerChangeItem("customId", val)
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
            console.log(e);
        }
    }

    const handleClick = () => (currentUser.loggedIn && item.id ? handleLikeItem() : onShowToast('Нельзя', 'bottom-center'))

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
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            name="customId"
                            value={item?.customId}
                            onChange={(e) => handlerChangeItem("customId", e.target.value)}
                            className="form-control"
                            //isInvalid={item?.customId && !mask.test(item.customId)}
                        />
                        <Form.Control.Feedback type="invalid">
                            Неверный формат. Ожидается: {customIdFormat?.summary}
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