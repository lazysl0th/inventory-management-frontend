import { Container, Row, Col } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { skipToken } from '@reduxjs/toolkit/query'
import { ProfileForm } from '@/widgets/ProfileForm'
import { InventoryList } from '@/widgets/InventoryList'
import { useTranslation } from 'react-i18next'
import { type TInventoryListItem, useDeleteInventoriesMutation, useGetInventoriesQuery } from '@/entities/inventory'
import { useGetUserQuery } from '@/entities/user'
import { useCurrentUser } from '@/entities/user/lib/useCurrentUser'
import { MY_INVENTORIES } from '@/shared/config/constants'
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers'
import { Typename } from '@/shared/ui/DataTable'
import type { IAction } from '@/shared/ui/ActionButtons'
import { useInventoryActions } from '@/entities/inventory/lib/useInventoryActions'

const ProfilePage = () => {
    const { userId } = useParams()
    const { currentUser } = useCurrentUser()
    const { t } = useTranslation(['user', 'inventory'])
    
    const {
        data: user,
    } = useGetUserQuery(userId || skipToken)

    const {
        data: ownerInventories = [],
        isLoading: ownerInventoriesLoading,
        error: ownerInventoriesError,
    } = useGetInventoriesQuery(currentUser?.id || userId
            ? { ownerId: userId ? Number(userId) : currentUser?.id } : skipToken)

    const {
        data: sharedInventories = [],
        isLoading: sharedInventoriesLoading,
        error: sharedInventoriesError,
    } = useGetInventoriesQuery(currentUser?.id
        ? {
              allowedUserId: userId ? Number(userId) : currentUser?.id,
              isPublic: true,
          }
        : skipToken)

            const [deleteInventories] = useDeleteInventoriesMutation()
        
            const { addRecord, deleteRecords: deleteInventoriesHandler, selectedRecords: selectedInventories } =
                useRecordHandlers<TInventoryListItem>(Typename.Inventory, {
                    tableId: MY_INVENTORIES,
                    onDelete: (ids) => deleteInventories(ids).unwrap(),
                })
        
            const inventoryActions: IAction[] = useInventoryActions({
                onAdd: addRecord,
                onDelete: deleteInventoriesHandler,
                selectedCount: Object.keys(selectedInventories).length,
            })

    return (
        <Container className='pt-2 pb-5 mw-100'>
            <Row>
                <Col md={3}>
                    <h2 className='mb-2'>{t('user:pageTitle.profile')}</h2>
                    <ProfileForm />
                </Col>
                <Col md={9}>
                    <InventoryList
                        tableId={MY_INVENTORIES}
                        isLoading={ownerInventoriesLoading}
                        data={ownerInventories}
                        error={ownerInventoriesError}
                        inventoryActions={inventoryActions}
                    >
                        <h3 className='mb-0'>{userId 
                                ? t('inventory:listTitle.other', { userName: user?.name ?? '' }) 
                                : t('inventory:listTitle.my')
                            }</h3>
                    </InventoryList>

                    {!userId && (
                    <InventoryList
                        isLoading={sharedInventoriesLoading}
                        data={sharedInventories}
                        error={sharedInventoriesError}
                    >
                        <h3 className='mb-0'>{t('inventory:listTitle.writeAccess')}</h3>
</InventoryList>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default ProfilePage
