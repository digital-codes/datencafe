import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  //allowComposition: true,
  globalInjection: true,
  useScope: 'global',
  locale: 'de', // set the default locale
  fallbackLocale: 'en', // set the fallback locale
  messages: {
    en: require('@/locales/en.json'),
    de: require('@/locales/de.json')
  }
});

export default i18n

