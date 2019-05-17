import users from '@imagina/quser/_config/pages'

export default {
	users : users,
	application : require('src/config/pages/application').default, //<----- Last always
}