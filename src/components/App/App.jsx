import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate, useSearchParams } from 'react-router-dom';
import { useApolloClient } from "@apollo/client/react";
import { useTranslation } from 'react-i18next';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import './App.css'
import { GET_INVENTORIES, CREATE_INVENTORY, DELETE_INVENTORIES, GET_INVENTORY } from '../../graphql/inventoryQueries';
import { GET_ITEM, GET_ITEMS, DELETE_ITEMS, CREATE_ITEM } from '../../graphql/itemQuery';
import { GET_CATEGORIES, GET_TAGS, } from '../../graphql/commonQuery';
import { register, login, checkToken, resetPassword, changePassword } from '../../utils/usersApi';
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
import ResetPassword from '../ResetPassword/ResetPassword';
import ChangePassword from '../ChangePassword/ChangePassword';
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
    const client = useApolloClient();
    const inventoryRef = useRef(null);
    const itemRef = useRef(null);
    const { t } = useTranslation("common");
    const { t: ta } = useTranslation("auth");


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

    const openUser = (record) => {
        navigate(`/profile/${record.id}`);
    }

    const handlerClickRecord = {
        Inventory: openInventory,
        Item: openItem,
        AdminUser: openUser
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
        Item: closeItem,
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
                openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t('records.create', { recordType: "Inventory" }));
            } else {
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t('records.error', { recordType: "Inventory" }));
            }
        } catch(e) {
            console.log(e);
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t('records.error', { recordType: "Inventory" }));

        }
    }

    const handlerCreateItem = async (newItem) => {
        try {
            const { data } = await createItem({ variables: { input: newItem } });
            if (data.createItem.id) {
                setSelectedItemId(data.createItem.id)
                openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t('records.create', { recordType: "Item" }));
            } else {
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t('records.error', { recordType: "Item" }));
            }
        } catch(e) {
            console.log(e);
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t('records.error', { recordType: "Item" }));
        }
    }

    const hendlerDeleteInventories = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            await deleteInventories({ variables: { ids: selectedIds } });
            openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t('records.delete', { recordType: "Inventory" }))
        } catch (e) {
            console.log(e);
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message)
        }
    }

    const hendlerDeleteItems = async (rowSelection) => {
        try {
            const selectedIds = Object.keys(rowSelection).map(Number);
            await deleteItems({ variables: { ids: selectedIds } });
            openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t('records.delete', { recordType: "Item" }))
        } catch (e) {
            console.log(e);
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message)
        }
    }
    
    const handlerDeleteRecords = {
        Inventory: hendlerDeleteInventories,
        Item: hendlerDeleteItems,
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
            openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t("versionConflict.modals.updateSuccess"));
        } catch (e) {
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t("versionConflict.modals.updateFailed"));
        }
    };

    const handlerReloadItem = async() => {
        try {
            await client.refetchQueries({ include: [{ query: GET_ITEM, variables: { id: selectedItemId } }] });
            openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t("versionConflict.modals.updateSuccess"));
        } catch (e) {
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t("versionConflict.modals.updateFailed"));
        }
    };

    const handlerReloadRecord = () => selectedItemId ? handlerReloadItem() : handlerReloadInventory();

    const handlerForceSaveRecord = async () => {
        try {
            selectedItemId ? itemRef.current?.forceSaveItem() : inventoryRef.current?.forceSaveInventory();
            openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), t("versionConflict.modals.rewriteSuccess"));
        } catch (e) {
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t("modals.messageError"));
        }
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
                openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), ta(`${messageInfoTooltip.USER.REGISTRATION.success}`));
                handlerSignInSubmit(data.user);
            } else {
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t(`${titleInfoTooltip.ERROR}`));
            }
        } catch (e) {
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message)
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
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t(`${titleInfoTooltip.ERROR}`));
            }
        } catch (e) {
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message);
        }
    }

    const handlerSignOut = () => {
        localStorage.removeItem('token');
        setCurrentUser({ loggedIn: false });
        navigate('/sign-in', { replace: true });
    }

    const handlerResetPassword = async(values) => {
        try {
            if (!values.email) return
            const userData = await resetPassword(values)
            if(userData) {
                openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), ta(`${messageInfoTooltip.USER.PASSWORD.RESET}`));
                navigate('/profile');
            } else {
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t(`${titleInfoTooltip.ERROR}`));
            }
        } catch (e) {
            console.log(e);
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message);
        }
    }

    const handlerChangePassword = async(values) => {
        try {
          if (!values.password) return
          const userData = await changePassword(values)
          if(userData) {
                openInfoTooltip(t(`${titleInfoTooltip.SUCCESS}`), ta(`${messageInfoTooltip.USER.PASSWORD.UPDATE}`));
                navigate('/');
          } else {
                openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), t(`${titleInfoTooltip.ERROR}`));
          }
        } catch (e) {
            console.log({e});
            openInfoTooltip(t(`${titleInfoTooltip.ERROR}`), e.message);
        }
    }

    const handlerOpenSupportRequest = () => {
        openInfoTooltip('Support request', 'Help');
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <Header onLog={handlerSignOut} onSupportRequest={handlerOpenSupportRequest}/>
            <Routes>
                <Route path="/" element={ <Main handlerClickRecord={handlerClickRecord} loadTags={loadTags} resultTags={resultTags}/> } />
                <Route path="/search" element={<SearchPage handlerClickRecord={handlerClickRecord}/>} />
                <Route path="/sign-in" element={<Login onAuth={handlerSignInSubmit}/>} />
                <Route path="/sign-up" element={<Register onReg={handlerSignUpSubmit}/>} />
                <Route path="/reset-password" element={<ResetPassword handlerResetPassword={handlerResetPassword}/>} />
                <Route path="/change-password" element={<ChangePassword handlerChangePassword={handlerChangePassword}/>} />
                <Route path="/delete-user-data" element={<PageDeleteUserData />} />
                <Route path="/privacy" element={<PagePrivacy />} />
                <Route
                    path="/profile/:id?"
                    element={
                        <ProtectedRoute isLoading={isVerifyCurrentUser} >
                            <Profile
                                handlerClickRecord={handlerClickRecord}
                                handlerDeleteRecords={handlerDeleteRecords.Inventory}
                                handlerAddRecord={handlerAddRecord.Inventory}
                                onShowToast={showInfoToats}
                            />
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
                    onSupportRequest={handlerOpenSupportRequest}
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
                onSupportRequest={handlerOpenSupportRequest}
            />
            <InfoTooltip
                isOpen={isInfoTooltipOpen}
                onClose={handlerCloseInfoTooltip}
                title={infoTooltipTitle}
                message={infoTooltipMessage}
                onReload={handlerReloadRecord}
                onForceSave={handlerForceSaveRecord}
                inventoryId={selectedInventoryId}
                onShowToast={showInfoToats}
                onSupportRequest={handlerOpenSupportRequest}
            />
            <InfoToast isShow={isInfoToastShow} onClose={handlerCloseInfoToast} message={infoToastMessage} position={infoToastPosition}/>
        </CurrentUserContext.Provider>
    )
}

export default App
