import { useState, useEffect, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'
import { GET_INVENTORY_TAB } from '../../graphql/queries';
import * as userApi from '../../utils/usersApi';
import Header from '../Header/Header';
import Main from '../Main/Main';
import SearchPage from '../SearchPage/SearchPage'
import Register from '../Register/Register';
import InfoTooltip from '../InfoTooltip/InfoTooltip';
import InventoryView from '../InventoryView/InventoryView';
import { titleInfoTooltip, messageInfoTooltip, tabs } from '../../utils/constants';



function App() {
    const navigate = useNavigate();

    const [infoTooltipTitle, setInfoTooltipTitle] = useState('');
    const [infoTooltipMessage, setInfoTooltipMessage] = useState('');
    const [isInfoTooltipOpen,  setIsInfoTooltipOpen] = useState(false);
    const [isInventoryViewOpen, setIsInventoryViewOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState({});
    const [inventoryCategories, setInventoryCategories] = useState([]);
    const [activeTab, setActiveTab] = useState('details');
    
    const [loadInventory, { data, loading, error, reset }] = useLazyQuery(GET_INVENTORY_TAB[activeTab]);

    useEffect(() => {
        if (selectedInventory?.id) {
            if (['items', 'chat'].includes(activeTab)) {
                loadInventory({ variables: { [`${selectedInventory.__typename.toLowerCase()}Id`]: selectedInventory.id } })
            }
            else loadInventory({ variables: { id: selectedInventory.id } })
        }
    }, [activeTab, selectedInventory.id]);


    const inventory = data?.inventory || {}
    const categories = data?.categories?.enumValues ?? [];
    const items = data?.items ?? [];
    //console.log(categories);
    //console.log(data);
    

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

    const handlerRecordClick = async (record) => {
        setSelectedInventory(record);
        setIsInventoryViewOpen(true);
        loadInventory({ variables: { id: record.id } });
    }

    const handlerCloseRecordView = () => {
        setIsInventoryViewOpen(false);
        reset?.();
        setActiveTab('details');
        setSelectedInventory({});
    };

    const handlerChangeRecord = ((name, value) => { 
        setSelectedInventory((prev) => ({ ...prev, [name]: value })) });

    const handlerSelectTabs = (tabKey) => setActiveTab(tabKey);

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
                    categories={categories}
                    data={data}
                    status={{loading, error}}
                    onClose={handlerCloseRecordView}
                    handlerChangeRecord={handlerChangeRecord}
                    activeTab={activeTab}
                    onSelectTabs={handlerSelectTabs}
                />
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
