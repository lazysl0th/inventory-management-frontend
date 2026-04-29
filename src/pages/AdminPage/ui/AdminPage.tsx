import { TInventoryListItem, useDeleteInventoriesMutation, useGetInventoriesQuery } from '@/entities/inventory';
import { useInventoryActions } from '@/entities/inventory/lib/useInventoryActions';
import useRecordHandlers from '@/shared/lib/hooks/useRecordHandlers';
import { IAction } from '@/shared/ui/ActionButtons';
import { Typename } from '@/shared/ui/DataTable';
import { InventoryList } from '@/widgets/InventoryList';
import { Container, Row, Col } from 'react-bootstrap'
import { UserList } from '@/widgets/UserList'
import { useTranslation } from 'react-i18next';
import { type IUser, useDeleteUsersMutation, useGetUsersQuery, useUpdateUsersMutation } from '@/entities/user';
import { useAddRolesMutation, useDeleteRolesMutation } from '@/features/role';
import { useUserActions } from '@/entities/user/lib/useUserActions';
import { ALL_INVENTORIES, ALL_USERS } from '@/shared/config/constants';


const AdminPage = () => {
    
    const { t } = useTranslation(['admin', 'inventory', 'user']);

        const {
            data: users = [],
            isLoading: usersLoading,
            error: usersError,
        } = useGetUsersQuery({})

        const {
            data: allInventories = [],
            isLoading: allInventoriesLoading,
            error: allInventoriesError,
        } = useGetInventoriesQuery({})

            const [deleteInventories] = useDeleteInventoriesMutation()

    const { addRecord, deleteRecords: deleteInventoriesHandler, selectedRecords: selectedInventories } =
        useRecordHandlers<TInventoryListItem>(Typename.Inventory, {
            tableId: ALL_INVENTORIES,
            onDelete: (ids) => deleteInventories(ids).unwrap(),
        })

    const inventoryActions: IAction[] = useInventoryActions({
        onAdd: addRecord,
        onDelete: deleteInventoriesHandler,
        selectedCount: Object.keys(selectedInventories).length,
    })

        const [deleteUsers] = useDeleteUsersMutation()
        const [updateUsers] = useUpdateUsersMutation()
        const [addRoles] = useAddRolesMutation()
        const [deleteRoles] = useDeleteRolesMutation()

            
    const {
        deleteRecords: deleteUsersHandler,
        updateRecords: updateUsersHandler,
        grantRecords,
        revokeRecords,
        selectedRecords: selectedUsers,
    } = useRecordHandlers<IUser>(Typename.User, {
        tableId: ALL_USERS,
        onDelete: (ids) => deleteUsers(ids).unwrap(),
        onUpdate: (ids) => updateUsers(ids).unwrap(),
        onGrant: (ids) => addRoles(ids).unwrap(),
        onRevoke: (ids) => deleteRoles(ids).unwrap(),
    })

    const userActions = useUserActions({
        onBlock: () => updateUsersHandler({ status: 'Blocked' }),
        onUnblock: () => updateUsersHandler({ status: 'Active' }),
        onGrant: () => grantRecords([1]),
        onRevoke: () => revokeRecords([1]),
        onDelete: deleteUsersHandler,
        selectedCount: Object.keys(selectedUsers).length,
    })

    return (
        <Container className='d-flex flex-column gap-4 mw-100'>
            <Row>
                <Col className='d-flex flex-column gap-4'>
                    <h2 className='mb-2'>{t('common:pageTitle.adminPage')}</h2>
                    <UserList 
                        tableId={ALL_USERS} data={users} 
                        isLoading={usersLoading}
                        error={usersError} 
                        userActions={userActions}>
                        <h3 className='mb-0'>{t('user:listTitle.all')}</h3>
                    </UserList>
                    <InventoryList
                        tableId={ALL_INVENTORIES}
                        isLoading={allInventoriesLoading}
                        data={allInventories}
                        error={allInventoriesError}
                        inventoryActions={inventoryActions}
                    >
                        <h3 className='mb-0'>{t('inventory:listTitle.all')}</h3>
                    </InventoryList>
                </Col>
            </Row>
        </Container>
    )
}

export default AdminPage
