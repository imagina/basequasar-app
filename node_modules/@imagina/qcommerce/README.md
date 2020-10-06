## QCOMMERCE  | 2.0.5

## Installation

`` npm i @imagina/qcommerce@2.0.5 ``

## API Routes

| ENTITY | ROUTE |
| ------------- | ------------- |
| Products  | apiRoutes.qcommerce.products  |
| Product Options  | apiRoutes.qcommerce.productOptions |
| Product Option Values  | apiRoutes.qcommerce.productOptionValues |
| Options  | apiRoutes.qcommerce.options |
| Option Values  | apiRoutes.qcommerce.optionValues |
| Categories  | apiRoutes.qcommerce.categories |
| Cart  | apiRoutes.qcommerce.cart |
| Cart Products  | apiRoutes.qcommerce.cartProducts |
| Payment Methods | apiRoutes.qcommerce.paymentMethods |
| Shipping Methods | apiRoutes.qcommerce.shippingMethods |
| Orders  | apiRoutes.qcommerce.orders |
| Order Status  | apiRoutes.qcommerce.orderStatus |
| Order Status History  | apiRoutes.qcommerce.orderStatusHistory |

## Pages

- #### Front-End

  | PAGE | NAME | PARAMS |
  | ------------- | ------------- | ------------- |
  | Products Index | products.index | {slugCategory} |
  | Products Show | product.show | {slugProduct} | 
  | Shopping Cart | shopping.cart.index | - | 
  | Check Out | checkout.index | - |
  | Orders Index | orders.index | - |
  | Order Show | order.show | {id} |
  
- #### Back-End

  | PAGE | NAME | PARAMS |
  | ------------- | ------------- | ------------- |
  | Products Index | qcommerce.admin.products.index | - |
  | Products Create | qcommerce.admin.products.create | - |
  | Products Edit | qcommerce.admin.products.edit | {id} |
  | Categories | qcommerce.admin.categories | - |
  | Options | qcommerce.admin.options | - |
  | Option Values | qcommerce.admin.options.values | - |
  | Payment Methods | qcommerce.admin.payment.methods | - |
  | Shipping Methods | qcommerce.admin.shipping.methods | - |
  
## Components  

  | NAME | ROUTE |
  | ------------- | ------------- |
  | Add To Cart Options | @imagina/qcommerce/_components/frontend/cart/widgets/addToCartOptions |
  | Menu Categories | @imagina/qcommerce/_components/frontend/categories/menu |
  | Widget Categories | @imagina/qcommerce/_components/frontend/categories/widgetCircles |
  | Select Options Product | @imagina/qcommerce/_components/frontend/products/widgets/selectOptionsProduct |
  | Select Products | @imagina/qcommerce/_components/frontend/products/widgets/selectProducts |
  | Search Products | @imagina/qcommerce/_components/frontend/products/search |
  | Select Quantity | @imagina/qcommerce/_components/selectQuantity |

## Store VUEX  
- ##### States
  - qcommerceOrders.pending
  - qcommerceCart.cart
  - qcommerceCart.cartId
