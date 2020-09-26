import {helper} from '@imagina/qhelper/_plugins/helper'

export const mainMenu = (state) => {
  let mainMenu = []

  if(state.mainMenu){
    mainMenu = state.mainMenu
  }

  return mainMenu
};

export function menus (state){
  return state.menus
}

export  const menu = (state) => (menuId) => {
  let menu = state.menus.find(menu => menu.id === menuId)
  let itemsMenu = menu.menuitems
  itemsMenu.forEach(item => {
    item.activated = parseInt(item.status) ? true : false
    item.name = item.pageName || 'app.home'
    item.icon = item.icon || 'lens'
  })
  menu['items'] = helper.array.builTree(itemsMenu)
  return menu
}


export function menuItems (state){
  return state.menuItems
}
