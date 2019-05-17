import authPlugin from "@imagina/quser/_plugins/auth"

// leave the export, even if you don't use it
export default ({ app, router, Vue }) => {
	Vue.prototype.$auth = authPlugin
}
