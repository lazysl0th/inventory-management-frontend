import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import commonEn from './locales/en/common.json';

const savedLang = localStorage.getItem('lang') || 'en'

i18n.use(HttpApi).use(initReactI18next).init({
  resources: {
    en: { common: commonEn }
  },
    lng: savedLang,
    fallbackLng: 'en',
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    ns: ['common', 'user', 'inventory', 'admin', 'auth', 'privacy', 'geo', 'support'],
    partialBundledLanguages: true,
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
      format: (value, format) => {
        if (format === 'lowercase') {
          return value.toLowerCase();
        }
        return value;
      }
    }
})

i18n.on('languageChanged', (lang) => {
    localStorage.setItem('lang', lang)
})

export default i18n
