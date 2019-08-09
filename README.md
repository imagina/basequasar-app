## BASE QUASAR  | 1.0.0

## Installation

```
- git clone https://github.com/imagina/basequasar-app.git
- npm install 
```

## Usage

- You must config in `.env` the values to `BASE_URL`, `CLIENT_SECRET`, and 
the pusher data if it's necessary

- In `src/config/app.js` you can configure the next options for you APP:
  - __isBackend__ : Define if your APP is front-end or back-end
  - __languages__ 
    - default : Define the default language of your APP
    - availables : Define the available languages in your APP
  - __modules__ : Define the modules to use in your APP
  - __saveStorage__
    - refresh : Define the keys from storage to save when do refresh APP
    - logout : Define the keys from storage to save when do logout APP

- in `src-pwa/custom-service-worker` in the line `12` change baseUrl by backend URL
    
- If you need change a page template from any packages, you must do it in `src/config/pages/index`  
  just before `export` this way:
  
  ```js
    pages.quser.login.layout = require('route-new-template').default
  ```  
## Pages

  | PAGE | NAME |
  | ------------- | ------------- |
  | Home | app.home |
  | Config | app.config |
  | Not Found | app.not.found |
  
## Components  

  | NAME | ROUTE | GLOBAL |
  | ------------- | ------------- | ------------- |
  | 404 | src/components/404 | False |
  | Not Results | src/components/notResults | True |
  | Upload Image | src/components/uploadImage | True |
  | comments Facebook | src/components/commentsFB | False |
  | Dynamic Field | src/components/master/dynamicField | True |
  | Imagina Logo SVG | src/components/master/imaginaSVG | False |
  | Inner Loading | src/components/master/innerLoading | True |
  | Recursive Item | src/components/master/recursiveItem | False |
  | Recursive List Select | src/components/master/recursiveListSelect | False |
  | Schedules | src/components/master/schedules | False |
  | Vue Tree Select | @riophae/vue-treeselect | True |
  
## Plugins
- #### Clone
    Use Libray `lodash` and method `clonedeep` to clone data. call it this way `this.$clone(var-to-clone)` 
    it is also possible import it:
    
    ```js
    import cloneDeep from 'lodash.clonedeep'
    ``` 
    
- #### Global Component
    To register a global component you must add it in `src/plugins/globalComponents`

- #### Translations (i18n)
    - To add new keys translatables in your APP, you must do it in 'src/i18n/lang-folder/ui' this way:
        
        > To call key from project, use prefix "ui" `$tr('ui.key-name')` and to call from package, use prefix 
                "module-name" `$tr('quser.key-name')`
                
        ```js
        {newKey : 'New key'} //Singular
        {newKey : 'New key | new keys'} //Plural option
        ```   
     
    - Add fields translatables in template with next methods:
    
        > if you need to add translatables fields in your script, you can only do it, if you return it from `computed`
        and calling `this.$tr('key-name')`
    
        - ###### $tr('key-field-translatable', params : {})
            Translate a singular key
        - ###### $trp('key-field-translatable', params : {})
            Translate a plural key
        - ###### $trd('key-field-translatable', params : {})
            Translate a date
        - ###### $trc('key-field-translatable', params : {})
            Translate a currency
        - ###### $n(integer)
            Number format
    
    - To add new translation format, you must do it in `src/i18n/formats/customFormats`
    
## Additional features

- #### Config
    You can use globally config keys. Usage: `config('key-name')`
    
- #### Env
    You can use globally `.env` keys. Usage: `env('key-name')`
    
- #### Vuex
    Globally usage `Vuex` (Store) is available. Usage: `this.$store`
    
- #### Moment
    It is available to use the `Moment` library, to manage dates     
