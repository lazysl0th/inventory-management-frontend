import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useApolloClient } from "@apollo/client/react";
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
    DELETE_ITEMS,
    GET_INVENTORY,
    GET_ITEM
} from '../../graphql/queries';
import { register, login, checkToken } from '../../utils/usersApi';
import { uploadImage } from '../../utils/imageApi';
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
import { titleInfoTooltip, messageInfoTooltip, queryParams } from '../../utils/constants';

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
    const client = useApolloClient();
    const inventoryRef = useRef(null);
    const itemRef = useRef(null);

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
            openInfoTooltip(titleInfoTooltip.ERROR, e.message);
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
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.USER.REGISTRATION.success);
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

    const handlerUploadImage = (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const data = uploadImage(formData);
        return data;
    }

    const handlerReloadInventory = async() => {
        try {
            await client.refetchQueries({ include: [{ query: GET_INVENTORY, variables: { id: selectedInventoryId },}] });
            openInfoTooltip(titleInfoTooltip.SUCCESS, "Данные обновлены");
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, "Не удалось обновить данные");
        }
    };

    const handlerReloadItem = async() => {
        try {
            await client.refetchQueries({ include: [{ query: GET_ITEM, variables: { id: selectedItemId } }] });
            openInfoTooltip(titleInfoTooltip.SUCCESS, "Данные обновлены");
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, "Не удалось обновить данные");
        }
    };

    const handlerReloadRecord = () => selectedItemId ? handlerReloadItem() : handlerReloadInventory();

    const handlerForceSaveRecord = async () => {
        selectedItemId ? itemRef.current?.forceSaveItem() : inventoryRef.current?.forceSaveInventory();
        openInfoTooltip(titleInfoTooltip.SUCCESS, "Изменения сохранены поверх.");
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
                        <ProtectedRoute isLoading={isVerifyCurrentUser} isAdmin={true} >
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
                <Inventory
                    ref={inventoryRef}
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
                    onUploadImage={handlerUploadImage}
                />
            <Item
                ref={itemRef}
                isOpen={isItemViewOpen}
                inventoryId={selectedInventoryId}
                itemId={selectedItemId}
                handlerCloseView={handlerCloseRecordView.Item}
                handlerCreateItem={handlerCreateItem}
                onShowToast={showInfoToats}
                onUploadImage={handlerUploadImage}
                onOpenTooltip={openInfoTooltip}
            />
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={handlerCloseInfoTooltip}
                title={infoTooltipTitle}
                message={infoTooltipMessage}
                onReload={handlerReloadRecord}
                onForceSave={handlerForceSaveRecord}
            />
            <InfoToast isShow={isInfoToastShow} onClose={handlerCloseInfoToast} message={infoToastMessage} position={infoToastPosition}/>
        </CurrentUserContext.Provider>
    )
}

export default App
