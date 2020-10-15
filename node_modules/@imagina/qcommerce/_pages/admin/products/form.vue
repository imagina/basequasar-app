<template>
  <div id="productFormPage" ref="productFormPage">
    <q-no-ssr>
      <!--Content-->
      <div class="productForm relative-position q-mb-lg backend-page">
        <!--Data-->
        <q-form autocorrect="off" autocomplete="off" ref="formContent" class="box"
                @submit="(!itemId && !field) ? createItem() : updateItem()"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))">
          <div class="row q-col-gutter-x-md" v-if="success">
            <!--Language-->
            <div class="col-12">
              <locales v-model="locale" ref="localeComponent" :form="$refs.formContent"/>
            </div>
            <!--Form left-->
            <div class="col-12" v-if="locale.success">
              <q-list class="q-pa-none">
                <q-expansion-item default-opened bordered class="q-my-md q-mx-sm rounded-borders"
                                  header-class="text-primary" icon="home" expand-icon="fas fa-plus"
                                  expanded-icon="fas fa-minus" :label="$tr('qcommerce.layout.form.content')">
                  <q-separator/>
                  <div class="row">
                    <div class="col-xs-12 col-md-8">
                      <q-card class="q-mr-sm no-shadow">
                        <q-card-section class="q-pa-sm">
                          <div class="q-pa-sm">
                            <!--name-->
                            <q-input v-model="locale.formTemplate.name" @input="setSlug()" outlined dense
                                     data-testid="name"
                                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                                     :label="`${$tr('ui.form.name')} (${locale.language})*`"/>
                            <!--Slug-->
                            <q-input v-model="locale.formTemplate.slug" outlined dense
                                     data-testid="slug"
                                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                                     :label="`${$tr('ui.form.slug')} (${locale.language})*`"/>
                            <!--Sumario-->
                            <q-input v-model="locale.formTemplate.summary" type="textarea" outlined dense
                                     data-testid="summary"
                                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                                     :label="`${$tr('ui.form.summary')} (${locale.language})*`" rows="3"/>
                            <!--Description-->
                            <div class="input-title">{{`${$tr('ui.form.description')} (${locale.language})*`}}</div>
                            <q-field v-model="locale.formTemplate.description" borderless
                                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
                              <ck-editor v-model="locale.formTemplate.description" data-testid="description"/>
                              <q-editor v-if="false" v-model="locale.formTemplate.description" class="full-width"
                                        :toolbar="editorText.toolbar" content-class="text-grey-9"
                                        toolbar-text-color="grey-9"/>
                            </q-field>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                    <div class="col-xs-12 col-md-4">
                      <q-card class="q-ml-sm no-shadow">
                        <q-card-section class="q-pa-sm">
                          <div class="q-pa-sm">
                            <q-select
                              :clearable="false"
                              emit-value map-options outlined dense
                              :label="$tr('ui.form.status')"
                              :options="options.status"
                              v-model="locale.formTemplate.status"
                              data-testid="status"
                            />
                            <!--Categories-->
                            <div class="relative-position text-right">
                              <!--Crud category-->
                              <crud :crud-data="import('@imagina/qcommerce/_crud/productCategories')"
                                    type="button-create" @created="getCategories" class="q-mb-sm"/>
                              <!--Main category-->
                              <dynamic-field v-model="locale.formTemplate.categoryId" :field="dynamicFields.category"/>
                              <!--Categories-->
                              <dynamic-field v-model="locale.formTemplate.categories"
                                             :field="dynamicFields.categories"/>
                            </div>
                            <!--Meta Title-->
                            <q-input data-testid="metaTitle" v-model="locale.formTemplate.metaTitle" outlined dense
                                     :label="`${$tr('ui.form.metaTitle')} (${locale.language})`"/>
                            <!--Meta Description-->
                            <q-input data-testid="metaDescription" v-model="locale.formTemplate.metaDescription" type="textarea"
                                     outlined dense
                                     :label="`${$tr('ui.form.metaDescription')} (${locale.language})`" rows="3"/>
                          </div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>

                </q-expansion-item>
                <q-expansion-item bordered class="q-my-md q-mx-sm rounded-borders" header-class="text-primary"
                                  icon="info" expand-icon="fas fa-plus" expanded-icon="fas fa-minus"
                                  :label="$tr('qcommerce.layout.form.data')">
                  <q-separator/>
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div class="q-form q-pa-sm row q-col-gutter-sm">
                        <!--Left-->
                        <div class="col-12 col-md-6">
                          <!--reference-->
                          <q-input data-testid="reference" v-model="locale.formTemplate.reference" outlined dense
                                   :label="$tr('ui.form.reference')"/>
                          <!--SKU-->
                          <q-input data-testid="sku" outlined dense v-model="locale.formTemplate.sku" :label="$tr('ui.form.sku')"/>
                          <!--Price-->
                          <q-input data-testid="price" v-model="locale.formTemplate.price" outlined dense
                                   :label="$tr('ui.form.price')" type="number"/>
                          <!--Quantity-->
                          <q-input data-testid="quantity" outlined dense v-model="locale.formTemplate.quantity"
                                   :label="$tr('ui.form.quantity')" type="number"/>
                          <!--minimum-->
                          <q-input data-testid="minimumOrder" :label="$tr('qcommerce.layout.form.minimumOrder')" outlined dense
                                   type="number" v-model="locale.formTemplate.minimum"/>
                          <!--Status-->
                          <div class="input-title">{{$tr('ui.form.stock')}}</div>
                          <tree-select
                            data-testid="stockStatus"
                            :clearable="false"
                            :append-to-body="true"
                            :options="options.stockStatus"
                            value-consists-of="BRANCH_PRIORITY"
                            v-model="locale.formTemplate.stockStatus"
                            class="q-mb-md"
                          />
                          <!--Substrac from Stock-->
                          <q-toggle
                            data-testid="subtract"
                            v-model="locale.formTemplate.subtract"
                            :true-value="true"
                            :false-value="false"
                            :label="$tr('qcommerce.layout.form.subtractFromStock')"
                            left-label
                            color="primary"
                          />
                        </div>
                        <!--Right-->
                        <div class="col-12 col-md-6">
                          <!--availability date-->
                          <q-input data-testid="dateAvailable" dense mask="date" v-model="locale.formTemplate.dateAvailable" color="primary"
                                   unmasked-value :label="$tr('qcommerce.layout.form.availableDate')"
                                   outlined placeholder="YYYY/MM/DD">
                            <template v-slot:append>
                              <q-icon name="fas fa-calendar-day"/>
                              <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                                <q-date v-model="locale.formTemplate.dateAvailable"
                                        @input="() => $refs.qDateProxy.hide()"/>
                              </q-popup-proxy>
                            </template>
                          </q-input>
                          <!--Points-->
                          <q-input data-testid="points" v-model="locale.formTemplate.points" outlined dense :label="$trp('ui.form.point')"/>
                          <!--Dimensions-->
                          <div class="row q-col-gutter-xs">
                            <!--length-->
                            <div class="col-xs-12 col-sm-4">
                              <q-input data-testid="length" v-model="locale.formTemplate.length" :label="$tr('ui.form.length')"
                                       outlined dense type="number"/>
                            </div>
                            <!--width-->
                            <div class="col-xs-12 col-sm-4">
                              <q-input data-testid="width" v-model="locale.formTemplate.width" :label="$tr('ui.form.width')"
                                       outlined dense type="number"/>
                            </div>
                            <!--height-->
                            <div class="col-xs-12 col-sm-4">
                              <q-input data-testid="height" v-model="locale.formTemplate.height" :label="$tr('ui.form.height')"
                                       outlined dense type="number"/>
                            </div>
                          </div>
                          <!--weight-->
                          <q-input data-testid="weight" v-model="locale.formTemplate.weight" :label="$tr('ui.form.weight')"
                                   outlined dense type="number"/>
                          <!--Order Weight-->
                          <q-input data-testid="orderWeight" :label="$tr('qcommerce.layout.form.orderWeight')" outlined dense
                                   v-model="locale.formTemplate.orderWeight"/>
                          <div class="row">
                            <div class="col-12 col-sm-6">
                              <!--Requires shipping-->
                              <q-toggle
                                data-testid="shipping"
                                v-model="locale.formTemplate.shipping"
                                :true-value="true"
                                :false-value="false"
                                :label="$tr('qcommerce.layout.form.requriedShipping')"
                                left-label
                                color="primary"
                              />
                              <!--<q-checkbox :label="$tr('qcommerce.layout.form.requriedShipping')"
                                          v-model="locale.formTemplate.shipping"/>-->
                            </div>
                            <div class="col-12 col-sm-6">
                              <!--Free shipping-->
                              <q-toggle
                                data-testid="freeShipping"
                                v-model="locale.formTemplate.freeshipping"
                                :true-value="true"
                                :false-value="false"
                                :label="$tr('qcommerce.layout.form.freeShipping')"
                                left-label
                                color="primary"
                              />
                              <!--<q-checkbox :label="$tr('qcommerce.layout.form.freeShipping')"
                                          v-model="locale.formTemplate.freeshipping"/>-->
                            </div>
                          </div>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item bordered class="q-my-md q-mx-sm rounded-borders" header-class="text-primary"
                                  icon="link" expand-icon="fas fa-plus" expanded-icon="fas fa-minus"
                                  :label="$tr('qcommerce.layout.form.link')">
                  <q-separator/>
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div class="q-pa-sm">
                        <!--Record Master-->
                        <div v-if="canManageRecordMaster" class="q-mb-md">
                          <div class="input-title">
                            {{`${$tr('ui.form.masterRecord')}`}}
                          </div>
                          <tree-select
                            data-testid="masterRecord"
                            :clearable="false"
                            :append-to-body="true"
                            v-model="locale.formTemplate.options.masterRecord"
                            :options="[
                                    {label: this.$tr('ui.label.yes'), id: 1},
                                    {label: this.$tr('ui.label.no'), id: 0},
                                  ]"
                            placeholder=""
                          />
                        </div>
                        <!--Crud manufacturer-->
                        <crud :crud-data="import('@imagina/qcommerce/_crud/taxClasses')"
                              type="select" :crud-props="{label:`${$tr('qcommerce.layout.form.taxClass')}`, 'data-testid': 'taxClassId'}"
                              v-model="locale.formTemplate.taxClassId"
                              :config="{options: {label: 'name', value: 'id'}}"
                        />
                        <!--Crud manufacturer-->
                        <crud :crud-data="import('@imagina/qcommerce/_crud/manufacturers')"
                              type="select" :crud-props="{label:`${$tr('qcommerce.layout.form.manufacturer')}`,'data-testid': 'manufacturerId'}"
                              v-model="locale.formTemplate.manufacturerId"
                              :config="{options: {label: 'name', value: 'id'}}"
                        />
                        <!--Parent-->
                        <div class="input-title">{{`${$tr('ui.form.parent')}`}}</div>
                        <tree-select
                          data-testid="parentId"
                          v-model="locale.formTemplate.parentId"
                          :async="true"
                          :append-to-body="true"
                          class="q-mb-md"
                          :load-options="searchProducts"
                          :default-options="optionsTemplate.products"
                          placeholder=""
                          label="name"
                        />
                        <!-- &lt;!&ndash;Crud category&ndash;&gt;
                         <crud :crud-data="import('@imagina/qcommerce/_crud/productCategories')"
                               type="select" @created="getCategories" :crud-props="{label:`${$tr('ui.form.category')}*`}" v-model="locale.formTemplate.categoryId"/>
                         &lt;!&ndash;Categories&ndash;&gt;
                         <div class="input-title relative-position q-mb-sm">
                           {{`${$trp('ui.form.category')}`}}
                           &lt;!&ndash;Crud category&ndash;&gt;
                           <crud :crud-data="import('@imagina/qcommerce/_crud/productCategories')"
                                 type="button-create" class="absolute-right" @created="getCategories"/>
                         </div>
                         <recursive-list v-model="locale.formTemplate.categories"
                                         :items="optionsTemplate.categories"/>-->
                        <!--Related Products-->
                        <div class="input-title">{{$tr('qcommerce.layout.form.relatedProducts')}}</div>
                        <tree-select
                          data-testid="relatedProducts"
                          v-model="locale.formTemplate.relatedProducts"
                          :async="true"
                          :multiple="true"
                          :append-to-body="true"
                          :load-options="searchProducts"
                          :default-options="optionsTemplate.relatedProducts"
                          placeholder=""
                          label="name"
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item bordered class="q-my-md q-mx-sm rounded-borders" header-class="text-primary"
                                  icon="image" expand-icon="fas fa-plus" expanded-icon="fas fa-minus"
                                  :label="$trp('ui.label.image')">
                  <q-separator/>
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div class="q-pa-sm">
                        <!--Video-->
                        <q-input data-testid="optionsVideo" v-model="locale.formTemplate.options.video" outlined dense
                                 :label="$tr('ui.form.video')"/>
                        <div class="input-title">{{$tr('ui.form.image')}}</div>
                        <upload-media
                          data-testid="mainImage"
                          v-model="locale.formTemplate.mediasSingle"
                          entity="Modules\Icommerce\Entities\Product"
                          :entity-id="productId ? productId : null"
                          zone='mainimage'
                        />
                        <div class="input-title">{{$tr('ui.form.gallery')}}</div>
                        <upload-media
                          data-testid="gallery"
                          multiple
                          v-model="locale.formTemplate.mediasMulti"
                          entity="Modules\Icommerce\Entities\Product"
                          :entity-id="productId ? productId : null"
                          zone='gallery'
                        />
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item bordered class="q-my-md q-mx-sm rounded-borders" header-class="text-primary"
                                  icon="settings" expand-icon="fas fa-plus" expanded-icon="fas fa-minus"
                                  :label="$trp('ui.label.option')">
                  <q-separator/>
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div class="q-pa-sm">
                        <crud-options :productId="productId" v-if="productId"/>
                        <div v-else class="text-center">
                          <div class="q-my-md">
                            <q-icon name="fas fa-exclamation-triangle" color="warning"></q-icon>
                            {{`${$tr('qcommerce.layout.message.warnAddOpt')}...`}}
                          </div>
                          <q-btn icon="fas fa-save" :label="options.btn.saveAndEdit"
                                 @click="buttonActions.value = 4, createItem()" color="positive"/>
                        </div>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
                <q-expansion-item bordered class="q-my-md q-mx-sm rounded-borders" header-class="text-primary"
                                  icon="fas fa-gift" expand-icon="fas fa-plus" expanded-icon="fas fa-minus"
                                  :label="$trp('qcommerce.layout.form.discount')">
                  <q-separator/>
                  <q-card>
                    <q-card-section class="q-pa-sm">
                      <div class="q-pa-sm" v-if="productId">
                        <crud
                          :crud-data="import('@imagina/qcommerce/_crud/productDiscounts')"
                          :custom-data="{read: {requestParams: {include: 'department', filter: {productId: productId} } }, formRight:{productId: {value: productId} } }"
                        />
                      </div>
                      <div v-else class="text-center q-pa-sm">
                        <div class="q-my-md">
                          <q-icon name="fas fa-exclamation-triangle" color="warning"></q-icon>
                          {{`${$tr('qcommerce.layout.message.warnAddDiscount')}...`}}
                        </div>
                        <q-btn icon="fas fa-save" :label="options.btn.saveAndEdit"
                               @click="buttonActions.value = 4, createItem()" color="positive"/>
                      </div>
                    </q-card-section>
                  </q-card>
                </q-expansion-item>
              </q-list>
            </div>
          </div>
        </q-form>
        <!--Buttons Actions-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <!--Update button-->
          <q-btn
            v-if="productId"
            color="positive" :loading="loading"
            icon="fas fa-edit" :label="$tr('ui.label.update')" @click="updateItem()"
          />
          <!--Save button-->
          <q-btn-dropdown :label="buttonActions.label" split v-else :loading="loading"
                          content-style="min-width: 250px !important"
                          color="positive" icon="fas fa-save" @click="createItem()" rounded align="right">
            <q-list link>
              <q-item @click.native="buttonActions = {label : options.btn.saveAndReturn, value : 1}"
                      v-close-popup>
                {{options.btn.saveAndReturn}}
              </q-item>
              <q-item @click.native="buttonActions = {label : options.btn.saveAndEdit, value : 2}"
                      v-close-popup>
                {{options.btn.saveAndEdit}}
              </q-item>
              <q-item @click.native="buttonActions = {label : options.btn.saveAndCreate, value : 3}"
                      v-close-popup>
                {{options.btn.saveAndCreate}}
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </q-page-sticky>

        <!--Loading-->
        <inner-loading :visible="loading"/>
      </div>
    </q-no-ssr>
  </div>
