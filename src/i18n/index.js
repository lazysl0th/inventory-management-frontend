import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enAdmin from './locales/en/admin.json';
import enInventory from './locales/en/inventory.json';
import enItem from './locales/en/item.json';
import enProfile from './locales/en/profile.json';
import enSearch from './locales/en/search.json';
import enTable from './locales/en/table.json';
import enValidation from './locales/en/validation.json';
import esCommon from './locales/es/common.json';
import esAuth from './locales/es/auth.json';
import esAdmin from './locales/es/admin.json';
import esInventory from './locales/es/inventory.json';
import esItem from './locales/es/item.json';
import esProfile from './locales/es/profile.json';
import esSearch from './locales/es/search.json';
import esTable from './locales/es/table.json'
import uaCommon from './locales/ua/common.json';
import uaAuth from './locales/ua/auth.json';
import uaAdmin from './locales/ua/admin.json';
import uaInventory from './locales/ua/inventory.json';
import uaItem from './locales/ua/item.json';
import uaProfile from './locales/ua/profile.json';
import uaSearch from './locales/ua/search.json';
import uaTable from './locales/ua/table.json'

const resources = {
    en: {
        common: enCommon,
        inventory: enInventory,
        auth: enAuth,
        admin: enAdmin,
        inventory: enInventory,
        item: enItem,
        profile: enProfile,
        search: enSearch,
        table: enTable,
        validation: enValidation
    },
    es: {
        common: esCommon,
        inventory: esInventory,
        auth: esAuth,
        admin: esAdmin,
        inventory: esInventory,
        item: esItem,
        profile: esProfile,
        search: esSearch,
        table: esTable,
    },
    ua: {
        common: uaCommon,
        inventory: uaInventory,
        auth: uaAuth,
        admin: uaAdmin,
        inventory: uaInventory,
        item: uaItem,
        profile: uaProfile,
        search: uaSearch,
        table: uaTable,
    }
};

const savedLang = localStorage.getItem('lang') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang,
        fallbackLng: 'en',
        ns: ['common', 'inventory', 'auth'],
        defaultNS: 'common',
        interpolation: { escapeValue: false },
    });

i18n.on('languageChanged', (lang) => {
    localStorage.setItem('lang', lang);
});

export default i18n;
