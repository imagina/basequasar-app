## QNOTIFICATION  | 2.0.1

## Installation

`` npm i @imagina/qnotification@2.0.1 ``

## Aditional Configuration
  ### Add the following lines in .env file, with pusher keys:

  ```
  BROADCAST_DRIVER=pusher
  PUSHER_APP_KEY=YOUR_APP_KEY
  PUSHER_APP_SECRET=YOUR_APP_SECRET
  PUSHER_APP_ID=YOUR_APP_ID
  PUSHER_APP_CLUSTER=YOUR_APP_CLUSTER
  PUSHER_APP_ENCRYPTED=YOUR_APP_ENCRYPTER
  ```

## API Routes

| ENTITY  | ROUTE |
| ------------- | ------------- |
| notifications  | apiRoutes.qnotification.notifications  |

## Pages
- ### Front-End

   | PAGE | NAME |
   | ------------- | ------------- |
  
- ### Back-End

   | PAGE | NAME |
   | ------------- | ------------- |
   | notifications  | qnotification.admin.notifications.index  |
  
## Components  

  | NAME | ROUTE |
  | ------------- | ------------- |
  | notifications | @imagina/qnotification/_components/widgets/notifications |
 
## Style Customization
  You can customize the notification widget, referring to it with the *widget-notification* identifier
 
 ###### Note: [version 1.0.0](https://github.com/imagina/qnotification/tree/1.0.0)
