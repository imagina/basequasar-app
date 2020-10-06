const moduleName = 'icommerce';
const moduleVersion = 'v3';
const urlBase = `/${moduleName}/${moduleVersion}`

export default {
	urlBase : urlBase,
	version: moduleVersion,
	products : `${urlBase}/products`,
	productOptions : `${urlBase}/product-option`,
	productOptionOrder : `${urlBase}/product-option/order`,
	productOptionValues : `${urlBase}/product-option-values`,
	options : `${urlBase}/options`,
	optionValues : `${urlBase}/option-values`,
  optionValuesOrdener : `${urlBase}/option-values/order`,
	categories : `${urlBase}/categories`,
	cart : `${urlBase}/carts`,
	cartProducts : `${urlBase}/cart-products`,
	paymentMethods: `${urlBase}/payment-methods`,
	shippingMethods: `${urlBase}/shipping-methods`,
	orders : `${urlBase}/orders`,
	orderStatus : `${urlBase}/order-statuses`,
	orderStatusHistory : `${urlBase}/order-status-history`,
  coupons : `${urlBase}/coupons`,
  stores : `${urlBase}/stores`,
	manufacturers : `${urlBase}/manufacturers`,
  taxClasses : `${urlBase}/tax-classes`,
	taxRates : `${urlBase}/tax-rates`,
  productDiscounts : `${urlBase}/product-discounts`,
}
