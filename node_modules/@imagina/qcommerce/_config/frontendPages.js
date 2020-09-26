export default {
	// Index Product
	productsIndex: {
		permission: null,
		activated: true,
		path: '/products',
		name: 'products.index',
		page: () => import('@imagina/qcommerce/_pages/frontend/products/index'),
		layout: () => import('src/layouts/master'),
		title: 'Product Index',
		icon: 'fas fa-boxes',
		//authenticated: true,
	},
	// Index Product
	productsIndexByCategory: {
		permission: null,
		activated: true,
		path: '/products/:slugCategory',
		name: 'products.index.by.category',
		page: () => import('@imagina/qcommerce/_pages/frontend/products/index'),
		layout: () => import('src/layouts/master'),
		title: 'qcommerce.sidebar.adminProducts',
		icon: 'fas fa-boxes',
		//authenticated: true,
	},
	// Show Product
	productsShow: {
		permission: null,
		activated: true,
		path: '/product/:slugProduct',
		name: 'product.show',
		page: () => import('@imagina/qcommerce/_pages/frontend/products/show'),
		layout: () => import('src/layouts/master'),
		title: 'Product Show',
		icon: 'fas fa-boxes',
		//authenticated: true,
	},
	// Show Product
	shoppingCar: {
		permission: null,
		activated: true,
		path: '/shopping-cart',
		name: 'shopping.cart.index',
		page: () => import('@imagina/qcommerce/_pages/frontend/cart/index'),
		layout: () => import('src/layouts/master'),
		title: 'Shopping Car Show',
		icon: 'fas fa-shopping-cart',
		//authenticated: true,
	},
  // Show Cheackout
  checkout: {
    permission: null,
    activated: true,
    path: '/checkout',
    name: 'checkout.index',
    page: () => import('@imagina/qcommerce/_pages/frontend/checkout/index'),
    layout: () => import('src/layouts/master'),
    title: 'Checkout',
    icon: 'fas fa-shopping-cart',
    authenticated: true,
	},
	// Orders Index
	orders: {
		permission: null,
		activated: true,
		path: '/orders',
		name: 'orders.index',
		page: () => import('@imagina/qcommerce/_pages/frontend/orders/index'),
		layout: () => import('src/layouts/master'),
		title: 'Orders Index',
		icon: 'fas fa-shopping-cart',
		authenticated: true,
	},
	// Orders Show
	order: {
		permission: null,
		activated: true,
		path: '/order/:id',
		name: 'order.show',
		page: () => import('@imagina/qcommerce/_pages/frontend/orders/show'),
		layout: () => import('src/layouts/master'),
		title: 'Orders Show',
		icon: 'fas fa-shopping-cart',
		authenticated: true,
	},

}
