<template>
  <div class="row gutter-x-sm relative-position q-layout-page layout-padding  q-mb-lg backend-page"
       v-if="success">
    <div class="col-12 box">
      <div class="row">
        <div class="col-12 q-mb-md">
          <locales v-model="locale" ref="localeComponent" :form="$refs.formContent" />
        </div>
        <q-form @submit="itemId ? updateItem() : createItem()"
                ref="formContent" class="row q-col-gutter-x-sm full-width" autocomplete="off"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <!--Form left-->
          <div class="col-7" v-if="locale.success">
            <q-input data-testid="title" outlined dense v-model="locale.formTemplate.title"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('ui.form.title')} (${locale.language})*`"/>

            <dynamic-field v-model="locale.formTemplate.pageId" :field="dynamicFields.pages"
                           v-if="locale.formTemplate.linkType == 'page'"/>

            <q-input data-testid="url" outlined dense v-model="locale.formTemplate.url" v-if="locale.formTemplate.linkType == 'external'"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qmenu.layout.form.url')} (${locale.language})*`"/>

            <q-input data-testid="uri" outlined dense v-model="locale.formTemplate.uri" v-if="locale.formTemplate.linkType == 'internal'"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qmenu.layout.form.uri')} (${locale.language})*`"/>

            <q-select data-testid="status" outlined dense bg-color="white" v-model="locale.formTemplate.status"
                      :options="status" :label="`${$tr('ui.form.status')} (${locale.language})`"
                      style="width: 100%;" emit-value map-options/>

            <q-input data-testid="icon" outlined dense v-model="locale.formTemplate.icon" :label="`${$tr('ui.form.icon')}`"/>

            <q-input data-testid="class" outlined dense v-model="locale.formTemplate.class" :label="`${$tr('qmenu.layout.form.class')}`"/>
          </div>
          <!--Form Right-->
          <div class="col-5" v-if="locale.success">
            <q-select data-testid="linkType" outlined dense bg-color="white" v-model="locale.formTemplate.linkType"
                      :options="linkTypes" :label="$tr('qmenu.layout.form.typeLink')"
                      style="width: 100%;" emit-value map-options/>

            <q-select data-testid="target" outlined dense bg-color="white" v-model="locale.formTemplate.target"
                      :options="targets" :label="$tr('qmenu.layout.form.target')"
                      style="width: 100%;" emit-value map-options/>

            <q-select data-testid="parentId" outlined dense bg-color="white" v-model="locale.formTemplate.parentId"
                      :options="menuItems" :label="$tr('ui.form.parent')"
                      style="width: 100%;" emit-value map-options/>
          </div>
          <!--Button Actions-->
          <div class="col-12 text-right">
            <q-btn v-if="itemId" color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.update')" type="submit" rounded/>
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit" rounded/>
          </div>
        </q-form>
      </div>
    </div>

    <inner-loading :visible="loading"/>
  </div>
</template>

<script>
  import {required} from 'vuelidate/lib/validators'

  export default {
    components: {},
    watch: {
      $route(to, from) {
        this.initForm()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
      })
    },
    validations() {
      return this.getObjectValidation()
    },
    data() {
      return {
        locale: {},
        loading: false,
        success: false,
        users: [],
        itemId: false,
        menuItems: [],
        pages: [],
        targets: [
          {value: '_self', label: this.$tr('qmenu.layout.form.sameTab')},
          {value: '_blank', label: this.$tr('qmenu.layout.form.newTab')},
        ],
        status: [
          {label: this.$tr('ui.label.enabled'), value: '1'},
          {label: this.$tr('ui.label.disabled'), value: '0'},
        ],
        linkTypes: [
          {label: this.$tr('qmenu.layout.form.page'), value: 'page'},
          {label: this.$tr('qmenu.layout.form.internal'), value: 'internal'},
          {label: this.$tr('qmenu.layout.form.external'), value: 'external'}
          //{label: this.$tr('qmenu.layout.form.frontend'), value: 'frontend'},
        ]
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            menuId: this.$route.params.menuId,
            pageId: '',
            parentId: null,
            position: 0,
            target: '_self',
            modulename: '',
            isroot: '',
            icon: '',
            linkType: 'internal',
            locale: '',
            class: '',
          },
          fieldsTranslatable: {
            title: '',
            url: '',
            uri: '',
            status: '1',
          }
        }
      },
      dynamicFields() {
        return {
          pages: {
            testId: 'pageId',
            value: null,
            type: 'select',
            props: {
              label: this.$tr('ui.form.page'),
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')]
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qpage.pages'
            }
          }
        }
      }
    },
    methods: {
      async initForm() {
        this.loading = true
        this.success = false
        this.locale = this.$clone(this.dataLocale)
        this.itemId = this.$route.params.id
        if (this.locale.success) this.$refs.localeComponent.vReset()
        await this.getData()
        this.getMenuItems()
        this.success = true
        this.loading = false
      },
      getData() {
        return new Promise((resolve, reject) => {
          const itemId = this.$clone(this.itemId)
          if (itemId) {
            let configName = 'apiRoutes.qmenu.menuItems'
            //Params
            let params = {
              refresh: true,
              params: {
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, itemId, params).then(response => {
              this.orderDataItemToLocale(response.data)
              resolve(true)//Resolve
            }).catch(error => {
              this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
              this.loading = false
              reject(false)//Resolve
            })
          } else {
            resolve(true)//Resolve
          }
        })
      },
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        this.locale.form = this.$clone(orderData)
      },
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qmenu.menuItems'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}`})
            this.$router.push({name: 'qmenu.admin.menus.show', params: {id: this.$route.params.menuId}})
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoCreated'), pos: 'bottom'})
          })
        }
      },
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qmenu.menuItems'
          this.$crud.update(configName, this.itemId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            //this.initForm()
            this.loading = false
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      getDataForm() {
        let response = this.locale.form
        for (var item in response) {
          let valueItem = response[item]
          if (valueItem == null || valueItem == undefined)
            delete response[item]
        }
        response.selectable = JSON.stringify(response.selectable)
        return response
      },
      getMenuItems() {
        return new Promise((resolve, reject) => {
          let configName = 'apiRoutes.qmenu.menuItems'
          let params = {//Params to request
            refresh: true,
            params: {
              filter: {
                allTranslations: true,
                menu: this.$route.params.menuId
              }
            },
          }
          //Request
          this.$crud.index(configName, params).then(response => {
            this.menuItems = this.$array.tree(response.data)
            resolve(true)
          }).catch(error => {
            this.$alert.error('Failed: ' + error, 'bottom')
            reject(true)
          })
        })
      },
      arrayUnique(arrayWithRepeats) {
        return arrayWithRepeats.filter((currentValue, currentIndex, newArray) => {
          return newArray.findIndex(
            valueOfArray => JSON.stringify(valueOfArray) === JSON.stringify(currentValue)
          ) === currentIndex
        });
      },
    }
  }
</script>
