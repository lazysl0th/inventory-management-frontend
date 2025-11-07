import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { Spinner, Alert, Container, Row, Col } from 'react-bootstrap';
import RecordsList from '../RecordsList/RecordsList';
import { nameList, titleInfoTooltip, messageInfoTooltip} from '../../utils/constants';
import * as userApi from '../../utils/usersApi';
import { GET_INVENTORIES } from '../../graphql/queries';

export default function AdminPage({ onOpenTooltip, onCheckCurrentUser, handlerClickRecord, handlerAddRecord, handlerDeleteRecords }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => { loadUsers() }, [])
    
    const { data: allInventories, loading: allInventoriesLoading, error: allInventoriesError } = useQuery(GET_INVENTORIES);

    const loadUsers = async () => {
        try{
            setIsLoading(true)
            const users = await userApi.getUsers();
            setUsers(users);
            setIsLoading(false);
        } catch (e) {
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    }

    const handlerChangeUsersStatus = async (rowSelection, status) => {
        await onCheckCurrentUser();
        try {
            const usersIds = Object.keys(rowSelection).map(id => Number(id));
            const blockUsers = await userApi.changeUsersStatus(usersIds, status);
            setUsers(prev => prev.map(user => ({ ...user, ...(blockUsers.requestUpdateStatusUsers.find(updateStatusUser => updateStatusUser.id === user.id) || {}) })));
            onOpenTooltip(titleInfoTooltip.SUCCESS, status === 'Blocked' ? messageInfoTooltip.USER_BLOCKED : messageInfoTooltip.USER_UNBLOCKED)
        } catch (e) {
            console.log(e);
            onOpenTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    const handlerDeleteUsers = async (rowSelection) => {
        await onCheckCurrentUser();
        try {
            const usersIds = Object.keys(rowSelection).map(id => Number(id));
            const deletedUsers = await userApi.deleteUsers(usersIds);
            setUsers(prev => prev.filter(user => !deletedUsers.deletedUsers.map(deletedUser => deletedUser.id).includes(user.id)));
            onOpenTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORDS.DELETE)
        } catch (e) {
          console.log(e);
          onOpenTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.e.message);
        }
    }

    const handlerChangeAccessUsers = async (rowSelection, roles) => {
        await onCheckCurrentUser();
        try {
            const usersIds = Object.keys(rowSelection).map(id => Number(id));
            const rolesIds = Array.from(roles).map(id => Number(id));
            const accessUsers = await userApi.changeAccess(usersIds, rolesIds);
            setUsers(prevUsers =>
                prevUsers.map(user => ({
                    ...user,
                    'roles': accessUsers.userRoles.filter(userRole => userRole.userId === user.id).map(userRole => ({ role: userRole.role }))
                })
            ))
            onOpenTooltip(titleInfoTooltip.SUCCESS, roles === '1' ? messageInfoTooltip.USER.PERMISSION.GRANT : messageInfoTooltip.USER.PERMISSION.REVOKE)
        } catch (e) {
            onOpenTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.e.message);
        }
    }

    return (
        <Container className="d-flex flex-column gap-4" >
            <Row>
                <Col className="d-flex flex-column gap-4">
                    { isLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : users.length === 0
                            ? <Alert variant="danger" className="align-self-center">Ошибка загрузки пользователей</Alert>
                            : <RecordsList
                                type='AdminUser'
                                nameRecordList={nameList.USERS}
                                records={users} 
                                handlerClickRecord={handlerClickRecord}
                                handlerChangeUsersStatus={handlerChangeUsersStatus}
                                handlerChangeAccessUsers={handlerChangeAccessUsers}
                                handlerDeleteRecords={handlerDeleteUsers}
                            /> }
                </Col>
            </Row>
            <Row>
                <Col className="d-flex flex-column gap-4">
                    { allInventoriesLoading 
                        ? <Spinner animation="border" className="align-self-center"/>
                        : allInventoriesError
                            ? <Alert variant="danger" className="align-self-center">{allInventoriesError.message}</Alert>
                            : <RecordsList
                                type='Inventory'
                                nameRecordList={nameList.INVENTORIES}
                                records={allInventories.inventories} 
                                handlerAddRecord={handlerAddRecord}
                                handlerDeleteRecords={handlerDeleteRecords}
                                handlerClickRecord={handlerClickRecord}
                            /> }
                </Col>
            </Row>
            
            
        </Container>
    );
}