//Plugins
import config from '@imagina/qsite/_config/master/index'
import cache from '@imagina/qsite/_plugins/cache'
import crud from "@imagina/qcrud/_services/baseService";
import cloneDeep from 'lodash.clonedeep'
import {colors, AddressbarColor} from 'quasar'
import Quasar from 'quasar'
import axios from "axios";
import {Loading} from 'quasar';
import filter from '@imagina/qsite/_plugins/filter'
import helper from '@imagina/qsite/_plugins/helper'

//Refresh page
export const REFRESH_PAGE = ({state, commit, dispatch, getters}) => {
  return new Promise(async (resolve, reject) => {
    let currentRoute = state.currentRoute
    Loading.show()
    commit('LOAD_PAGE', false)
    await cache.restore(config('app.saveCache.refresh'))//Reset cache
    await dispatch('RESET_STORE')//Reset Vuex
    await dispatch('quserAuth/AUTH_UPDATE', null, {root: true}).catch(error => {
    })//Update user data
    await dispatch('qsiteApp/GET_SITE_SETTINGS', null, {root: true}).catch(error => {
    })//update settings sites
    dispatch('qsiteApp/SET_SITE_COLORS', null, {root: true})//Load colors
    commit('LOAD_PAGE', true)
    Loading.hide()
    resolve(true)
  })
}

//Get site settings
export const GET_SITE_SETTINGS = ({commit, dispatch, state}) => {
  return new Promise((resolve, reject) => {
    let params = {refresh: true}
    let configName = 'apiRoutes.qsite.siteSettings'
    let configApp = config('app')

    crud.index(configName, params).then(async response => {
      let data = response.data
      commit('SET_SITE_SETTINGS', data.siteSettings)
      commit('SET_AVAILABLE_LOCALES', data.availableLocales)
      commit('SET_AVAILABLE_THEMES', data.availableThemes)
      commit('SET_DEFAULT_LOCALE', data.defaultLocale)
      commit('SET_SELECTED_LOCALES')
      filter.setFilters(data.filters)

      //Set setting if is admin
      axios.defaults.params.setting.fromAdmin = configApp.isBackend

      resolve(true)
    }).catch(error => {
      console.error('[store-qsite]Error:: Store getting site settings - ', error)
      reject(error)
    })
  })
}

//Set site settins
export const SET_SITE_COLORS = ({state, commit, dispatch}) => {
  let settings = state.settings
  let dataColors = {}

  for (let i in settings) {
    //Get setting name
    let settingName = settings[i].name.split('::')[1]
    //Set colors
    if (settingName.indexOf('brand') != -1) {
      let nameBrand = settingName.replace('brand', '').toLowerCase() //Get brand name
      let color = settings[i].path ? settings[i].path : settings[i].plainValue//Get color
      //Validate if exist color
      if (color) {
        if (nameBrand.indexOf('addressbar') != -1) AddressbarColor.set(color)//Set bar color
        else colors.setBrand(nameBrand, color)//Set color
      }
    }
  }
}

//Set locale
export const SET_LOCALE = ({commit, dispatch, state}, params = {}) => {
  return new Promise(async resolve => {
    params = {locale: false, vue: false, ssrContext: false, ...params}
    let locale = params.locale
    let currentLocale = locale
    let Vue = params.vue

    //find locale in storage, store or first from selected locales
    if (!locale) {
      locale = await cache.get.item('site.default.locale')
      if (!locale) locale = state.defaultLocale
      if (!locale && state.selectedLocales.length) locale = state.selectedLocales[0]
      currentLocale = locale
    }

    //Set in storage
    await cache.set('site.default.locale', locale)

    //Set in store
    commit('SET_DEFAULT_LOCALE', locale)

    //Set in axios how default params
    axios.defaults.params.setting.locale = locale

    //Set default language to Quasar
    locale = (locale == 'en') ? 'en-us' : locale.toLowerCase()
    import(`quasar/lang/${locale}`).then(lang => {
      if (params.ssrContext) Quasar.lang.set(lang.default, params.ssrContext)
      else Quasar.lang.set(lang.default)
    })

    //Set default language to i18n
    import(`@imagina/qsite/_i18n/master/index`).then(({default: messages}) => {
      try {
        Vue.i18n.locale = locale
        Vue.i18n.setLocaleMessage(locale, messages[locale])
      } catch (e) {

      }

      try {
        Vue.$i18n.locale = locale
        Vue.$i18n.setLocaleMessage(locale, messages[locale])
      } catch (e) {

      }
    })

    //Change language in URL
    if (Vue.$route) {
      //Add language to route name
      let nextRoute = cloneDeep(Vue.$route)

      //Change route locale
      if (helper.getLocaleRouteName(nextRoute.name)) {
        let routeNameSegments = cloneDeep(nextRoute.name.split('.'))
        routeNameSegments[0] = locale
        nextRoute.name = routeNameSegments.join('.')
      } else {//Add locale
        nextRoute = {...nextRoute, name: `${locale}.${nextRoute.name}`}
      }

      //Redirect
      if (nextRoute.name != Vue.$route.name) Vue.$router.push(nextRoute)
    }

    resolve(true)
  })
}

//Reset values form Store
export const RESET_STORE = ({commit, dispatch}) => {
  return new Promise((resolve, reject) => {
    let stores = config('app.resetStores') || []
    stores.forEach(name => commit(name, null, {root: true}))
    resolve(true)
  })
}

//Set extra
export const SET_EXTRA = ({state, commit, dispatch}, params = false) => {
  return new Promise(async (resolve, reject) => {
    let extraData = params ? {...state.extra, ...params} : await cache.get.item('app.state.extra')

    //Save extra
    await cache.set('app.state.extra', extraData)
    commit('SET_EXTRA', extraData)
    resolve(true)
  })
}
