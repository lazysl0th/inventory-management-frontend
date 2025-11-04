import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import './App.css'
import { GET_ITEM_TAB, DELETE_INVENTORY, GET_CATEGORIES, CREATE_INVENTORY, GET_TAGS, GET_INVENTORIES } from '../../graphql/queries';
import { register, login, checkToken } from '../../utils/usersApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SearchPage from '../SearchPage/SearchPage'
import Register from '../Register/Register';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Profile from '../Profile/Profile';
import AdminPage from '../AdminPage/AdminPage'
import InventoryView from '../InventoryView/InventoryView';
import ItemView from '../ItemView/ItemView';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
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
    const [isInventoryViewOpen, setIsInventoryViewOpen] = useState(false);
    const [isItemViewOpen, setIsItemViewOpen] = useState(false);
    const [selectedInventoryId, setSelectedInventoryId] = useState(null);
    const [selectedItem, setSelectedItem] = useState({});
    const [activeItemTab, setActiveItemTab] = useState('details');
    const [searchParams] = useSearchParams();
    const [access, setAccess] = useState(true);

    useEffect( () => { handleVerifyUser() }, [navigate])

    const [loadItem, { 
        data: dataItem, 
        loading: loadingItem, 
        error: errorItem, 
        reset: resetItem
    }] = useLazyQuery(GET_ITEM_TAB[activeItemTab]);

    const { data: dataCategories, loading: categoriesLoading, error: categoriesError,} = useQuery(GET_CATEGORIES);

    const [loadTags, resultTags] = useLazyQuery(GET_TAGS);

    useEffect(() => {
        if (selectedItem?.id) {
            if (['chat'].includes(activeInventoryTab)) {
                loadItem({ variables: { [`${selectedItem.__typename.toLowerCase()}Id`]: selectedItem.id } })
            }
            else loadItem({ variables: { id: selectedItem.id } })
        }
    }, [activeItemTab, selectedItem.id]);

    const refetchQueries = [
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
        { query: GET_INVENTORIES }
    ]

    const [createInventory, { data: inventory, loading: creating, error: errorCreate }] = useMutation(CREATE_INVENTORY, {
        refetchQueries: refetchQueries,
        awaitRefetchQueries: true,
    });

    const [deleteInventories, { loading: deleting }] = useMutation(DELETE_INVENTORY, {
        refetchQueries: refetchQueries,
        awaitRefetchQueries: true,
    });

    const categories = dataCategories?.categories || {}
    const item = dataItem?.item || {}
    
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

    const openInventory = (record) => {
        setSelectedInventoryId(record.id)
        setIsInventoryViewOpen(true);
    }

    const openItem = (record) => {
        setSelectedItem(record);
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
        setSelectedItem({});
        resetItem?.();
        setActiveItemTab('details');
        setIsItemViewOpen(false);
    }
    
    const handlerCloseRecordView = {
        Inventory: closeInventory,
        Item: closeItem
    };

    const addInventory = () => setIsInventoryViewOpen(true)

    const handlerAddRecord = {
        Inventory: addInventory
    }
    
    const handlerCreateInventory = async (newInventory) => {
        try {
            const { data } = await createInventory({ variables: { input: newInventory } });
            if (data.createInventory.id) {
                setSelectedInventoryId(data.createInventory.id)
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORDS.INVENTORY.CREATE);
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.RECORDS.INVENTORY.ERROR);
            }
        } catch(e) {
            console.log(e)
            openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.RECORDS.INVENTORY.ERROR);

        }
    }

    const hendlerDeleteInventories = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            await deleteInventories({ variables: { ids: selectedIds } });
            openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORDS.DELETE)
        } catch (e) {
            console.log(e);
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }



    const hendleDeleteItems = async (selectedIds) => {

    }
    
    const handlerDeleteRecords = {
        Inventory: hendlerDeleteInventories,
        Item: hendleDeleteItems,
    }

    const handlerSelectTabs = {
        Item: setActiveItemTab,
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
            console.log(e)
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
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute isLoading={isVerifyCurrentUser} >
                            <Profile 
                                handlerClickRecord={handlerClickRecord}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                                handlerAddRecords={addInventory} />
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
                                handlerAddRecords={addInventory}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                            />
                        </ProtectedRoute>
                    }/>
            </Routes>
                <LiveBlock inventoryId={selectedInventoryId}>
                    <InventoryView 
                        isOpen={isInventoryViewOpen}
                        categories={categories}
                        loadTags={loadTags}
                        resultTags={resultTags}
                        inventoryId={selectedInventoryId}
                        handlerCloseView={handlerCloseRecordView.Inventory}
                        handlerClickRecord={handlerClickRecord}
                        handlerCreateInventory={handlerCreateInventory}
                    />
                </LiveBlock>
                
            <ItemView
                isOpen={isItemViewOpen}
                activeTab={activeItemTab}
                item={item}
                status={{loadingItem, errorItem}}
                onSelectTab={handlerSelectTabs.Item}
                onClose={handlerCloseRecordView.Item}/>
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={handlerCloseInfoTooltip}
                title={infoTooltipTitle}
                message={infoTooltipMessage}
            />
        </CurrentUserContext.Provider>
    )
}

export default App
