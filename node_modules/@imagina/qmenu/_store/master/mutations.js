//import array from '@imagina/qhelper/_plugins/array'

export const MENU_SUCCESS = (state, data) => {
  state.mainMenu = data
  //state.mainMenu.menuitems = array.builTree(data.menuitems)
};

export const MENU_EMPTY = (state) => {
  state.mainMenu = null
};

export function SET_MENUS(state, payload) {
  state.menus = payload
}

export function SET_MENU_ITEMS(state, payload) {
  state.menuItems = payload
}
