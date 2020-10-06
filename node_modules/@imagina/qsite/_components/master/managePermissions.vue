<template>
  <q-card id="componentSelectPermissions" class="no-shadow col-12"
          v-if="$auth.hasAccess('profile.permissions.manage')">
    <!--===== Title =====-->
    <div id="barTitle" class="q-px-sm q-py-sm">
      <div class="row justify-between items-center">
        <!--Title-->
        <div class="text-subtitle1 text-primary text-capitalize">
          <q-icon name="fas fa-tasks"></q-icon>
          {{this.$trp('ui.label.permission')}}
        </div>
        <!--Loading-->
        <q-spinner v-if="loading" color="blue-grey" :size="30"/>
        <!--Toogle list-->
        <q-btn icon="fas fa-edit" size="sm" @click="modal.show = true" rounded unelevated
               color="positive" class="q-ml-sm" v-else-if="Object.keys(modal.listPermissions).length"/>
      </div>
    </div>

    <!--===== Dialog Content =====-->
    <q-dialog id="modalFormPermissions" v-model="modal.show" v-if="modal.show" no-esc-dismiss no-backdrop-dismiss>
      <q-card>
        <!--== Header == -->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title class="text-capitalize">
            <q-icon name="fas fa-tasks"></q-icon>
            {{this.$trp('ui.label.permission')}}
          </q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--=== Content ===-->
        <!--Tabs-->
        <q-tabs v-model="modal.tab" class="text-grey" active-color="primary"
                indicator-color="primary" dense inline-label align="justify">
          <q-tab icon="fas fa-filter" name="filter" :label="$tr('ui.label.filter')"/>
          <q-tab icon="fas fa-exchange-alt" name="change" :label="$tr('ui.label.change')"/>
        </q-tabs>

        <q-separator/>

        <!--Tab panels-->
        <q-tab-panels v-model="modal.tab">
          <!--Tab pane Filter-->
          <q-tab-panel name="filter" class="q-pa-sm">
            <!--== Filters ==-->
            <!--By Module-->
            <q-select outlined dense v-model="modal.filter.module" :options="optionsModule"
                      :label="$tr('ui.label.module')" popup-content-class="text-capitalize"
                      class="full-width text-capitalize" emit-value map-options/>

            <!--By entity-->
            <q-select outlined dense v-model="modal.filter.entity" :options="optionsEntity"
                      :label="$tr('ui.label.entity')" popup-content-class="text-capitalize"
                      class="full-width q-mt-sm text-capitalize" emit-value map-options/>

            <q-separator class="q-my-md"/>

            <!--== List Permissions ==-->
            <q-card-section class="content-permissions q-px-xs q-pt-none">
              <!--List Entities-->
              <div v-for="(entity,entityName) in modal.listPermissions[modal.filter.module]" :key="entityName">
                <q-expansion-item popup v-if="showEntity(entityName)" style="border-bottom: 1px solid whitesmoke">
                  <!--Header slot-->
                  <template v-slot:header>
                    <q-item-section avatar>
                      <q-icon color="primary" size="xs" name="fas fa-bookmark"/>
                    </q-item-section>
                    <q-item-section> {{entityName}}</q-item-section>
                  </template>

                  <!--List permissions-->
                  <q-list no-border link separator>
                    <q-item v-for="(permission,permissionName) in entity"
                            :key="`${entityName}.${permissionName}`"
                            :label="permissionName" class="q-py-sm">
                      <!--Title-->
                      <q-item-section>{{permissionName}}</q-item-section>
                      <!--Actions-->
                      <q-item-section side>
                        <q-btn-toggle
                          rounded unelevated
                          v-model="entity[permissionName]"
                          toggle-color="positive"
                          color="grey-2" size="8px"
                          text-color="grey-8"
                          :key="`${entityName}.${permissionName}`"
                          :options="options.status"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </div>
            </q-card-section>
          </q-tab-panel>

          <!--Tab pane change permissions-->
          <q-tab-panel name="change" class="q-pa-sm">
            <!--Type change-->
            <q-select outlined dense v-model="modal.change.type" :options="options.typeChange"
                      :label="$tr('ui.form.type')" popup-content-class="text-capitalize"
                      class="full-width text-capitalize" emit-value map-options/>
            <!--Apply to-->
            <q-select outlined dense v-model="modal.change.applyTo" :options="options.typeApply"
                      :label="$tr('ui.label.module')" popup-content-class="text-capitalize"
                      class="full-width q-mt-sm text-capitalize" emit-value map-options/>

            <!--btn to apply changes-->
            <div class="text-center q-mt-sm">
              <q-btn :label="$tr('ui.label.change')" rounded unelevated icon="fas fa-share-square"
                     color="positive" @click="changePermissions()"/>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script>
  export default {
    props: {
      value: {
        type: Object, default: () => {
          return {}
        }
      },
      allowInherit: {default: false}
    },
    watch: {
      value: {
        handler: function (newValue, oldValue) {
          if (JSON.stringify(newValue) !== JSON.stringify(this.getPermissions()))
            this.formatPermissions()
        },
        deep: true
      },
      'modal.listPermissions': {
        handler: function () {
          if (Object.keys(this.modal.listPermissions).length) {
            this.$emit('input', this.getPermissions())//Emit permissions
          }
        },
        deep: true
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        loading: true,
        dataPermission: [],
        modal: {
          show: false,
          filter: {module: null, entity: null},
          listPermissions: [],
          tab: 'filter',
          change: {
            type: 'allow',
            applyTo: 'all'
          }
        }
      }
    },
    computed: {
      //Return options of module names
      optionsModule() {
        let optionsResponse = []
        let options = Object.keys(this.modal.listPermissions).sort()

        if (options && options.length) {
          //Create object to select with modules name
          options.forEach(item => {
            optionsResponse.push({label: item, value: item})
          })
          //set default filter
          this.modal.filter.module = options[0]
        }

        return optionsResponse//Response
      },
      //Return options of entity name
      optionsEntity() {
        let optionsResponse = [{label: this.$tr('ui.label.all'), value: 0}]
        let filterModule = this.modal.filter.module

        if (filterModule) {
          let options = Object.keys(this.modal.listPermissions[filterModule]).sort()

          if (options && options.length) {
            //Create object to select with modules name
            options.forEach(item => {
              optionsResponse.push({label: item, value: item})
            })
            //set default filter
            this.modal.filter.entity = 0
          }
        }

        return optionsResponse//Response
      },
      //Ootions to toggle buttons
      options() {
        let response = {
          typeChange: [
            {label: this.$tr('ui.label.allow'), value: 'allow'},
            {label: this.$tr('ui.label.inherit'), value: 'inherit'},
            {label: this.$tr('ui.label.deny'), value: 'deny'},
          ],
          typeApply: [
            {label: this.$tr('ui.label.all'), value: 'all'},
            ...this.optionsModule
          ],
          status: [
            {label: this.$tr('ui.label.allow'), value: true},
            {label: this.$tr('ui.label.inherit'), value: 0},
            {label: this.$tr('ui.label.deny'), value: false}
          ]
        }

        //Remove status inherit
        if (!this.allowInherit) response.status.splice(1, 1)
        if (!this.allowInherit) response.typeChange.splice(1, 1)

        return response//Response
      }
    },
    methods: {
      //Init
      async init() {
        await this.getData()//Get permissions
        this.formatPermissions()//Format to permissions
      },
      //Get data
      getData() {
        return new Promise((resolve, reject) => {
          this.loading = true
          let configName = 'apiRoutes.qsite.permissions'

          //Request
          this.$crud.index(configName, {refresh: true}).then(response => {
            this.loading = false
            this.dataPermission = response.data
            resolve(response.data)
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loading = false
            resolve([])
          })
        })
      },
      //Order permissions as list to render
      formatPermissions() {
        let permissions = this.$clone(this.dataPermission)
        this.modal.listPermissions = []
        let listToRender = {}//Default List to render

        if (Object.keys(permissions).length) {
          Object.keys(permissions).forEach(moduleName => {
            let module = this.$clone(permissions[moduleName])//Get module permission
            Object.keys(module).forEach(entityName => {
              let permissionNames = entityName.split('.')
              let entityPermissionName = permissionNames[1] || permissionNames[0]
              if (!listToRender[permissionNames[0]]) listToRender[permissionNames[0]] = {}//Create moduleName
              listToRender[permissionNames[0]][entityPermissionName] = {} //Create entityName of module
              let entity = module[entityName]//Get data entity
              Object.keys(entity).forEach(permissionName => {
                let permissionFullName = `${entityName}.${permissionName}`//Get fullname of permission
                //Get value of permission
                let valuePermission = this.$clone(this.value[permissionFullName])//Find in value prop
                if (typeof (valuePermission) != 'boolean') valuePermission = (this.allowInherit ? 0 : false)
                //Add to response
                listToRender[permissionNames[0]][entityPermissionName][permissionName] = this.$clone(valuePermission)
              })
            })
          })
          this.modal.listPermissions = this.$clone(listToRender) //Set in modal listPermissions
        }
      },
      //validate if show entity list
      showEntity(entity) {
        if (!this.modal.filter.entity) return true
        return (this.modal.filter.entity == entity) ? true : false
      },
      //Change permissions
      changePermissions() {
        let type = this.$clone(this.modal.change.type)//Get type of change
        let applyTo = this.$clone(this.modal.change.applyTo)//Get option to apply
        let permissions = this.$clone(this.modal.listPermissions)//Clone current permissions
        let permissionsToChange = {}//To response

        //Define value to change permissions
        let valuePermission = (type == 'allow') ? true : ((type == 'deny') ? false : 0)

        //Filter only by module or all modules to change
        if (applyTo == 'all') permissionsToChange = permissions
        else permissionsToChange[applyTo] = permissions[applyTo]

        //Apply change to all permissions
        for (let moduleName in permissionsToChange) {
          let moduleValues = permissions[moduleName]
          for (let entityName in moduleValues) {
            let entityValues = permissions[moduleName][entityName]
            for (let permissionName in entityValues) {
              permissions[moduleName][entityName][permissionName] = valuePermission
            }
          }
        }

        this.modal.listPermissions = this.$clone(permissions)//Set new permissions
        this.$alert.info(this.$tr('ui.label.success'))//Message success
      },
      //Return permission with format to backend
      getPermissions() {
        let permissions = this.$clone(this.modal.listPermissions)
        let responsePermissions = {}

        //Format permissions with format to backend
        for (let moduleName in permissions) {
          for (let entityName in permissions[moduleName]) {
            for (let permissionName in permissions[moduleName][entityName]) {
              //Get fullName of permission
              let fullName = (moduleName.toLowerCase() == 'dashboard') ?
                (`${moduleName}.${permissionName}`).toLowerCase() :
                (`${moduleName}.${entityName}.${permissionName}`).toLowerCase()

              let valuePermission = permissions[moduleName][entityName][permissionName]

              //If allow inherit, only set item with different value 0(inherit)
              if (this.allowInherit && (valuePermission !== 0))
                responsePermissions[fullName] = valuePermission

              //If not allow inherit, only set item with value true(allow)
              if (!this.allowInherit && valuePermission)
                responsePermissions[fullName] = valuePermission
            }
          }
        }

        return responsePermissions//Response
      }
    }
  }
</script>
<style lang="stylus">
  #barTitle
    border 1px solid $grey-4

  #modalFormPermissions
    .q-card
      max-width max-content !important
      min-width 345px

      .content-permissions
        max-height 60vh !important
        overflow-y scroll

        .q-expansion-item--expanded
          .q-expansion-item__container
            border 2px solid $primary

        .q-btn-group
          border 2px solid $positive

          .q-btn
            padding 4px 10px

            .q-btn__content
              font-size 12px

</style>
