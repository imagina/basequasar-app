<template>
  <q-page class="flex flex-center">
    <!--=== Loading ===-->
    <div class="text-center full-height q-pa-lg">
      <q-spinner-gears color="blue-grey" size="80px"/>
      <h6 class="q-ma-none q-mt-md text-blue-grey">
        Loading ({{progressPercentage}}%)
      </h6>
      <!--Bar Loading-->
      <q-progress :percentage="progressPercentage" color="primary" class="q-mt-sm"/>
    </div>

    <!--=== Dialog to Update APP ===-->
    <q-dialog
      v-model="dialog.updateApp"
      stack-buttons
      prevent-close
      ok="update"
      @ok="refreshSite()"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title" class="text-blue-grey">
				<q-icon name="fas fa-gift" class="q-mr-md"></q-icon>
				Update available!
				<q-icon name="fas fa-gift" class="q-ml-md"></q-icon>
			</span>

      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">
				Your browser will be refreshed
			</span>
    </q-dialog>

    <!--=== Dialog to logout user without role or department ===-->
    <q-dialog
      v-model="dialog.withOutRoleOrDepartment"
      stack-buttons
      prevent-close
      ok="Close"
      @ok="$router.push({name:'auth.logout'})"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title" class="q-title text-negative">
				<q-icon name="fas fa-times"></q-icon>
				Role or Department not assigned...
			</span>

      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">
				You do not have permission to enter the app
				<br>close in : {{dialog.logout.countDown}} seconds
			</span>
    </q-dialog>

    <!--=== Dialog to logout user ===-->
    <q-dialog
      v-model="dialog.logout.show"
      stack-buttons
      prevent-close
      ok="Close"
      @ok="$router.push({name:'auth.logout'})"
    >
      <!-- This or use "title" prop on <q-dialog> -->
      <span slot="title" class="text-negative">
				<q-icon name="fas fa-times"></q-icon>
				Access denied
			</span>

      <!-- This or use "message" prop on <q-dialog> -->
      <span slot="message">
				You do not have permission to enter the app
				<br>close in : {{dialog.logout.countDown}} seconds
			</span>
    </q-dialog>
  </q-page>
