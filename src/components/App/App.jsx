import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import { GET_INVENTORY_TAB, GET_ITEM_TAB } from '../../graphql/queries';
import * as userApi from '../../utils/usersApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SearchPage from '../SearchPage/SearchPage'
import Register from '../Register/Register';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import InventoryView from '../InventoryView/InventoryView';
import ItemView from '../ItemView/ItemView';
import { titleInfoTooltip, messageInfoTooltip } from '../../utils/constants';



function App() {
    const navigate = useNavigate();

    const [infoTooltipTitle, setInfoTooltipTitle] = useState('');
    const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
    const [isInfoTooltipOpen,  setIsInfoTooltipOpen] = useState(false);
    const [isInventoryViewOpen, setIsInventoryViewOpen] = useState(false);
    const [isItemViewOpen, setIsItemViewOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState({});
    const [selectedItem, setSelectedItem] = useState({});
    const [activeInventoryTab, setActiveInventoryTab] = useState('details');
    const [activeItemTab, setActiveItemTab] = useState('details');
    
    console.log(selectedInventory);


    const [loadInventory, { 
        data: dataInventory, 
        loading: loadingInventory, 
        error: errorInventory, 
        reset: resetInventory 
    }] = useLazyQuery(GET_INVENTORY_TAB[activeInventoryTab]);

    const [loadItem, { 
        data: dataItem, 
        loading: loadingItem, 
        error: errorItem, 
        reset: resetItem }] = useLazyQuery(GET_ITEM_TAB[activeItemTab]);

    useEffect(() => {
        if (selectedInventory?.id) {
            if (['items', 'chat'].includes(activeInventoryTab)) {
                loadInventory({ variables: { [`${selectedInventory.__typename.toLowerCase()}Id`]: selectedInventory.id } })
            }
            else loadInventory({ variables: { id: selectedInventory.id } })
        }
    }, [activeInventoryTab, selectedInventory.id]);

    useEffect(() => {
        if (selectedItem?.id) {
            if (['chat'].includes(activeInventoryTab)) {
                loadItem({ variables: { [`${selectedItem.__typename.toLowerCase()}Id`]: selectedItem.id } })
            }
            else loadItem({ variables: { id: selectedItem.id } })
        }
    }, [activeItemTab, selectedItem.id]);


    const inventory = dataInventory?.inventory || {}
    const categories = dataInventory?.categories?.enumValues ?? [];
    const items = dataInventory?.items ?? [];
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

    const openItem = (record) => {
        setSelectedItem(record);
        setIsItemViewOpen(true);
    }

    const closeItem = () => {
        setIsItemViewOpen(false);
        resetItem?.();
        setActiveItemTab('details');
        setSelectedItem({});
    }

    const openInventory = (record) => {
        setSelectedInventory(record);
        setIsInventoryViewOpen(true);
        loadInventory({ variables: { id: record.id } });
    }

    const closeInventory = () => {
        setIsInventoryViewOpen(false);
        resetInventory?.();
        setActiveInventoryTab('details');
        setSelectedInventory({});
    }

    const handlerRecordClick = {
        Inventory: openInventory,
        Item: openItem,
    }
    
    const handlerCloseRecordView = {
        Inventory: closeInventory,
        Item: closeItem
    };

    const handlerChangeRecord = ((name, value) => { 
        setSelectedInventory((prev) => ({ ...prev, [name]: value })) });

    const handlerSelectTabs = {
        Inventory: setActiveInventoryTab,
        Item: setActiveItemTab,
    }

    const handlerSignUpSubmit = async (values) => {
        try {
            const userData = await userApi.register(values);
            if (userData) {
                openInfoTooltip(titleInfoTooltip.SUCCESS, messageInfoTooltip.REGISTRATION.SUCCESS)
                navigate('/');
            } else {
                openInfoTooltip(titleInfoTooltip.ERROR, messageInfoTooltip.REGISTRATION.ERROR);
            }
        } catch (e) {
            openInfoTooltip(titleInfoTooltip.ERROR, e.message)
        }
    }

    return (
            <>
                <Header />
                <Routes>
                    <Route path="/" element={ <Main handlerRecordClick={handlerRecordClick}/> } />
                    <Route path="/search" element={<SearchPage handlerRecordClick={handlerRecordClick}/>} />
                    <Route path="/sign-up" element={<Register onReg={handlerSignUpSubmit}/>} />
                </Routes>
                <InventoryView 
                    onShow={isInventoryViewOpen}
                    inventory={inventory}
                    items={items}
                    categories={categories}
                    status={{loadingInventory, errorInventory}}
                    onClose={handlerCloseRecordView.Inventory}
                    handlerChangeRecord={handlerChangeRecord}
                    handlerRecordClick={handlerRecordClick}
                    activeTab={activeInventoryTab}
                    onSelectTab={handlerSelectTabs.Inventory}
                />
                <ItemView
                    onShow={isItemViewOpen}
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
            </>
    )
}

export default App