</template>

<script>
  import recursiveList from '@imagina/qsite/_components/master/recursiveListSelect'
  import uploadMedia from '@imagina/qmedia/_components/form'
  import crudOptions from '@imagina/qcommerce/_components/admin/products/crudOptions'
  import ckEditor from '@imagina/qsite/_components/master/ckEditor'
  //Plugins
  import {scroll} from 'quasar'

  const {getScrollTarget, setScrollPosition} = scroll

  export default {
    components: {
      crudOptions,
      recursiveList,
      uploadMedia,
      ckEditor
    },
    watch: {
      $route(to, from) {
        this.initForm()
      },
      'locale.form'(value) {
        //console.warn(value)
      },
      'locale.formTemplate.categoryId'(newValue) {
        setTimeout(() => {
          if (this.locale.formTemplate && this.locale.formTemplate.categories && newValue) {
            let categories = this.$clone(this.locale.formTemplate.categories)//Get catgeories
            if ((categories.indexOf(newValue.toString()) == -1) && (categories.indexOf(newValue) == -1)) {
              categories.push(this.$clone(newValue))
            }
            this.locale.formTemplate.categories = this.$clone(categories)
          }
        }, 500)
      },
      'locale.formTemplate.slug'(newValue) {
        if (newValue) {
          let replaced = this.$clone(this.$helper.getSlug(newValue))
          if (newValue != replaced) this.locale.formTemplate.slug = this.$clone(replaced)
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.initForm()
        this.$root.$on('page.data.refresh', () => this.initForm())//Listen refresh event
      })
    },
    data() {
      return {
        locale: {},
        vTab: 'tab-data',
        loading: false,
        loadingCategory: false,
        success: false,
        productId: false,
        editorText: {
          toolbar: [
            ['bold', 'italic', 'strike', 'underline', 'removeFormat'],
            ['link'],
            [
              {
                label: 'Font Size',
                icon: 'format_size',
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: ['size-1', 'size-2', 'size-3', 'size-4', 'size-5', 'size-6', 'size-7']
              }
            ],
            ['quote', 'unordered', 'ordered'],
            ['fullscreen']
          ]
        },
        optionsTemplate: {
          categories: [],
          products: [],
          relatedProducts: []
        },
        buttonActions: {label: '', value: 1},
        modalShow: {
          category: false
        }
      }
    },
    computed: {
      dataLocale() {
        return {
          fields: {
            parentId: '',
            status: 1,
            categoryId: 0,
            categories: [],
            addedById: this.$store.state.quserAuth.userId,
            sku: 0,
            quantity: 0,
            stockStatus: 1,
            price: 0,
            dateAvailable: this.$moment().format('YYYY-MM-DD'),
            weight: 0,
            length: 0,
            width: 0,
            height: 0,
            minimum: 1,
            reference: '',
            shipping: false,
            subtract: false,
            freeshipping: false,
            orderWeight: 0,
            rating: 3,
            points: 0,
            relatedProducts: [],
            productOptions: [],
            discounts: [],
            mediasSingle: {},
            mediasMulti: {},
            options: {
              masterRecord: 0,
              video: null
            },
            taxClassId: null,
            manufacturerId: null,
            metaTitle: '',
            metaDescription: '',
          },
          fieldsTranslatable: {
            name: '',
            slug: '',
            summary: '',
            description: '',
            metaTitle: '',
            metaDescription: '',
          },
        }
      },
      //Check if update options
      updateOptions() {
        if (this.$route.params.editOptions) {
          setTimeout(() => {
            this.vTab = 'tab-options'
            let target = getScrollTarget(this.$refs.productFormPage)
            let offset = this.$refs.productFormPage.scrollHeight
            setScrollPosition(target, offset, 1000)
          }, 500)
        }
      },
      //Options translatables
      options() {
        return {
          status: [
            {label: this.$tr('ui.label.enabled'), value: 1},
            {label: this.$tr('ui.label.disabled'), value: 0}
          ],
          stockStatus: [
            {label: this.$tr('ui.label.available'), id: 1},
            {label: this.$tr('ui.label.soldOut'), id: 0}
          ],
          btn: {
            saveAndReturn: this.$tr('ui.message.saveAndReturn'),
            saveAndEdit: this.$tr('ui.message.saveAndEdit'),
            saveAndCreate: this.$tr('ui.message.saveAndCreate'),
          }
        }
      },
      //Has manage master record
      canManageRecordMaster() {
        let response = true

        if (this.productId && !this.$auth.hasAccess('isite.master.records.edit')) {
          response = false
          //Validate if record is master
          let record = this.locale.formTemplate
          if (record && record.options && parseInt(record.options.masterRecord)) {
            this.$router.push({name: 'app.home'})
          }
        }
        if (!this.productId && !this.$auth.hasAccess('isite.master.records.create')) {
          response = false
        }

        return response
      },
      //Dynamic fields
      dynamicFields() {
        return {
          category: {
            value: null,
            type: 'treeSelect',
            testId: 'categoryId',
            props: {
              label: this.$tr('ui.form.category') + '*',
              rules: [val => !!val || this.$tr('ui.message.fieldRequired')],
              clearable: false
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qcommerce.categories',
              requestParams: {include: 'parent'}
            }
          },
          categories: {
            value: [],
            type: 'treeSelect',
            testId: 'categories',
            props: {
              label: this.$trp('ui.form.category') + '*',
              rules: [val => !!val || $tr('ui.message.fieldRequired')],
              clearable: false,
              multiple: true
            },
            loadOptions: {
              apiRoute: 'apiRoutes.qcommerce.categories',
              requestParams: {include: 'parent'}
            }
          },
        }
      }
    },
    methods: {
      //Init Form
      async initForm() {
        this.loading = true
        this.success = false//Disable status of page
        this.vTab = 'tab-data'
        this.buttonActions = {label: this.options.btn.saveAndReturn, value: 1}
        this.locale = this.$clone(this.dataLocale)//Add fields
        this.productId = this.$route.params.id//Update param from route
        if (this.locale.success) this.$refs.localeComponent.vReset()//Reset locale
        await this.getData()//Get Data Item
        await this.getCategories()//Get categories
        this.success = true//Activate status of page
        this.updateOptions
        this.loading = false
      },
      //Get product categories
      getCategories() {
        return new Promise((resolve, reject) => {
          this.loadingCategory = true
          let configName = 'apiRoutes.qcommerce.categories'
          let params = {//Params to request
            refresh: true,
            params: {include: 'parent'},
          }

          //Request
          this.$crud.index(configName, params).then(response => {
            this.optionsTemplate.categories = this.$array.tree(response.data)
            //this.locale.fields.categoryId = response.data.length ? response.data[0].id : null
            this.loadingCategory = false
            resolve(true)
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
            this.loadingCategory = false
            reject(true)
          })
        })
      },
      //Get product if is edit
      getData() {
        return new Promise((resolve, reject) => {
          const productId = this.$clone(this.productId)
          if (productId) {
            let configName = 'apiRoutes.qcommerce.products'
            //Params
            let params = {
              refresh: true,
              params: {
                include: 'relatedProducts,categories,category,parent,discounts,manufacturer',
                filter: {allTranslations: true}
              }
            }
            //Request
            this.$crud.show(configName, productId, params).then(response => {
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
      //order data item to locale component
      orderDataItemToLocale(data) {
        let orderData = this.$clone(data)
        //Set default Parent options
        if (data.parent) this.optionsTemplate.products = this.$array.tree([data.parent], {label: 'name', id: 'id'})
        //Order categories
        orderData.categories.forEach((item, key) => {
          orderData.categories[key] = item.id
        })
        //Order related products
        orderData.relatedProducts.forEach((item, key) => {
          orderData.relatedProducts[key] = item.id
        })
        //Set default related products options
        if (data.relatedProducts && data.relatedProducts.length) {
          this.optionsTemplate.relatedProducts = this.$array.tree(data.relatedProducts, {label: 'name', id: 'id'})
        }

        this.locale.form = this.$clone(orderData)
        setTimeout(() => {
          /*this.locale.formTemplate.categoryId = orderData.categoryId
          this.locale.formTemplate.taxClassId = orderData.taxClassId
          this.locale.formTemplate.parentId = orderData.parentId
          this.locale.formTemplate.manufacturerId = orderData.manufacturerId*/
        }, 3000)
      },
      //Create Product
      async createItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.products'
          this.$crud.create(configName, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}`})
            this.actionAfterCreated(response.data.id)
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoCreatde'), pos: 'bottom'})
          })
        }
      },
      //Update Product
      async updateItem() {
        if (await this.$refs.localeComponent.validateForm()) {
          this.loading = true
          let configName = 'apiRoutes.qcommerce.products'
          this.$crud.update(configName, this.productId, this.getDataForm()).then(response => {
            this.$alert.success({message: `${this.$tr('ui.message.recordUpdated')}`})
            this.initForm()
          }).catch(error => {
            this.loading = false
            this.$alert.error({message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom'})
          })
        }
      },
      //Get just values not null from form
      getDataForm() {
        let response = this.locale.form
        for (var item in response) {
          let valueItem = response[item]
          if (valueItem == null || valueItem == undefined) {
            delete response[item]
          }
        }
        return response
      },
      //Action after created
      actionAfterCreated(id) {
        setTimeout(() => {
          let action = this.buttonActions.value
          switch (action) {
            case 1://redirect to index products
              this.$router.push({name: 'qcommerce.admin.products.index'})
              break
            case 2://Redirect to update this product
              this.$router.push({name: 'qcommerce.admin.products.edit', params: {id: id}})
              this.loading = false
              break
            case 3://Reset and init form
              this.$refs.localeComponent.vReset()
              this.loading = false
              break
            case 4://Redirect to update this product and options
              this.$router.push({
                name: 'qcommerce.admin.products.edit',
                params: {id: id, editOptions: 1},
              })
              this.loading = false
              break
          }
        }, 2000)
      },
      //Search products
      searchProducts({action, searchQuery, callback}) {
        if (action === 'ASYNC_SEARCH') {
          let configName = 'apiRoutes.qcommerce.products'
          let params = {//Params to request
            params: {filter: {search: searchQuery}},
          }
          //Request
          this.$crud.index(configName, params).then(response => {
            callback(null, this.$array.tree(response.data, {label: 'name', id: 'id'}))
          }).catch(error => {
            this.$alert.error({message: this.$tr('ui.message.errorRequest'), pos: 'bottom'})
          })
        }
      },
      //Complete slug Only when is creation
      setSlug() {
        if (!this.productId) {
          let title = this.$clone(this.locale.formTemplate.name)
          this.locale.formTemplate.slug = this.$clone(this.$helper.getSlug(title))
        }
      }
    }
  }
</script>
<style lang="stylus">
  .productForm
    #mediaForm
      .col-12.col-md-6.relative-position
        height: 200px
        text-align center
        padding 10px
        margin 0 5px
        border: 1px solid rgba(0, 0, 0, 0.12)
        border-radius 5px
        @media (min-width: 1024px)
          width: 16.666666666666666667% !important

        .img-fluid
          width auto
          height 100%

      .q-scrollarea
        height 200px !important

        .column
          height 200px
          padding 10px
          margin 0 5px
          border: 1px solid rgba(0, 0, 0, 0.12)
          border-radius 5px

          .image-multiple
            background-repeat no-repeat
            background-size 100% auto
            background-position center center
            height 100%
            overflow hidden

    .label
      text-transform capitalize

    .q-expansion-item
      border 1px solid rgba(0, 0, 0, 0.12);

    .q-item__section--side > .q-icon
      font-size 14px
</style>