</template>
<script>
  //Plugins
  import axios from 'axios'
  import {notification} from 'src/plugins/notification'
  import _cloneDeep from 'lodash.clonedeep'

  //Services
  import auth from '@imagina/quser/_plugins/auth' //Middleware auth
  import profileServices from '@imagina/quser/_services/profile'
  import appServices from 'src/services/application/index'

  /*Components*/
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    props: {},
    components: {Treeselect},
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let redirectTo = vm.$route.params.redirectTo
        if (redirectTo) vm.fromRoute = redirectTo
        else vm.fromRoute = from
      })
    },
    watch: {
      dialog: {
        handler: function (value, oldVal) {
          if (value.logout.countDown <= 0)
            this.$router.push({name: 'auth.logout'})
        },
        deep: true
      },
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        //Percentage of config
        progressPercentage: 1,
        percentageChangeNumber: 2,
        currentRangePercentage: 1,
        //Dialogs
        dialogUpdateApp: false,
        dialog: {
          updateApp: false,
          roleAndDepartment: {
            show: false,
            roleId: false,
            departmentId: false
          },
          logout: {show: false, countDown: 5},
          withOutRoleOrDepartment: false
        },
        requestStatus: {
          departments: false,
          branchOffices: false,
          sources: false,
          sourceCategories: false,
          icommerceCategories: false
        }
      }
    },
    methods: {
      //Init config
      async init() {
        //Init Global Broadcast Channel
        if (env('PUSHER_ACTIVE') == 'true') notification.global()
        //Reset data of APP
        if (this.$route.params.refresh) {
          await this.$store.dispatch('app/RESET_STORE')//Reset Store
          await this.$helper.storage.restore(config('app.saveStorage.refresh'))//Restore storage
          if(await this.$helper.storage.get.item('userToken'))//Reset Auth
            await this.$store.dispatch('auth/AUTH_UPDATE')
          if (navigator && navigator.serviceWorker && navigator.serviceWorker.controller) {//Reset Service Worker
            navigator.serviceWorker.controller.postMessage({
              msg: "clearCache"
            });
          }
        }

        //Check version of App
        await this.checkVersionApp()
        //If there is User loged, config user data
        let userToken = await this.$helper.storage.get.item('userToken')
        if (userToken && this.$store.state.auth.userToken) {
          this.percentageChangeNumber += 4
          await this.setRoleAndDepartment()//Set Role and Department of User
          await this.configUserData()//Set user data
        }
        //Call aditional condigs
        await this.additionalConfigs()
        //Redirec from Config
        await this.redirectToRoute()
      },

      //Check if app is updated
      checkVersionApp() {
        return new Promise(async (resolve, reject) => {
          //Get current versión
          let verisonApp = parseInt(config('app.version').split('.').join(''))
          //Get version from backend
          let newVersion = await appServices.crud.index('apiRoutes.site.appVersion', {remember: false})
          newVersion = parseInt(newVersion.data.split('.').join(''))
          //update progress percentage
          this.setRandompercentage()
          //Check version
          if (verisonApp >= newVersion) {
            resolve(true)
          } else {
            this.dialog.updateApp = true
          }
        })
      },

      //Set departments and roles form user
      setRoleAndDepartment() {
        return new Promise(async (resolve, reject) => {
          const userData = await this.$helper.storage.get.item('userData')//Get user data from store
          const roles = userData.roles//Get roles from user
          const departments = userData.departments//Get departments from user
          let roleUser = await this.$helper.storage.get.item('auth.role.id')//Get role form storage
          let departmentUser = await this.$helper.storage.get.item('auth.department.id')//Get department form storage

          //Check if user has a Role and a Department assigned
          if (!roles.length || !departments.length) {
            this.dialog.withOutRoleOrDepartment = true
            setInterval(() => {
              this.dialog.logout.countDown -= 1
            }, 1000)
            return false
          }

          //Rol selected
          roleUser = roleUser ? roleUser : roles[0].id
          //Department selected
          departmentUser = departmentUser ? departmentUser : departments[0].id

          if (roleUser && departmentUser) {//Config rol and department
            //Save in storage
            await this.$helper.storage.set('auth.role.id', roleUser)
            await this.$helper.storage.set('auth.department.id', departmentUser)
            //Set in axios how default params
            axios.defaults.params = {
              setting: {departmentId: departmentUser, roleId: roleUser}
            }
          }

          this.setRandompercentage()//Change load percentage
          resolve(true)//Resolve promise
        })
      },

      //Config user data
      configUserData() {
        return new Promise(async (resolve, reject) => {
          //Set settings and permissions of user
          await this.$store.dispatch('auth/SET_PERMISSIONS');
          this.setRandompercentage() //update progress percentage
          await this.$store.dispatch('auth/SET_SETTINGS');
          this.setRandompercentage() //update progress percentage

          //Check if user has permission of login
          if (!auth.hasAccess('profile.api.login')) {
            this.dialog.logout.show = true
            setInterval(() => {
              this.dialog.logout.countDown -= 1
            }, 1000)
            return false
          }

          //Get Departments
          if (auth.hasAccess('profile.departments.index'))
            await this.$store.dispatch('auth/GET_DEPARTMENTS')
          this.setRandompercentage()//Change load percentage
          resolve(true)//Resolve promise
        })
      },

      //Custom Additional Configs
      additionalConfigs() {
        return new Promise(async (resolve, reject) => {
          // here you custom dispatch
          await this.$store.dispatch('site/GET_SITE_SETTINGS');
          this.setRandompercentage()//Change load percentage
          resolve(true)//Resolve Promise
        })
      },

      //Redirect after config data from page
      redirectToRoute() {
        this.setRandompercentage() //update progress percentage

        //Redirect route
        this.removeQueries()//Remove queries from URL

        //Check if request permission to go to route
        let permissionRoute = (this.fromRoute && this.fromRoute.meta) ?
          this.fromRoute.meta.permission : null

        //Default route to redirect
        let route = {
          name: 'app.home',
          params: Object.assign({fromConfig: 1}, (this.fromRoute ? this.fromRoute.params : {})),
          query: Object.assign({}, (this.fromRoute ? this.fromRoute.query : {}))
        }

        //If has permission to route, return to last page
        if (!this.fromRoute.name) route.name = 'app.home'
        else if (!permissionRoute) route.name = this.fromRoute.name
        else if (auth.hasAccess(permissionRoute)) route.name = this.fromRoute.name

        //If route id from login, redirect to home
        if(route.name == 'auth.login') route.name = 'app.home'

        //Redirect
        this.$router.push(route)
      },

      //remove querys from route
      removeQueries() {
        let query = Object.assign({}, this.$route.query);
        delete query.refresh;
        delete query.getData;
        this.$router.replace({query});
      },

      //Set random percentage of load
      setRandompercentage() {
        let range = Math.round(100 / this.percentageChangeNumber)//Get range bettewn change of porcentage
        let fromNumber = this.currentRangePercentage//Get from number for this change percentage
        let untilNumber = (fromNumber + range)//Get until number for this change percentage
        untilNumber >= 100 ? untilNumber = 99 : false//check that until number isn't higher that 100
        let randomPercentage = Math.floor(Math.random() * (untilNumber - fromNumber + 1) + fromNumber)//Get random percentange

        this.progressPercentage = randomPercentage
        this.currentRangePercentage = untilNumber
      },

      //Refresh site
      refreshSite() {
        window.location.reload(false)
        this.redirectToRoute()
      },
    }
  }
</script>
<style lang="stylus">
  @import "~variables";

</style>
