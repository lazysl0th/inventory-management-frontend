import { useState, useEffect } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import './App.css'
import { GET_ITEM_TAB, DELETE_INVENTORY, GET_CATEGORIES, CREATE_INVENTORY } from '../../graphql/queries';
import { register, login, checkToken } from '../../utils/usersApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SearchPage from '../SearchPage/SearchPage'
import Register from '../Register/Register';
import Login from '../Login/Login';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';
import Profile from '../Profile/Profile';
import InventoryView from '../InventoryView/InventoryView';
import ItemView from '../ItemView/ItemView';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import { titleInfoTooltip, messageInfoTooltip } from '../../utils/constants';
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

    const [loadCategories, { data: dataCategories, loading, error, reset }] = useLazyQuery(GET_CATEGORIES);

    useEffect(() => { loadCategories() }, []);

    useEffect(() => {
        if (selectedItem?.id) {
            if (['chat'].includes(activeInventoryTab)) {
                loadItem({ variables: { [`${selectedItem.__typename.toLowerCase()}Id`]: selectedItem.id } })
            }
            else loadItem({ variables: { id: selectedItem.id } })
        }
    }, [activeItemTab, selectedItem.id]);


    const [createInventory, { loading: creating, error: errorCreate }] = useMutation(CREATE_INVENTORY);

    const [deleteInventories, { loading: deleting }] = useMutation(DELETE_INVENTORY);

    const categories = dataCategories?.categories || {}
    const item = dataItem?.item || {}
    
    //console.log(inventory);
    //console.log(categories);
    
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

    const hendleDeleteInventories = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            deleteInventories({ variables: { ids: selectedIds } });
            openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.RECORDS_DELETE)
        } catch (e) {
            console.error(e);
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    const handlerCreateInventory = (inventory) => {
        createInventory({ variables: { input: inventory } });
    }

    const hendleDeleteItems = async (selectedIds) => {

    }
    
    const handlerDeleteRecords = {
        Inventory: hendleDeleteInventories,
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
                (<Redirect to='/sign-in' />)
            }
        } catch (e) {
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
            //const token = searchParams.get('token');
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
        setCurrentUser({ loggedIn: false, });
        navigate('/');
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
                <Route path="/" element={ <Main handlerClickRecord={handlerClickRecord}/> } />
                <Route path="/search" element={<SearchPage handlerClickRecord={handlerClickRecord}/>} />
                <Route path="/sign-up" element={<Register onReg={handlerSignUpSubmit}/>} />
                <Route path="/sign-in" element={<Login onAuth={handlerSignInSubmit}/>} />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute isLoading={isVerifyCurrentUser} >
                            <Profile 
                                handlerClickRecord={handlerClickRecord}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                                handlerAddRecords={handlerAddRecord.Inventory} />
                        </ProtectedRoute>
                    }/>
            </Routes>
            <InventoryView 
                isOpen={isInventoryViewOpen}
                categories={categories}
                inventoryId={selectedInventoryId}
                handlerCloseView={handlerCloseRecordView.Inventory}
                handlerClickRecord={handlerClickRecord}
                handlerCreateInventory={handlerCreateInventory}
            />
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
