import array from '@imagina/qsite/_plugins/array'
import cloneDeep from 'lodash.clonedeep'

export const getExtra = (state) => (name) => {
  if (state.extra && state.extra[name]) return state.extra[name]
  return false
}

export const getState = (state) => (name) => {
  return cloneDeep(state[name] || undefined)
}

export const getSettings = (state) => {
  return state.settings;
};

export const getAvalaibleLocales = (state) => {
  return state.availableLocales;
};

export const getAvalaibleThemes = (state) => {
  return state.availableThemes;
};

export const getDefaultLocale = (state) => {
  return state.defaultLocale;
};

export const availableLocalesSelect = (state) => {
  return array.select(state.availableLocales, {label : 'name', id : 'iso'});
};

export const availableLocalesTreeSelect = (state) => {
  let items = []
  state.availableLocales.forEach((locale,index) => {
    items.push({
      id: locale.iso,
      label: locale.name
    })
  })
  return items
};

export const availableThemesSelect = (state) => {
  return array.select(state.availableThemes, {label : 'name', id : 'name'});
};

export const availableThemesTreeSelect = (state) => {
  let items = []
  state.availableThemes.forEach(theme => {
    items.push({
      id:theme.name,
      label: theme.name
    })
  })
  return items
};

export const getSettingValueByName = (state) => (filter) => {
  let settings = state.settings
  let response = undefined

  settings.forEach(item => {
    if (item.name == filter) response = item.value
  })

  return response
};

export const getSettingMediaByName = (state) => (filter) => {
  let settings = state.settings
  let response = ''

  settings.forEach(item => {
    if (item.name == filter) response = item.media
  })

  return response
};

export const getSelectedLocalesSelect = (state) => {
  //Get labels formselected locales
  let languages = state.availableLocales.filter(item => state.selectedLocales.indexOf(item.iso) >= 0)
  let selectLanguages = array.select(languages, {label : 'name', id : 'iso'})
  selectLanguages.forEach((item,index) => {
    selectLanguages[index].label += ` (${item.value})`
  })
  //Return array select form selected languages
  return selectLanguages
};
