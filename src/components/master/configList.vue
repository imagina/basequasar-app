<template>
  <div id="configList">
    <q-list no-border inset-delimiter>
      <!--Header-->
      <q-list-header>
        <h1 class="q-title text-primary q-ma-none">
          <q-icon name="fas fa-cog"></q-icon>
          APP Config
        </h1>
      </q-list-header>

      <!--Settings User-->
      <div v-if="$store.state.auth.userToken">
        <q-item-separator/>

        <!--Title Loges as-->
        <div class="q-mb-sm q-px-sm">
          <div class="round-borders q-py-xs q-px-md bg-primary text-white">
            Logged as
          </div>
        </div>

        <!--Select Role-->
        <q-item class="q-py-none">
          <div class="full-width text-primary">
            <q-icon name="fas fa-user-circle" class="q-mr-sm"></q-icon>
            Role
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
            <q-icon name="fas fa-globe" class="q-mr-sm"></q-icon>
            Department
            <treeselect
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
      </div>

      <q-item-separator/>

      <!--Language-->
      <div class="q-px-sm">
        <div class="round-borders q-py-xs q-px-md bg-primary text-white">
          Language
        </div>
      </div>

      <q-item class="q-py-none q-my-sm">
        <div class="full-width text-primary">
          <q-select :options="options.locales" :before="[{icon:'g_translate'}]"
                    filter hide-underline v-if="show.locales" @input="updateLocale"
                    v-model="locale" class="full-width q-if-focused q-if-focusable">
          </q-select>
          <h1 v-else class="ellipsis q-subheading q-ma-none text-grey-8 q-ml-md">
            {{options.locales[0].label}}
          </h1>
        </div>
      </q-item>

      <div class="q-px-sm">
        <div class="round-borders q-py-xs q-px-md bg-primary text-white">
          Settings
        </div>
      </div>

      <!--Full Screen-->
      <q-item tag="label" link @click.native="toggleFullscreen()">
        <q-item-side>
          <q-icon color="primary" size="18px" name="fas fa-expand">
          </q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="grey-10"
                       style="text-decoration: none">
            Show in full screen
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
            Refresh APP
          </q-item-tile>
        </q-item-main>
      </q-item>

      <!--Logout-->
      <q-item tag="label" link :to="{name:'auth.logout'}" v-if="$store.state.auth.userToken">
        <q-item-side>
          <q-icon color="negative" name="fas fa-sign-out-alt" size="20px"></q-icon>
        </q-item-side>
        <q-item-main>
          <q-item-tile tag="a"
                       color="grey-10"
                       style="text-decoration: none">
            Sign out
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
  /*Components*/
  import Treeselect from '@riophae/vue-treeselect'
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'

  export default {
    props: {},
    components: {Treeselect},
    watch: {},
    created() {
      this.$nextTick(async function () {
        this.setOptions()
      })
    },
    data() {
      return {
        valueConsistsOf: 'BRANCH_PRIORITY',
        roleId: false,
        departmentId: false,
        locale : this.$store.state.site.defaultLocale,
        options: {
          roles: this.$store.getters['auth/userRolesSelect'],
          departments: this.$store.getters['auth/userDepartmentsSelect'],
          locales: this.$store.getters['site/getSelectedLocalesSelect']
        },
        show: {
          roles: false,
          departments: false,
          locales : false,
        },
        fullScreen: this.$q.fullscreen.isActive,
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
        if(this.options.locales.length >= 2)
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
      async updateLocale(){
        await this.$store.dispatch('site/SET_LOCALE',this.locale)
        this.$router.push({name : 'app.config'})
      }
    }
  }
</script>
<style lang="stylus">
  @import "~variables";
  #configList
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
