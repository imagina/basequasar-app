import { boot } from 'quasar/wrappers';
import { createI18n } from 'vue-i18n';
import { cache, helper } from 'src/plugins/utils';
import pluginI18n from 'src/plugins/i18n.ts';

// i18n data
import { messageCompiler } from 'src/modules/qsite/_i18n/master/formats/customFormats';
import numberFormats from 'src/modules/qsite/_i18n/master/formats/currencyFormats';
import datetimeFormats from 'src/modules/qsite/_i18n/master/formats/dateTimeFormats';
import messagesLocal from 'src/setup/translations';

export default boot(async ({ app, store }) => {
  //Request messages
  const useLocalTranslations = config('app.useLocalTranslations');
  const messagesServer = useLocalTranslations ? {} : await store.dispatch('qtranslationMaster/GET_TRANSLATIONS', { refresh: false });
  const messages = useLocalTranslations ? messagesLocal : messagesServer;
  //===== Get default language
  //From URL
  let defaultLanguage = helper.getLocaleRoutePath(window.location.hash);
  //From Cache
  if (!defaultLanguage) defaultLanguage = await cache.get.item('site.default.locale');
  //From VUEX Store or Config APP
  if (!defaultLanguage) defaultLanguage = store.state.qsiteApp.defaultLocale || config('app.languages.default');

  //====== Config i18n and set instance i18n
  const i18n = createI18n({
    locale: defaultLanguage,
    fallbackLocale: defaultLanguage,
    messageCompiler,
    numberFormats,
    datetimeFormats,
    silentTranslationWarn: true,
    messages,
    warnHtmlInMessage: "off"
  });
  //=== Set the i18n instance to global node
  pluginI18n.setI18n(i18n);

  //===== Change language to quasar components
  await store.dispatch('qsiteApp/SET_LOCALE', {
    locale: defaultLanguage,
    ssrContext: false,
    vue: app
  });

  //Set as global the i18n helper methods
  Object.keys(pluginI18n).forEach(methodName => {
    app.config.globalProperties[`$${methodName}`] = pluginI18n[methodName];
  });

  //Set i18n
  app.use(i18n);
});
