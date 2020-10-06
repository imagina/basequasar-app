## QFORM  | 2.0.4

## Installation

`` npm i @imagina/qform@2.0.4 ``

## API Routes

| ENTITY | ROUTE |
| ------------- | ------------- |
| forms | apiRoutes.qform.forms |
| fields | apiRoutes.qform.fields |
| leads  | apiRoutes.qform.leads |
| types  | apiRoutes.qform.types |

## Pages

  - ##### Front-End

  | PAGE | NAME | PARAMS |
  | ------------- | ------------- | ------------- |
  
  - ##### Back-End

  | PAGE | NAME | PARAMS |
  | ------------- | ------------- | ------------- |
  | forms | qform.admin.form.index | - |
  | fields | qform.admin.fields.index | - |
  | fieldsCreate | qform.admin.fields.create | - |
  | fieldsUpdate | qform.admin.fields.update | - |
  | leads | qform.admin.leads.index | - |

  
## Components  

  | NAME |TYPE |PATH | PROPS |
  | ------------- | ------------- | ------------- | ------------- |
  | optionsForSelect | ADMIN|@imagina/qform/_components/admin/fields/optionsForSelect | - |
  | renderForm | FRONTEND |@imagina/qform/_components/frontend/forms/renderForm | (Number)formId |
