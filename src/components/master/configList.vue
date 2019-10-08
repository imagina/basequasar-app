<template>
  <div id="configList">
    <!-- ===== Header ===== -->
    <div class="q-pt-sm">
      <q-item class="text-primary">
        <q-item-section avatar>
          <q-icon name="fas fa-cog"></q-icon>
        </q-item-section>
        <q-item-section class="text-h6">
          {{$tr('ui.label.configuration', {capitalize : true})}}
        </q-item-section>
      </q-item>
    </div>

    <!-- ===== User logged as ===== -->
    <q-no-ssr>
      <div class="q-px-sm" v-if="quserState.authenticated">
        <!--Separator-->
        <q-separator class="q-my-sm"/>

        <!--Title Loges as-->
        <div class="title-block">
          {{$tr('ui.configList.loggedAs', {capitalize : true})}}
        </div>

        <!--Settings-->
        <div class="q-py-sm">
          <!--Select Role-->
          <q-item class="q-py-none">
            <div class="full-width text-primary">
              <q-icon name="fas fa-user-tag" class="q-mr-xs"/>
              {{$tr('ui.label.role' , {capitalize : true})}}
              <label v-if="!show.roles" class="block ellipsis text-grey-8">
                {{options.roles[0].label}}
              </label>
              <q-select :options="options.roles" dense filter v-else outlined outlined emit-value map-options
                        v-model="roleId" class="full-width q-mt-xs" @input="updateDepRolUser"/>
            </div>
          </q-item>

          <!--Select Department-->
          <q-item class="q-py-none relative-position">
            <div class="full-width q-mt-sm text-primary">
              <q-icon name="fas fa-user-shield" class="q-mr-xs"/>
              {{$tr('ui.label.department', {capitalize : true})}}
              <label v-if="!show.departments" class="block ellipsis text-grey-8">
                {{options.departments[0].label}}
              </label>
              <q-select :options="options.departments" dense filter v-else outlined emit-value map-options
                        v-model="departmentId" class="full-width q-mt-xs" @input="updateDepRolUser"/>
            </div>
          </q-item>

          <!--Impersonate-->
          <div v-if="$auth.hasAccess('profile.user.impersonate') || quserState.impersonating">
            <q-separator class="q-my-sm"/>

            <!--Select User to impersonate-->
            <q-item class="q-py-none" v-if="!quserState.impersonating">
              <div class="full-width text-primary">
                <q-icon name="fas fa-user-secret" class="q-mr-sm"></q-icon>
                {{$tr('ui.label.impersonate')}}
                <!--Select-->
                <div class="q-mt-xs" v-if="!loadingImpersonate">
                  <q-select outlined dense v-model="userToImpersonate" use-input hide-selected
                            emit-value map-options
                            input-debounce="800" :options="userList" @filter="getUsers"
                            :placeholder="`${$tr('ui.label.find')} ${$tr('ui.label.user')}...`"
                            @input="impersonate()" style="width: 100%">
                    <template v-slot:no-option>
                      <q-item>
                        <q-item-section class="text-grey">
                          {{$tr('ui.message.searchNotFound')}}
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <!--Loading-->
                <div v-if="loadingImpersonate" class="q-py-sm">
                  <q-spinner class="q-mr-sm"/>
                  {{`${$tr('ui.label.loading')}...`}}
                </div>
              </div>
            </q-item>

            <!--Leave impersonating-->
            <q-item tag="label" link v-else @click.native="impersonate">
              <q-item-section avatar>
                <!--Icon-->
                <q-icon v-if="!loadingImpersonate" color="negative" name="fas fa-sign-out-alt" size="20px"/>
                <!--Loading-->
                <div v-if="loadingImpersonate" class="q-py-sm">
                  <q-spinner class="q-mr-sm"/>
                  {{`${$tr('ui.label.loading')}...`}}
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label v-if="!loadingImpersonate" color="grey-10" style="text-decoration: none">
                  {{$t('ui.configList.leaveImpersonating', {capitalize : true})}}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </q-no-ssr>

    <!-- ===== Language ===== -->
    <div class="q-px-sm">
      <!--Separator-->
      <q-separator class="q-my-sm"/>

      <!--Title-->
      <div class="title-block">
        {{$tr('ui.label.language', {capitalize : true})}}
      </div>

      <!--Data language-->
      <div class="q-mt-xs q-px-sm">
        <!-- Title -->
        <div class="text-primary">
          <q-icon name="fas fa-language"/>
          {{$tr('ui.label.language', {capitalize : true})}}
        </div>

        <!--Select Language-->
        <q-select :options="options.locales" outlined dense outlined emit-value map-options
                  filter hide-underline v-if="show.locales" @input="updateLocale"
                  v-model="locale" class="full-width q-if-focused q-if-focusable"/>

        <!--Current language selected-->
        <label v-else class="block ellipsis">
          {{options.locales[0].label}}
        </label>
      </div>
    </div>

    <!-- ===== Settings ===== -->
    <div class="q-px-sm">
      <!--Separator-->
      <q-separator class="q-my-sm"/>

      <!--Title-->
      <div class="title-block">
        {{$trp('ui.label.setting', {capitalize : true})}}
      </div>

      <!--Full Screen-->
      <q-item clickable class="q-mt-xs" @click.native="toggleFullscreen()">
        <q-item-section avatar>
          <q-icon color="primary" size="18px" name="fas fa-expand"/>
        </q-item-section>
        <q-item-section>
          {{$t('ui.configList.fullScreen', {capitalize : true})}}
        </q-item-section>
      </q-item>

      <!--Logout  -->
      <q-no-ssr>
        <q-item tag="label" link :to="{name:'auth.logout'}" v-if="quserState.authenticated">
          <q-item-section avatar>
            <q-icon color="negative" name="fas fa-sign-out-alt" size="20px"/>
          </q-item-section>
          <q-item-section>
            {{$t('ui.configList.signOut', {capitalize : true})}}
          </q-item-section>
        </q-item>
      </q-no-ssr>
    </div>

    <div class="text-subtitle2 fixed fixed-bottom text-primary q-px-md q-py-sm text-right">
      <q-icon name="fas fa-code-branch" class="q-mr-xs"/>
      {{versionText}}
    </div>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    mounted () {
      this.$nextTick(async function () {
        this.setOptions()
      })
    },
    data () {
      return {
        valueConsistsOf: 'BRANCH_PRIORITY',
        roleId: false,
        departmentId: false,
        locale: this.$store.state.qsiteSettings.defaultLocale,
        options: {
          roles: this.$store.getters['quserAuth/userRolesSelect'],
          departments: this.$store.getters['quserAuth/userDepartmentsSelect'],
          locales: this.$store.getters['qsiteSettings/getSelectedLocalesSelect']
        },
        show: {
          roles: false,
          departments: false,
          locales: false
        },
        fullScreen: this.$q.fullscreen.isActive,
        userToImpersonate: null,
        loadingImpersonate: false,
        userList: []
      }
    },
    computed: {
      versionText () {
        return 'version ' + config('app.version')
      },
      quserState () {
        return this.$store.state.quserAuth
      }
    },
    methods: {
      //Toggle fullscreen
      toggleFullscreen () {
        this.$q.fullscreen.toggle()
      },

      //Set departments and roles to options
      async setOptions () {
        let roleUser = await this.$cache.get.item('auth.role.id')//Get role form storage
        let departmentUser = await this.$cache.get.item('auth.department.id')//Get department form storage

        this.roleId = roleUser
        this.departmentId = departmentUser

        //Check if exist more then one role and department
        if (this.options.roles.length >= 2) {
          this.show.roles = true
        }
        if (this.options.departments.length >= 2) {
          this.show.departments = true
        }
        if (this.options.departments.length == 1) {
          if (this.options.departments[0].children) {
            this.show.departments = true
          }
        }
        if (this.options.locales.length >= 2) {
          this.show.locales = true
        }
      },

      //Update department and role id
      async updateDepRolUser (reset = false) {
        const departmentId = await this.$cache.get.item('auth.department.id')//Get department selected
        const roleId = await this.$cache.get.item('auth.role.id')//Get role selected

        //Check that role or department selected are distinct to atorage
        if ((departmentId != this.departmentId) || (roleId != this.roleId)) {
          await this.$cache.set('auth.department.id', this.departmentId)
          await this.$cache.set('auth.role.id', this.roleId)
          this.$store.dispatch('app/REFRESH_PAGE')
        }
      },

      //update Locale
      async updateLocale () {
        await this.$store.dispatch('qsiteSettings/SET_LOCALE', { locale: this.locale, vue: this })
        this.$router.push({
          name: this.$route.name,
          query: { ...this.$route.query, lang: this.locale }
        })
      },

      //Get users to impersonate
      getUsers (val, update, abort) {
        //Validate length of val
        if (val.length < 2) return abort()

        let params = { params: { take: 100, filter: { search: val } } }
        //Request
        this.$crud.index('apiRoutes.quser.users', params).then(response => {
          update(() => {
            let userId = this.$store.state.quserAuth.userId
            let options = []
            response.data.forEach(item => {
              if (item.id != userId) options.push({ label: item.fullName, value: item.id })
            })
            this.userList = this.$clone(options)
          })
        }).catch(error => {
          update(() => {
            this.userList = []
          })
        })
      },

      //toggle impersonate
      async impersonate () {
        this.loadingImpersonate = true

        if (this.quserState.impersonating) {
          await this.$store.dispatch('quserAuth/USER_LEAVE_IMPERSONATE')
        } else if (this.userToImpersonate) {
          await this.$store.dispatch('quserAuth/USER_IMPERSONATE', this.userToImpersonate)
        }

        this.loadingImpersonate = false
      }
    }
  }
</script>
<style lang="stylus">
  #configList
    color $grey-9

    .q-icon
      min-width max-content !important

    .title-block
      border-radius 5px
      background-color $primary
      color white
      padding 4px 15px
</style>
