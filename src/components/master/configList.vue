<template>
  <div id="configList">
    <q-list no-border inset-delimiter>
      <!--Header-->
      <q-list-header>
        <h1 class="q-title text-primary q-ma-none">
          <q-icon name="fas fa-cog"></q-icon>
          {{$tr('ui.label.configuration', {capitalize : true})}}
        </h1>
      </q-list-header>

      <!--== User logged as ==-->
      <div v-if="$store.state.quserAuth.userToken">
        <q-item-separator/>

        <!--Title Loges as-->
        <div class="q-mb-sm q-px-sm">
          <div class="round-borders q-py-xs q-px-md bg-primary text-white">
            {{$t('ui.configList.loggedAs', {capitalize : true})}}
          </div>
        </div>

        <!--Select Role-->
        <q-item class="q-py-none">
          <div class="full-width text-primary">
            <q-icon name="fas fa-user-tag" class="q-mr-sm"></q-icon>
            {{$tr('ui.label.role' , {capitalize : true})}}
            <q-select :options="options.roles" filter hide-underline v-if="show.roles"
                      v-model="roleId" class="full-width q-mt-xs" @input="updateDepRolUser">
            </q-select>
            <h1 v-else class="ellipsis q-subheading q-ma-none text-grey-8 q-ml-md q-mt-xs">
              {{options.roles[0].label}}
            </h1>
          </div>
        </q-item>

        <!--Select Department-->
        <q-item class="q-py-none relative-position">
          <div class="full-width q-mt-sm text-primary">
            <q-icon name="fas fa-user-shield" class="q-mr-sm"></q-icon>
            {{$tr('ui.label.department', {capitalize : true})}}
            <tree-select
              :clearable="false"
              :append-to-body="true"
              v-if="show.departments"
              :options="options.departments"
              :value-consists-of="valueConsistsOf"
              v-model="departmentId"
              placeholder=""
              class="full-width"
              @input="updateDepRolUser"
            />
            <h1 v-else class="ellipsis q-subheading q-ma-none text-grey-8 q-ml-md q-mt-xs">
              {{options.departments[0].label}}
            </h1>
          </div>
        </q-item>

        <q-item-separator/>

        <!--Select User to impersonate-->
        <q-item class="q-py-none" v-if="$auth.hasAccess('profile.user.impersonate') && !isImpersonate">
          <div class="full-width text-primary">
            <q-icon name="fas fa-user-secret" class="q-mr-sm"></q-icon>
            {{$tr('ui.label.impersonate')}}
            <!--Select-->
            <div class="q-pl-md" v-if="!loadingImpersonate">
              <tree-select
                v-model="userToImpersonate"
                :placeholder="`${$tr('ui.label.find')} ${$tr('ui.label.user')}...`"
                :async="true"
                :load-options="getUsers"
                :loadingText="`${$tr('ui.label.loading')}...`"
                :searchPromptText="`${$tr('ui.message.searchByIdOrName')}...`"
                :noResultsText="`${$tr('ui.message.searchNotFound')}...`"
                @input="impersonate"
              />
            </div>
            <!--Loading-->
            <div v-if="loadingImpersonate" class="q-py-sm">
              <q-spinner class="q-mr-sm"/>
              {{`${$tr('ui.label.loading')}...`}}
            </div>
          </div>
        </q-item>

        <!--Leave impersonating-->
        <q-item tag="label" link v-if="isImpersonate" @click.native="impersonate">
          <q-item-side>
            <!--Icon-->
            <q-icon v-if="!loadingImpersonate" color="negative" name="fas fa-sign-out-alt" size="20px"/>
            <!--Loading-->
            <div v-if="loadingImpersonate" class="q-py-sm">
              <q-spinner class="q-mr-sm"/>
              {{`${$tr('ui.label.loading')}...`}}
            </div>
          </q-item-side>
          <q-item-main>
            <q-item-tile v-if="!loadingImpersonate" color="grey-10" style="text-decoration: none">
              {{$t('ui.configList.leaveImpersonating', {capitalize : true})}}
            </q-item-tile>
          </q-item-main>
        </q-item>
      </div>

      <q-item-separator/>

      <!--== Language ==-->
      <div class="q-px-sm">
        <div class="round-borders q-py-xs q-px-md bg-primary text-white">
          {{$tr('ui.label.language', {capitalize : true})}}
        </div>
      </div>

      <!--Data language-->
      <q-item class="q-py-none q-my-sm">
        <div class="full-width text-primary">
          <q-icon name="fas fa-language" class="q-mr-sm"></q-icon>
          {{$tr('ui.label.language', {capitalize : true})}}
          <q-select :options="options.locales"
                    filter hide-underline v-if="show.locales" @input="updateLocale"
                    v-model="locale" class="full-width q-if-focused q-if-focusable">
          </q-select>
          <h1 v-else class="ellipsis q-subheading q-ma-none text-grey-8 q-ml-md">
            {{options.locales[0].label}}
          </h1>
        </div>
      </q-item>

      <q-item-separator/>

      <!--== Settings ==-->
      <div class="q-px-sm">
        <div class="round-borders q-py-xs q-px-md bg-primary text-white">
          {{$trp('ui.label.setting', {capitalize : true})}}
        </div>
      </div>

      <!--Full Screen-->
      <q-item tag="label" link @click.native="toggleFullscreen()">
        <q-item-side>
          <q-icon color="primary" size="18px" name="fas fa-expand">
          </q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a" color="grey-10" style="text-decoration: none">
            {{$t('ui.configList.fullScreen', {capitalize : true})}}
          </q-item-tile>
        </q-item-main>
      </q-item>

      <!--refresh app-->
      <q-item tag="label" link :to="{name:'app.config', params: {refresh: 1}}">
        <q-item-side>
          <q-icon color="primary" name="fas fa-sync" size="18px"></q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="grey-10"
                       style="text-decoration: none">
            {{$t('ui.label.refresh', {capitalize : true})}}
          </q-item-tile>
        </q-item-main>
      </q-item>

      <!--Logout-->
      <q-item tag="label" link :to="{name:'auth.logout'}" v-if="$store.state.quserAuth.userToken">
        <q-item-side>
          <q-icon color="negative" name="fas fa-sign-out-alt" size="20px"></q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="grey-10"
                       style="text-decoration: none">
            {{$t('ui.configList.signOut', {capitalize : true})}}
          </q-item-tile>
        </q-item-main>
      </q-item>

      <div class="fixed fixed-bottom text-primary q-px-md q-py-sm text-right">
        <q-icon name="fas fa-code-branch" class="q-mr-xs"></q-icon>
        {{versionText}}
      </div>
    </q-list>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    created() {
      this.$nextTick(async function () {
        this.setOptions()
        this.checkImpersonate()
      })
    },
    data() {
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
        isImpersonate: false,
      }
    },
    computed: {
      versionText() {
        return 'version ' + config('app.version')
      }
    },
    methods: {
      //Toggle fullscreen
      toggleFullscreen() {
        this.$q.fullscreen.toggle()
      },

      //Set departments and roles to options
      async setOptions() {
        let roleUser = await this.$helper.storage.get.item('auth.role.id')//Get role form storage
        let departmentUser = await this.$helper.storage.get.item('auth.department.id')//Get department form storage

        this.roleId = roleUser
        this.departmentId = departmentUser

        //Check if exist more then one role and department
        if (this.options.roles.length >= 2)
          this.show.roles = true
        if (this.options.departments.length >= 2)
          this.show.departments = true
        if (this.options.departments.length == 1)
          if (this.options.departments[0].children)
            this.show.departments = true
        if (this.options.locales.length >= 2)
          this.show.locales = true
      },

      //Update department and role id
      async updateDepRolUser(reset = false) {
        const departmentId = await this.$helper.storage.get.item('auth.department.id')//Get department selected
        const roleId = await this.$helper.storage.get.item('auth.role.id')//Get role selected

        //Check that role or department selected are distinct to atorage
        if ((departmentId != this.departmentId) || (roleId != this.roleId)) {
          await this.$helper.storage.set('auth.department.id', this.departmentId)
          await this.$helper.storage.set('auth.role.id', this.roleId)
          this.$router.push({name: 'app.config', params: {refresh: 1}})
        }
      },

      //update Locale
      async updateLocale() {
        await this.$store.dispatch(
          'qsiteSettings/SET_LOCALE',
          {locale: this.locale, vue: this}
        )
        this.$router.push({name: 'app.config', params: {refresh: true}})
      },

      //Get users to impersonate
      getUsers({action, searchQuery, callback, instanceId}) {
        if (action === 'ASYNC_SEARCH') {
          let params = {params: {take: 100, filter: {search: searchQuery}}}
          //Request
          this.$crud.index('apiRoutes.quser.users', params).then(response => {
            let userId = this.$store.state.quserAuth.userId
            let options = []
            response.data.forEach(item => {
              if (item.id != userId) options.push({label: item.fullName, id: item.id})
            })
            callback(null, options)//Response
          })
        } else {
          callback(null, [])
        }
      },

      //Chek if is impersonate
      async checkImpersonate() {
        let impersonatorData = await this.$helper.storage.get.item('impersonatorData')
        if (impersonatorData) this.isImpersonate = true
      },

      //toggle impersonate
      impersonate() {
        //LEave impersonating
        if (this.isImpersonate) {
          this.loadingImpersonate = true
          this.$store.dispatch('quserAuth/USER_LEAVE_IMPERSONATE');
        }

        //Impersonate
        if (!this.isImpersonate && this.userToImpersonate) {
          this.loadingImpersonate = true
          this.$store.dispatch('quserAuth/USER_IMPERSONATE', this.userToImpersonate);
        }
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #configList
    .vue-treeselect
      border 0px !important

      .vue-treeselect__control
        background transparent !important
        font-size 16px
        border none !important
        cursor pointer

        .vue-treeselect__single-value
          padding-left 15px

    .q-select
      .q-input-target
        padding-left 15px
</style>
