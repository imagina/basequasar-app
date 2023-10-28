---
sidebar_position: 4
---

# Modules
Each module contains the similar structure of [directory src](/docs/VueJs/configurations/ConfigSrc) and is automatically loaded by `qsite` module.

:::info
There is documentation only for modules with important content like `qsite` or `qcrud`. Other modules simply reuse the same structure and configurations according to the back-end module.
:::

## Structure
### _components
Module components available.

### _config
Can contain the next files to config the module:
- **main**: Global configuration.
  - **entityNames**: contains the entities name available to module and use with the [hook-plugin](/docs/VueJs/modules/QSite/QsitePlugins#hook).
  - **quickCards**: Array objects to define quick card to load in home pages. eg


```js
  //Quick Cards
  quickCards: [
    {
      active: true,
      permission: 'profile.user.manage',
      component: () => import('@imagina/quser/_components/quick-cards/lastUsers')
    }
  ]
```
- **apiRoutes**: API routes availables to call with global method `config('apiRoutes.{moduleName}.{apiRouteName}')`.

To instance each page config use the [config page structure](/docs/VueJs/modules/#_pages-1).

- **adminPages**: Load pages only to `iadmin` mode.
- **adminSidebar**: Load sidebar only to `iadmin` mode.
- **mainPages**: Load pages to any mode.

To instance each sidebar config use the [config sidebar structure](/docs/VueJs/modules/#_sidebar).
- **panelPages**: Load pages only to `ipanel` mode.
- **panelSidebar**: Load sidebar only to `ipanel` mode.

### _crud
Module `crud` entities available.

### _i18n
Contains config files with module translations based on [vue-i18n](https://kazupon.github.io/vue-i18n/introduction.html) by locale:
- **index**: import `layout` and `sidebar` translation files.
- **layout**: contains translations to use on pages and components of module.
- **sidebar**: contains translations to use only on sidebar items.

### _pages
Contains module pages group categorize by folders `admin`, `panel` and `main` to load on respective project mode.

### _store
Contains module [VUEX](https://vuex.vuejs.org/guide/) configuration, the name of state will be load in this way `{modulenameFoldername}`.


## Config structures
### _pages
| Property | Type   | Desscription  |
|:----------|:--------|:--------------|
| permission | String | Validate auth permission to acces to the page, set as  null if is public |
| activated | Boolean | Manage pages status |
| path | String | Unique Path to page |
| name | String | Unique name to vue-route |
| crud     | Import | Define `crud` to load as page. eg. <pre>``` import('@imagina/quser/_crud/users') ```</pre> Must be set with property `page`. eg. <pre>``` () => import('@imagina/qcrud/_pages/admin/crudPage') ```</pre> |
| page | Funcion | Define page to load. eg. <pre>``` () => import('@imagina/qcrud/_pages/admin/crudPage') ```</pre> |
| layout | Funcion | Define layout to load. eg. <pre>``` () => import('@imagina/qsite/_layouts/master.vue') ```</pre> |
| title | String | `i18n` key to translate, this word must be set in `module/_i18n/{lang}/sidebar` config. |
| icon | String | `fontaweson` icon name. |
| authenticated | Boolean | Define if page required sesion lo access. |
| subHeader.refresh | Boolean | Load a button refresh in layout master. |
| subHeader.breadcrumb | Array | Define breadcrumb to page and load in layout master. |
| subHeader.recommendations.name | String | Recommendation name to load in page |

Example:
```js
  //User Departments
  userDepartments: {
    permission: 'profile.departments.manage',
    activated: true,
    path: '/departments',
    name: 'quser.admin.departments',
    crud: import('@imagina/quser/_crud/departments'),
    page: () => import('@imagina/qcrud/_pages/admin/crudPage'),
    layout: () => import('@imagina/qsite/_layouts/master.vue'),
    isCrud: true,
    title: 'quser.sidebar.adminUserDepartments',
    icon: 'fas fa-people-arrows',
    authenticated: true,
    subHeader: {
      refresh: true,
      breadcrumb: ['quser.userIndex']
    }
  },
```

### _sidebar
| Property | Type   | Desscription  |
|:----------|:--------|:--------------|
| title | String | `i18n` key to translate, this word must be set in `module/_i18n/{lang}/sidebar` config. |
| icon | String | `fontaweson` icon name. |
| children | Array | [Config page structure](/docs/VueJs/modules/#_pages-1), each sidebar config has a variable `pages` with all module pages. |
Example:
```js
const pages = config('pages') // Get Pages from config

{
  title: 'quser.sidebar.adminGroup',
  icon: 'fas fa-users',
  children: [
    pages.quser.userIndex,//User Index
    pages.quser.userDepartments,//Departments Index
    pages.quser.userRoles,//Roles Index
    pages.quser.directory,//Directory
  ]
}
```


 