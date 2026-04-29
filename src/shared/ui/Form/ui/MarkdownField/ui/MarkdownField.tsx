import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { Form, InputGroup } from 'react-bootstrap'
import type { IMarkdownFieldProps } from '../model/types'

const MarkdownField = ({
    name,
    label,
    className,
    value,
}: IMarkdownFieldProps) => {
    return (
        <Form.Group controlId={name} className='w-100'>
            {label && <Form.Label>{label}</Form.Label>}
            <InputGroup className={className}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeSanitize]}
                >
                    {value}
                </ReactMarkdown>
            </InputGroup>
        </Form.Group>
    )
}

export default MarkdownField
