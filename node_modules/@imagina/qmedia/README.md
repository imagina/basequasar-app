## QMEDIA 2.0.1
Module with CRUD for media.

## Installation

`` npm i @imagina/qmedia@2.0.1 ``

#### Components

- #### Media List 

    ```html
    <media-list embebed />
    ```
    
    | Vue Property  | Type | Required | Description |
    | ------------- | ------------- | ------------- | ------------- |
    | embebed  |Boolean  | false | Show File list changing actions buttons with 'Use this file' button

- #### Media Form

    ```html
    <media-form
       v-model="model"
       multiple 
       entity="Modules\Page\Entities\Page"
       entityId="2"
       label="Main Image"
       buttonLabel="Add Image"
       buttonIcon="fas fa-picture"
       zone='mainimage'
     />
    ```
    
    | Vue Property  | Type | Required | Description |
    | ------------- | ------------- | ------------- | ------------- |
    | multiple  |Boolean  | false | Show files on different structure for gallery
    | entity  |String  | true | Used for files request
    | entityId  |String  | false | Used for files request
    | zone |String  | false | Used for files request and for the v-model data, default: image
    | label |String  | false | Used for Master Title, default: Image
    | buttonLabel |String  | false | Used for Custom Button Title, default: 'Add File'
    | buttonIcon |String  | false | Used for Custom Button Icon, default: 'add'
