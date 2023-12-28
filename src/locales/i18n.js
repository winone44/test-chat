import Vue from 'vue';
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

const messages = {
    en: require('@/locales/json/en.json'),
    pl: require('@/locales/json/pl.json'),
    de: require('@/locales/json/de.json'),
    ru: require('@/locales/json/ru.json')
};
export const i18n = new VueI18n({
    locale: 'pl',
    fallbackLocale: 'pv',
    messages,
    missing: (locale, key) => {
        // Możesz tutaj zalogować brakujące tłumaczenia lub wykonać inne akcje
        console.warn(`Missing translation for key: "${key}" in locale: "${locale}"`);
        return 'none'; // Zwraca null zamiast klucza
    }
});