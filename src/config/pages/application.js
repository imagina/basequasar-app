//Layout container
import master from 'src/layouts/master'
import config from 'src/layouts/config'
import notFound from 'src/layouts/404'

//Middleware
import auth from '@imagina/quser/_router/middlewares/auth'
import access from '@imagina/quser/_router/middlewares/access'

export default {
	//Home Page
	home: {
		permission: null,
		activated: true,
		path: '/home',
		name: 'app.home',
		layout: require('src/layouts/index').default,
		containerLayout: master,
		title: 'sidebar.pageHome',
		icon: 'fas fa-home',
		middleware: [auth]
	},
	//Config Page
	config: {
		permission: null,
		activated: true,
		path: '/config',
		name: 'app.config',
		layout: require('src/layouts/app/config').default,
		containerLayout: config,
		title: 'sidebar.pageConfig',
		icon: 'fas fa-home',
	},
	//Not found Page
	notFound: {
		permission: null,
		activated: true,
		path: '*',
		name: 'app.not.found',
		layout: null,
		containerLayout: notFound,
		title: 'sidebar.pageNotFound',
		icon: 'fas fa-chart-bar'
	},
}
