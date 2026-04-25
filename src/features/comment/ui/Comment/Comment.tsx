import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { SETTINGS } from '../../../../shared/config/constants'
import { ICommentProps } from '../../model/types'
import { MarkdownField } from '@/shared/ui/Form'

const Comment = ({ comment }: ICommentProps) => {
    return (
        <Card className='border-0'>
            <Card.Body className='p-0 d-flex flex-wrap justify-content-between'>
                <Card.Link
                    as={Link}
                    to={`/${SETTINGS.routes.users}/${comment.user.id}`}
                    className='fw-bold text-decoration-none text-dark'
                >
                    <Card.Title>{comment.user.name}</Card.Title>
                </Card.Link>
                <Card.Subtitle className='mt-0 text-muted'>
                    {new Date(comment.createdAt).toLocaleString()}
                </Card.Subtitle>
                <MarkdownField
                    name={String(comment.id)}
                    value={comment.content}
                />
            </Card.Body>
        </Card>
    )
}

export default Comment
