import { useState, useEffect, useContext, useRef } from "react";
import { useQuery, useMutation, useSubscription } from "@apollo/client/react";
import { Card, Form, Button, Alert, ListGroup, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { GET_COMMENTS, CREATE_COMMENT, COMMENT_ADDED} from "../../../graphql/commonQuery";
import { CurrentUserContext } from '../../../context/CurrentUserContext';

export default function DiscussionTab({ inventoryId, disabled }) {
    const { t } = useTranslation("inventory");
    const currentUser = useContext(CurrentUserContext);
    const [content, setContent] = useState('');
    const [comments, setComments] = useState([]);
    const messagesEndRef = useRef(null);

    const { data, loading, error } = useQuery(GET_COMMENTS, { variables: { inventoryId }, skip: !inventoryId });
    const [createComment] = useMutation(CREATE_COMMENT);
    const { data: subData } = useSubscription(COMMENT_ADDED, { variables: { inventoryId }, skip: !inventoryId, });

    useEffect(() => { if (inventoryId) setComments(data?.comments) }, [inventoryId, data?.comments]);

    useEffect(() => { if (subData?.commentAdded) setComments((prev) => [...prev, subData.commentAdded]) }, [subData]);

    useEffect(() => { if (messagesEndRef.current) { messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight } }, [comments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        await createComment({ variables: { input: { inventoryId, content } } });
        setContent('');
    };

    return (
        loading
            ? (<div className="d-flex justify-content-center align-items-center">
                <Spinner animation="border" className="align-self-center"/>
            </div>)
            : error
                ? (<div className="d-flex justify-content-center align-items-center">
                    <Alert variant="danger">{error.message}</Alert>
                </div>)
                : (<div className="p-3 d-flex flex-column" style={{ height: "100%" }} >
                    {comments?.length === 0
                        ? (<Alert variant="light" className="border flex-grow-1">{t("texts.discussion")}</Alert>)
                        : (<div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 400 }} ref={messagesEndRef}>
                            <ListGroup variant="flush">
                                { comments?.map((comment) => (
                                    <ListGroup.Item key={comment.id}>
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <Link to={`/users/${comment.user.id}`} className="fw-bold text-decoration-none">
                                                {comment.user.name}
                                            </Link>
                                            <small className="text-muted">
                                                {new Date(+comment.createdAt).toLocaleString()}
                                            </small>
                                        </div>
                                        <div className="markdown-body mt-1">
                                            <ReactMarkdown
                                                remarkPlugins={[remarkGfm]}
                                                components={{
                                                    a: (props) => (
                                                        <a {...props} target="_blank" rel="noopener noreferrer" className="text-primary" />
                                                    ),
                                                    code: ({ node, ...props }) => (
                                                        <code className="bg-light p-1 rounded text-danger" {...props} />
                                                    ),
                                                }}
                                            >
                                                {comment.content}
                                            </ReactMarkdown>
                                        </div>
                                    </ListGroup.Item>
                                )) }
                            </ListGroup>
                        </div>
                        )}

                    <Card className="mt-auto shadow-sm">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="commentText" className="mb-2">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder={t("placeholders.writeComment")}
                                    value={content}
                                    disabled={disabled}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                </Form.Group>
                                <div className="d-flex justify-content-end">
                                    <Button type="submit" disabled={disabled} variant="primary">{t("buttons.send")}</Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>)
    );
}
