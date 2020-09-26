<template>
  <div id="pageId" class="q-layout-page layout-padding">

    <div class="relative-position q-mb-lg backend-page">
      <div class="box">
        <q-form @submit="$route.params.id ? updateItem() : createItem()" ref="formContent"
                @validation-error="$alert.error($tr('ui.message.formInvalid'))"
                class="row q-col-gutter-x-md" autocomplete="off">
          <!-- Left Form -->
          <div class="col-md-8">
            <!--Code-->
            <q-input v-model="form.code" type="text" outlined dense :label="$tr('qcommerce.layout.form.code')"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]">
              <template v-slot:after>
                <q-btn @click="generateCoupon()" round size="sm" color="primary" icon="fas fa-qrcode">
                  <q-tooltip>Generate Code</q-tooltip>
                </q-btn>
              </template>
            </q-input>

            <div>
              <q-select outlined dense bg-color="white" v-model="form.type"
                        :label="`${$tr('qcommerce.layout.form.type')}*`" style="width: 100%;"
                        :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                        emit-value map-options :options="[
                            {label: 'Coupon for Order', value: '1'},
                            {label: 'Coupon for Product', value: '2'},
                            {label: 'Coupon for Category', value: '3'},
                          ]"/>

              <q-select outlined dense bg-color="white" v-model="form.productId" v-if="form.type == 2"
                        :label="$tr('qcommerce.layout.form.product')" style="width: 100%;"
                        emit-value map-options :options="products.data"/>

              <q-select outlined dense bg-color="white" v-model="form.categoryId" v-if="form.type == 3"
                        :label="$tr('qcommerce.layout.form.category')" style="width: 100%;"
                        emit-value map-options :options="categories.data"/>
            </div>

            <q-select outlined dense bg-color="white" v-model="form.typeDiscount"
                      :label="`${$tr('qcommerce.layout.form.typeDiscount')}*`" style="width: 100%;"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      emit-value map-options :options="[
                        {label: this.$tr('qcommerce.layout.options.fixedValue'), value: '0'},
                        {label: this.$tr('qcommerce.layout.options.percentage'), value: '1'},
                      ]"/>

            <q-input v-model="form.discount" type="number" outlined dense
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qcommerce.layout.form.discount')} *`"/>

            <q-input v-model="form.quantityTotal" type="number" outlined dense
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qcommerce.layout.form.quantityTotal')} *`"/>

            <q-input v-model="form.quantityTotalCustomer" type="number" outlined dense
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qcommerce.layout.form.quantityTotalCustomer')} *`"/>
          </div>

          <!-- Right Form -->
          <div class="col-md-4 ">
            <q-select outlined dense bg-color="white" v-model="form.status"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      :label="`${$tr('qcommerce.layout.form.status')}*`" style="width: 100%;"
                      emit-value map-options :options="[
                        {label: 'Active', value: '1'},
                        {label: 'Inactive', value: '2'},
                      ]"/>

            <q-input dense mask="date" bg-color="white" v-model="form.dateStart" color="primary"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qcommerce.layout.form.dateStart')}*`"
                     outlined placeholder="YYYY/MM/DD">
              <template v-slot:append>
                <q-icon name="fas fa-calendar-day"/>
                <q-popup-proxy ref="qDateStart" transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.dateStart" @input="$refs.qDateStart.hide()"/>
                </q-popup-proxy>
              </template>
            </q-input>

            <q-input dense mask="date" bg-color="white" v-model="form.dateEnd" color="primary"
                     :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                     :label="`${$tr('qcommerce.layout.form.dateEnd')}*`"
                     outlined placeholder="YYYY/MM/DD">
              <template v-slot:append>
                <q-icon name="fas fa-calendar-day"/>
                <q-popup-proxy ref="qDateEnd" transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.dateEnd" @input="$refs.qDateEnd.hide()"/>
                </q-popup-proxy>
              </template>
            </q-input>

            <q-select outlined dense bg-color="white" v-model="form.shipping"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      :label="`${$tr('qcommerce.layout.form.shipping')}*`" style="width: 100%;"
                      emit-value map-options :options="[
                        {label: this.$tr('ui.label.yes'), value: '1'},
                        {label: this.$tr('ui.label.no'), value: '0'},
                      ]"/>


            <q-select outlined dense bg-color="white" v-model="form.logged"
                      :rules="[val => !!val || $tr('ui.message.fieldRequired')]"
                      :label="`${$tr('qcommerce.layout.form.logged')}*`" style="width: 100%;"
                      emit-value map-options :options="[
                        {label: this.$tr('ui.label.yes'), value: '1'},
                        {label: this.$tr('ui.label.no'), value: '0'},
                      ]"/>
          </div>
          <q-page-sticky
            position="bottom-right"
            :offset="[18, 18]">
            <!--Update button-->
            <q-btn v-if="$route.params.id" color="positive" :loading="loading"
                   icon="fas fa-edit" :label="$tr('ui.label.update')" type="submit"/>
            <!--Save button-->
            <q-btn v-else color="positive" :loading="loading" icon="fas fa-edit"
                   :label="$tr('ui.label.create')" type="submit"/>
          </q-page-sticky>
        </q-form>
        <inner-loading :visible="loading"/>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data () {
      return {
        loading: false,
        types: [],
        products: {
          data: [],
          loading: false
        },
        categories: {
          data: [],
          loading: false
        },
        form: {
          id: '',
          code: '',
          type: null,
          categoryId: null,
          productId: null,
          customerId: null,
          discount: '',
          typeDiscount: null,
          logged: null,
          shipping: null,
          dateStart: '',
          dateEnd: '',
          quantityTotal: '',
          quantityTotalCustomer: '',
          status: null,
        },
      }
    },
    watch: {
      'form.type': function (val) {
        /*this.form.categoryId = null
        this.form.productId = null*/
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.initForm()
      })
    },
    methods: {
      initForm () {
        this.getCategories()
        this.getProducts()
        if (this.$route.params.id) this.getData()
      },
      getData () {
        this.loading = true
        let params = {
          refresh: true,
          params: {}
        }
        this.$crud.show('apiRoutes.qcommerce.coupons', this.$route.params.id, params)
          .then(response => {
            Object.assign(this.form, { ...response.data })
            setTimeout(() => {
              this.form.productId = response.data.productId
              this.form.categoryId = response.data.categoryId
              this.loading = false
            }, 1000)
          }).catch(error => {
          this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
          this.loading = false
        })
      },
      getCategories () {
        this.categories.loading = true
        let params = {
          refresh: true,
          params: {
            include: 'parent'
          },
        }
        this.$crud.index('apiRoutes.qcommerce.categories', params)
          .then(response => {
            this.categories.data = this.$array.tree(response.data)
            this.categories.loading = false
          })
          .catch(error => {
            this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
            this.categories.loading = false
          })
      },
      getProducts () {
        this.products.loading = true
        let params = {
          refresh: true,
          params: {},
        }
        this.$crud.index('apiRoutes.qcommerce.products', params)
          .then(response => {
            this.products.data = response.data.map(item => {
              return {
                value: item.id,
                label: item.name,
              }
            })
            this.products.loading = false
          })
          .catch(error => {
            this.$alert.error({ message: this.$tr('ui.message.errorRequest'), pos: 'bottom' })
            this.products.loading = false
          })
      },
      createItem () {
        this.loading = true
        this.$crud.create('apiRoutes.qcommerce.coupons', this.form)
          .then(response => {
            this.loading = false
            this.$router.push({ name: 'qcommerce.admin.coupons.index' })
            this.$alert.success({ message: `${this.$tr('ui.message.recordCreated')} ID: ${response.data.id}` })
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoCreatde'), pos: 'bottom' })
          })
      },
      updateItem () {
        this.loading = true
        this.$crud.update('apiRoutes.qcommerce.coupons', this.form.id, this.form)
          .then(response => {
            this.loading = false
            this.$router.push({ name: 'qcommerce.admin.coupons.index' })
            this.$alert.success({ message: `${this.$tr('ui.message.recordUpdated')}` })
            this.initForm()
          })
          .catch(error => {
            this.loading = false
            this.$alert.error({ message: this.$tr('ui.message.recordNoUpdated'), pos: 'bottom' })
          })
      },
      generateCoupon () {
        this.form.code = this.makeCouponCode(20).toUpperCase()
      },
      makeCouponCode (length = 10) {
        let result = ''
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let charactersLength = characters.length
        for (var i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }
        return result
      },
    }
  }
</script>

