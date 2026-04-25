import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { useCurrentUser, useGetUserQuery } from '@/entities/user'
import { ProfileForm } from '@/widgets/ProfileForm'
import { InventoryList } from '@/widgets/InventoryList'

const ProfilePage: React.FC = () => {
    const { userId } = useParams()
    const { currentUser } = useCurrentUser()

    const {
        data: user,
        isLoading: userIsLoading,
        error: userError,
    } = useGetUserQuery(userId || skipToken)

    const ownerParams =
        currentUser?.id || userId
            ? { ownerId: userId ? Number(userId) : currentUser?.id }
            : undefined
    const sharedParams = currentUser?.id
        ? {
              allowedUserId: userId ? Number(userId) : currentUser?.id,
              isPublic: true,
          }
        : undefined

    return (
        <Container className='pt-2 pb-5 mw-100'>
            <Row>
                <Col md={3}>
                    <h2 className='mb-2'>Profile</h2>
                    <ProfileForm />
                </Col>
                <Col md={9}>
                    <InventoryList
                        tableId='myInventories'
                        actionButtons={!userId}
                        requestParams={ownerParams}
                    >
                        <h3 className='mb-0'>{`${userId ? user?.name : 'My'} inventories`}</h3>
                    </InventoryList>

                    {!userId && (
                        <InventoryList requestParams={sharedParams}>
                            <h3 className='mb-0'>
                                Inventories with write access
                            </h3>
                        </InventoryList>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ProfilePage
