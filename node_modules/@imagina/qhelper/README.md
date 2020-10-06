## QHELPER 2.0.2

This package content methods with helpers to coding more easy and fast 

## Installation

`` npm i @imagina/qhelper@2.0.2 ``

## Plugins
- #### Alert
    Activate alert in bottom-right position. to use it, call `this.$alert`.
    
    The availables types are : `success`, `error`, `info`, `warning`, `light`,`dark`. Usage:
    
    ```js
    this.$alert.success('message') // To send only the message
    this.$alert.success({message : '', timeOut : 4000}) //To set timeOut
    ```
    
- #### Array
  
  | Sintax | Description |
  | ------ | ----------- |
  | `$array.tree(array, {label, id})` | Format array to use as options in components `tree-select` and `q-select` |      
  | `$array.parents(array, id)` | Return all parents from array, setting ID parameter to search into a array |      
  | `$array.children(array, id)` | Return all childrens from array, setting ID parameter to search into a array |      
  | `$array.diff(array1, array2)` | Search differences between two arrays |           

- #### Cache
  
  Use this plugin to save information in cache of client side
  
  | Sintax | Description |
  | ------ | ----------- |
  | `$cache.set(key, data)` | Create or update item un cache |    
  | `$cache.get.item(key)` | Get a item from cache |    
  | `$cache.get.items([key,key2,...])` | Get items from cache|    
  | `$cache.remove(key)` | Remove item from cache |
        
- #### Helper
  
  | Sintax | Description |
  | ------ | ----------- |
  | `$helper.timetamp()` | Return current date in timestamp format, if set a parameter date, return this date in timestamp format |
  | `$helper.getInt(value)` | Return only integer values from a string |  
  | `$helper.convertToFrontField(fields)` | Change format to 'fields' data, to use in front-end, if you set a second parameter this will be merged with the frist parameter |  
  | `$helper.convertToBackField(fields)` | Change format to 'fields' data, to send to back-end |  
  | `$helper.convertStringToSnakeCase(fields)` | Change a string to snake case. |  
  | `$helper.toSnakeCase(object)` | Change keys from object to snake case |  
  | `$helper.checkPassword(pasword)` | Check if password has a correct format |  
  | `$helper.validateEmail(email)` | Check if email has a correct format |  
  | `$helper.filterOptions(val, options, permitValues)` | Filter options to component qselect |  
