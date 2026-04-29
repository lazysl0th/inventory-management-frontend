import { Spinner } from 'react-bootstrap'
import { FaHeart } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { Button } from '@/shared/ui/Button'
import {
    useAddLikeMutation,
    useDeleteLikeMutation,
    useGetLikeQuery,
    useGetLikesQuery,
} from '@/entities/item/api/itemApi'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'

const LikeButton = () => {
    const { inventoryId, itemId } = useParams()
    const { currentUser } = useCurrentUser()

    const { data: likes, isLoading: likesIsLoading } = useGetLikesQuery(
        inventoryId && itemId && itemId !== 'new'
            ? { inventoryId, itemId }
            : skipToken
    )

    const { data: like, isLoading: likeIsLoading } = useGetLikeQuery(
        inventoryId && itemId && itemId !== 'new' && currentUser
            ? { inventoryId, itemId }
            : skipToken
    )

    const [addLike] = useAddLikeMutation()
    const [deleteLike] = useDeleteLikeMutation()

    const handleToggleLike = async () => {
        if (!inventoryId || !itemId) return
        return like
            ? await deleteLike({ inventoryId, itemId })
            : await addLike({ inventoryId, itemId })
    }

    return (
        <Button
            name='like'
            className='d-flex align-items-center gap-1'
            onClick={handleToggleLike}
            disabled={!currentUser || itemId === 'new'}
            variant='dark'
        >
            {likesIsLoading || likeIsLoading ? (
                <Spinner size='sm' />
            ) : (
                <>
                    <FaHeart className={like ? 'text-danger' : ''} />
                    <span>{likes?.count}</span>
                </>
            )}
        </Button>
    )
}

export default LikeButton
