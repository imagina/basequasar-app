//Pages of Notifications
import master from 'src/layouts/master'

export default {
	//index
	index: {
		permission: null,
		activated: true,
		path: '/notifications',
		name: 'index',
		layout: require('@imagina/qnotification/_layouts/notifications').default,
		containerLayout: master,
		title: 'Notifications',
		icon: 'fas fa-chart-bar'
	},
	//creae
	create: {
		permission: 'fhia.roles.admin',
		activated: true,
		path: '/notifications/create',
		name: 'notifications.create',
		layout: require('@imagina/qnotification/_layouts/create').default,
		containerLayout: master,
		title: 'Create',
		icon: 'fas fa-chart-bar'
	},
}
