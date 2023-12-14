import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ChainedBackend from 'i18next-chained-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import authentication_en from './languages/en/authentication.json';
import common_en from './languages/en/common.json';
import signIn_en from './languages/en/signIn.json';
import signUp_en from './languages/en/signUp.json';
import xero_en from './languages/en/xero.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

const resources = {
  en: {
    authentication: authentication_en,
    common: common_en,
    signIn: signIn_en,
    signUp: signUp_en,
    xero: xero_en,
  },
};

i18n
  .use(ChainedBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      returnNull: false,
      load: 'languageOnly',
      fallbackLng: 'en',
      preload: ['en'],
      ns: [
        'authentication',
        'common',
        'signIn',
        'signUp',
        'xero',
      ],
      cache: ['localStorage'],
      debug: false,
      saveMissing: false,
      interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
      },
      react: {
        useSuspense: true,
      },
      resources, // translations served from local file directory
    },
    (err) => {
      if (err) {
        console.error('err i18n', err);
      }
    }
  );

export { i18n };
