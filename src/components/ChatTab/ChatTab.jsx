import { useState } from "react";
import { Card, Form, Button, Alert, ListGroup } from "react-bootstrap";

export default function ChatTab({ comments=[], onAddComment }) {

    const [text, setText] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
            try {
                setSending(true);
                await onAddComment?.(text);
                setText("");
            } catch (err) {
                console.error("Failed to add comment:", err);
            } finally {
                setSending(false);
            }
    };

    return (
        <div className="p-3 d-flex flex-column" style={{ height: "100%" }}>
            <h5 className="mb-3">Discussion</h5>

            {comments.length === 0
                ? (<Alert variant="light" className="border flex-grow-1">No comments yet. Be the first to comment!</Alert>)
                : (<div className="flex-grow-1 overflow-auto mb-3" style={{ maxHeight: 400 }}>
                    <ListGroup variant="flush">
                        { comments.slice().reverse().map((comment) => (
                            <ListGroup.Item key={comment.id}>
                                <div className="d-flex justify-content-between">
                                    <strong>{comment.user.name}</strong>
                                    <small className="text-muted">{ new Date(+comment.createdAt).toLocaleString() }</small>
                                </div>
                                <div>{ comment.content }</div>
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
                            placeholder="Write a comment..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            disabled={sending}
                        />
                        </Form.Group>
                        <div className="d-flex justify-content-end">
                            <Button type="submit" variant="primary" disabled={sending || !text.trim()}>
                                {sending ? "Sending..." : "Send"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}
