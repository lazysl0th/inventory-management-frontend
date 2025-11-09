import { Form } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export default function MarkdownField({
    value,
    onChange,
    readOnly = false,
    placeholder = "Введите текст (поддерживается Markdown)…",
}) {

    const handleChange = (e) => onChange(e.target.value)

    if (readOnly) {
        return (
            <div className="p-2 border rounded bg-light" style={{ minHeight: 100 }}>
            <div className="markdown-body">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                >
                    {value}
                </ReactMarkdown>
            </div>
        </div>
        );
    }
    return (
        <Form.Control
            as="textarea"
            rows={4}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
}
