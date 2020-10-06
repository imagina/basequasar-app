const pages = config('pages') // Get Pages from config

//E-commerce
export default [
  {
    title: 'qcommerce.sidebar.adminGroup',
    icon: 'fas fa-cash-register',
    children: [
      pages.qcommerce.products,//products index
      pages.qcommerce.categories,//products categories,
      pages.qcommerce.options,//products options
      //pages.qcommerce.optionValues,//products options
      pages.qcommerce.paymentMethods,//products options
      pages.qcommerce.shippingMethods,//products options
      pages.qcommerce.orders,//Orders
      //pages.qcommerce.coupons,//Coupons
      //pages.qcommerce.stores,//Stores
      //pages.qcommerce.manufacturers,//Manufacturers
      //pages.qcommerce.taxClasses,//Tax Classes
      //pages.qcommerce.taxRates,//Tax Rates
    ]
  },
]
