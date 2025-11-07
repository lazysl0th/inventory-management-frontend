import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import './App.css'
import {
    GET_CATEGORIES,
    GET_TAGS,
    GET_INVENTORIES,
    CREATE_INVENTORY,
    DELETE_INVENTORIES,
    CREATE_ITEM,
    GET_ITEMS,
    DELETE_ITEMS
} from '../../graphql/queries';
import { register, login, checkToken } from '../../utils/usersApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SearchPage from '../SearchPage/SearchPage'
import Register from '../Register/Register';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Profile from '../Profile/Profile';
import AdminPage from '../AdminPage/AdminPage'
import Inventory from '../Inventory/Inventory';
import Item from '../Item/Item';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import InfoToast from '../InfoToast/InfoToast';
import PageDeleteUserData from '../PageDeleteUserData/PageDeleteUserData';
import PagePrivacy from '../PagePrivacy/PagePrivacy'
import PageNotFound from '../PageNotFound/PageNotFound';
import LiveBlock from '../LiveBlock/LiveBlock';
import { titleInfoTooltip, messageInfoTooltip, queryParams } from '../../utils/constants';
import { isOwner, hasAdminRole, hasAccess } from '../../utils/utils';

function App() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState({ loggedIn: false });
    const [isVerifyCurrentUser, setIsVerifyCurrentUser] = useState(true);
    const [infoTooltipTitle, setInfoTooltipTitle] = useState('');
    const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
    const [isInfoTooltipOpen,  setIsInfoTooltipOpen] = useState(false);
    const [isInfoToastShow, setIsInfoToastShow] = useState(false);
    const [infoToastPosition, setInfoToastPosition] = useState('')
    const [infoToastMessage, setInfoToastMessage] = useState('');
    const [isInventoryViewOpen, setIsInventoryViewOpen] = useState(false);
    const [isItemViewOpen, setIsItemViewOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [searchParams] = useSearchParams();
    const [access, setAccess] = useState(true);

    useEffect( () => { handleVerifyUser() }, [navigate])
    useEffect( () => { handlerSignInSocialSubmit() }, [])

    const { data: dataCategories, loading: categoriesLoading, error: categoriesError,} = useQuery(GET_CATEGORIES);
    const [loadTags, resultTags] = useLazyQuery(GET_TAGS);
    const categories = dataCategories?.categories || {}

    const refetchQueriesInventory = [
        { query: GET_INVENTORIES, variables: { ownerId: currentUser.id } },
        { query: GET_INVENTORIES, variables: {
            isPublic: queryParams.GET_EDITABLE_INVENTORIES.isPublic,
            allowedUser: currentUser.id,
            logic: queryParams.GET_EDITABLE_INVENTORIES.logic }},
        { query: GET_INVENTORIES, variables: {
            sortName: queryParams.GET_LATEST_INVENTORIES.sortName,
            order: queryParams.GET_LATEST_INVENTORIES.order,
            take: queryParams.GET_LATEST_INVENTORIES.take,
        }},
        { query: GET_INVENTORIES, variables: {
            sortName: queryParams.GET_TOP_INVENTORIES.sortName,
            order: queryParams.GET_TOP_INVENTORIES.order,
            take: queryParams.GET_TOP_INVENTORIES.take,
        }},
        { query: GET_INVENTORIES },
    ]

    const [createInventory, { data: inventory, loading: creatingInventory, error: errorCreateInventory }] = useMutation(CREATE_INVENTORY, {
        refetchQueries: refetchQueriesInventory,
        awaitRefetchQueries: true,
    });

    const [deleteInventories, { loading: deletingInventories }] = useMutation(DELETE_INVENTORIES, {
        refetchQueries: refetchQueriesInventory,
        awaitRefetchQueries: true,
    });

    const [createItem, { data: item, loading: creatingItem, error: errorCreateItem }] = useMutation(CREATE_ITEM, {
        refetchQueries: [{ query: GET_ITEMS, variables: { inventoryId: selectedInventoryId } }],
        awaitRefetchQueries: true,
    });

    const [deleteItems, { loading: deletingItems }] = useMutation(DELETE_ITEMS, {
        refetchQueries: [{ query: GET_ITEMS, variables: { inventoryId: selectedInventoryId } }],
        awaitRefetchQueries: true,
    });

    const openInfoTooltip = (title, message) => {
        setInfoTooltipTitle(title);
        setInfoTooltipMessage(message);
        setIsInfoTooltipOpen(true);
    }

    const handlerCloseInfoTooltip = () => {
        setIsInfoTooltipOpen(false);
        setInfoTooltipTitle('');
        setInfoTooltipMessage('');
    }

    const showInfoToats = (message, position) => {
        setInfoToastMessage(message);
        setInfoToastPosition(position);
        setIsInfoToastShow(true);
    }

    const handlerCloseInfoToast = () => {
        setIsInfoToastShow(false);
        setInfoToastMessage('')
    }

    const openInventory = (record) => {
        setSelectedInventoryId(record.id)
        setIsInventoryViewOpen(true);
    }

    const openItem = (record) => {
        setSelectedItemId(record.id);
        setIsItemViewOpen(true);
    }

    const handlerClickRecord = {
        Inventory: openInventory,
        Item: openItem,
    }

    const closeInventory = () => {
        setIsInventoryViewOpen(false);
        setSelectedInventoryId(null);
    }

    const closeItem = () => {
        setSelectedItemId(null);
        setIsItemViewOpen(false);
    }
    
    const handlerCloseRecordView = {
        Inventory: closeInventory,
        Item: closeItem
    };

    const handlerAddRecord = {
        Inventory: () => setIsInventoryViewOpen(true),
        Item: () => setIsItemViewOpen(true)
    }
    
    const handlerCreateInventory = async (newInventory) => {
        try {
            const { data } = await createInventory({ variables: { input: newInventory } });
            if (data.createInventory.id) {
                setSelectedInventoryId(data.createInventory.id)
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORD.CREATE('Inventory'));
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.RECORD.ERROR('Inventory'));
            }
        } catch(e) {
            console.log(e);
            openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.RECORD.ERROR('Inventory'));

        }
    }

    const handlerCreateItem = async (newItem) => {
        try {
            const { data } = await createItem({ variables: { input: newItem } });
            if (data.createItem.id) {
                setSelectedItemId(data.createItem.id)
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORD.CREATE('Item'));
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.RECORD.ERROR('Item'));
            }
        } catch(e) {
            console.log(e);
            openInfoTooltip(titleInfoTooltip.ERROR, e);

        }
    }

    const hendlerDeleteInventories = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            await deleteInventories({ variables: { ids: selectedIds } });
            openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORD.DELETE('Inventory'))
        } catch (e) {
            console.log(e);
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    const hendlerDeleteItems = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            await deleteItems({ variables: { ids: selectedIds } });
            openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORD.DELETE('Item'))
        } catch (e) {
            console.log(e);
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }
    
    const handlerDeleteRecords = {
        Inventory: hendlerDeleteInventories,
        Item: hendlerDeleteItems,
    }

    const handleVerifyUser = async () => {
        try {
            const userData = await checkToken();
            if (Object.keys(userData).length) setCurrentUser({ ...userData, loggedIn: true })
            else {
                setCurrentUser({ loggedIn: false })
                navigate('/sign-in')
            }
        } catch (e) {
            setCurrentUser({ loggedIn: false });
            console.log(e);
        } finally {
            setIsVerifyCurrentUser(false);
        }
    }

    const handlerSignUpSubmit = async (values) => {
        try {
            const data = await register(values);
            if (data.user) {
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.REGISTRATION.success);
                handlerSignInSubmit(data.user);
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.ERROR);
            }
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    const handlerSignInSocialSubmit = async() => {
        const authToken = searchParams.get('token');
        if (authToken) {
            localStorage.setItem('token', authToken);
            handleVerifyUser();
            navigate(location.pathname, { replace: true });
        }
        
    }

    const handlerSignInSubmit = async (values) => {
        try {
            const data = await login(values);
            if (data.user) {
                localStorage.setItem('token', data.token);
                setCurrentUser(() => ({
                    ...data.user,
                    loggedIn: true,
                }))
                navigate('/profile');
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.ERROR);
            }
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    const handlerSignOut = () => {
        localStorage.removeItem('token');
        setCurrentUser({ loggedIn: false });
        navigate('/sign-in', { replace: true });
    }

    const handlerCheckPermissionInventory = (inventories, user, requiredRoles) => {
        if (!isOwner(inventories, user) && !hasAdminRole(requiredRoles, user)) setAccess(false);
    }
    
    const handlerCheckPermissionItem = (item, user, requiredRoles) => {
        if (!isOwner(uniqueInventories, user) && !hasAdminRole(requiredRoles, user) && !hasAccess(uniqueInventories, user)) {
                setAccess(false);
            }
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header onLog={handlerSignOut}/>
            <Routes>
                <Route path="/" element={ <Main handlerClickRecord={handlerClickRecord} loadTags={loadTags} resultTags={resultTags}/> } />
                <Route path="/search" element={<SearchPage handlerClickRecord={handlerClickRecord}/>} />
                <Route path="/sign-in" element={<Login onAuth={handlerSignInSubmit}/>} />
                <Route path="/sign-up" element={<Register onReg={handlerSignUpSubmit}/>} />
                <Route path="/delete-user-data" element={<PageDeleteUserData />} />
                <Route path="/privacy" element={<PagePrivacy />} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute isLoading={isVerifyCurrentUser} >
                            <Profile 
                                handlerClickRecord={handlerClickRecord}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                                handlerAddRecord={handlerAddRecord.Inventory} />
                        </ProtectedRoute>
                    }/>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute isLoading={isVerifyCurrentUser} >
                            <AdminPage
                                onOpenTooltip={openInfoTooltip}
                                onCheckCurrentUser={handleVerifyUser}
                                handlerClickRecord={handlerClickRecord}
                                handlerAddRecord={handlerAddRecord.Inventory}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                            />
                        </ProtectedRoute>
                    }/>
                <Route path="*" element={<PageNotFound />} />
            </Routes>
                <LiveBlock inventoryId={selectedInventoryId}>
                    <Inventory 
                        isOpen={isInventoryViewOpen}
                        onOpenTooltip={openInfoTooltip}
                        categories={categories}
                        loadTags={loadTags}
                        resultTags={resultTags}
                        inventoryId={selectedInventoryId}
                        handlerCloseView={handlerCloseRecordView.Inventory}
                        handlerClickRecord={handlerClickRecord}
                        handlerCreateInventory={handlerCreateInventory}
                        handlerAddRecord={handlerAddRecord.Item}
                        handlerDeleteRecords={handlerDeleteRecords.Item}
                        onShowToast={showInfoToats}
                    />
                </LiveBlock>
            <Item
                isOpen={isItemViewOpen}
                inventoryId={selectedInventoryId}
                itemId={selectedItemId}
                handlerCloseView={handlerCloseRecordView.Item}
                handlerCreateItem={handlerCreateItem}
                onShowToast={showInfoToats}/>
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={handlerCloseInfoTooltip}
                title={infoTooltipTitle}
                message={infoTooltipMessage}
            />
            <InfoToast isShow={isInfoToastShow} onClose={handlerCloseInfoToast} message={infoToastMessage} position={infoToastPosition}/>
        </CurrentUserContext.Provider>
    )
}

export default App
