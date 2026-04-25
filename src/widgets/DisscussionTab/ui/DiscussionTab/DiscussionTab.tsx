import { useEffect, useRef } from 'react'
import { Alert, ListGroup, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { skipToken } from '@reduxjs/toolkit/query'
import './DiscussionTab.scss'
import {
    Comment,
    CommentForm,
    useGetInventoryCommentsQuery,
} from '@/features/comment'

const DiscussionTab = () => {
    const { t } = useTranslation('inventory')
    const { inventoryId, activeTab } = useParams()
    const listGroupRef = useRef<HTMLDivElement>(null)

    const {
        data: comments,
        isLoading: commentsIsLoading,
        error: commentsError,
        isSuccess: commentsIsSuccess,
    } = useGetInventoryCommentsQuery(
        inventoryId && !isNaN(Number(inventoryId)) ? { inventoryId } : skipToken
    )

    useEffect(() => {
        if (listGroupRef.current)
            listGroupRef.current.scrollTop = listGroupRef.current.scrollHeight
    }, [comments, activeTab])

    return (
        <Row className='g-2'>
            <Col>
                {comments?.length === 0 ? (
                    <Alert variant='light' className='border'>
                        {t('texts.discussion')}
                    </Alert>
                ) : (
                    <ListGroup
                        ref={listGroupRef}
                        variant='flush'
                        className='overflow-auto discusstion-tab--comments'
                    >
                        {comments &&
                            comments.map((comment) => (
                                <ListGroup.Item key={comment.id}>
                                    <Comment comment={comment} />
                                </ListGroup.Item>
                            ))}
                    </ListGroup>
                )}
                <CommentForm />
            </Col>
        </Row>
    )
}

export default DiscussionTab
