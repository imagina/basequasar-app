import store from 'src/store'

//Reset values form Store
export const RESET_STORE = ({commit,dispatch}) => {
	return new Promise((resolve, reject) => {
		store.commit('auth/RESET')
		resolve(true)
	})
}
