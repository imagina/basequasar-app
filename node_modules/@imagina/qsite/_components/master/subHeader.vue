<template>
  <div id="subHeadercomponent" ref="subHeadercomponent">
    <!--Fixed content-->
    <div id="contentSubHeader" ref="contentSubHeader" class="row items-center">
      <!--Left content-->
      <div id="leftContent" class="row items-center">
        <!--== Back Button ==-->
        <q-btn icon="fas fa-arrow-left" unelevated round color="primary" class="btn-action q-mr-md"
               @click="backAction()">
          <q-tooltip>{{$tr('ui.label.back')}}</q-tooltip>
        </q-btn>
        <!--Breadcrum-->
        <div id="breadCrumbContent">
          <q-breadcrumbs>
            <q-breadcrumbs-el v-for="(item, key) in breadcrumbs" :key="key" :label="item.label" :icon="item.icon"
                              :to="item.to ? {name : item.to} : false"/>
          </q-breadcrumbs>
        </div>
      </div>

      <!--Space-->
      <q-space/>

      <!--Right content-->
      <div id="rightContent" class="row items-center">
        <!--Department-->
        <dynamic-field v-model="form.departmentId" :field="fields.department" style="max-width: 250px"
                       @input="emitValue" v-if="params.selectDepartment" class="inline-block q-mr-md"/>
        <!--== Button refresh ==-->
        <q-btn icon="fas fa-redo" unelevated round v-if="params.refresh" color="primary" class="btn-action"
               @click="$root.$emit('page.data.refresh')">
          <q-tooltip>{{$tr('ui.label.refresh')}}</q-tooltip>
        </q-btn>
        <!--== Button filter ==-->
        <q-btn icon="fas fa-filter" unelevated round v-if="filter.load" color="primary" class="btn-action q-ml-sm"
               @click="()=> {drawer.filter = !drawer.filter; drawer.config = false}">
          <q-tooltip>{{$tr('ui.label.filter')}}</q-tooltip>
        </q-btn>
      </div>

      <!--Message if page has filter-->
      <div id="messageFilter" class="cursor-pointer text-caption" v-if="filter.hasValues"
           @click="drawer.filter = !drawer.filter">
        <q-icon name="fas fa-exclamation" size="12px" color="warning"/>
        {{$tr('ui.message.pageDataWithFilter')}}
      </div>
    </div>

    <!--Master filter-->
    <q-drawer bordered id="menu_master" v-model="drawer.filter" side="right" v-if="filter.load">
      <master-filter/>
    </q-drawer>
  </div>
</template>
<script>
  //Components
  import masterFilter from '@imagina/qsite/_components/master/masterFilter'

  export default {
    props: {
      bgColor: {default: 'white'},
      textColor: {default: 'primary'},
    },
    components: {masterFilter},
    watch: {
      $route: {
        deep: true,
        handler: function (newValue) {
          this.currentRoute = newValue
        }
      },
      form: {
        deep: true,
        handler: function () {
          let dataExtra = this.subHeaderData
          dataExtra[this.currentRoute.name] = this.$clone(this.form)
          this.$store.dispatch('qsiteApp/SET_EXTRA', {subHeaderData: dataExtra})
        }
      },
      'drawer.filter': function (isOpen) {
        if (isOpen) this.$emit('openFilter')
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        drawer: {
          filter: false
        },
        form: {
          departmentId: null
        },
        currentRoute: this.$route,
        filter : this.$filter
      }
    },
    computed: {
      //Return all data in extra state store "subHeaderData" merged with currernt data
      subHeaderData() {
        return this.$clone(this.$store.getters['qsiteApp/getExtra']('subHeaderData') || {})
      },
      //Return params of subHeader
      params() {
        return this.currentRoute.meta.subHeader || {}
      },
      //Return departments as tre select
      departments() {
        return this.$clone(this.$store.state.quserAuth.userData.departments || [])
      },
      //Fields
      fields() {
        return {
          department: {
            value: (this.departments && this.departments.length) ? this.departments[0].id.toString() : null,
            type: 'treeSelect',
            props: {
              label: this.$tr('ui.label.department'),
              options: this.$array.tree(this.departments),
              clearable: false
            }
          }
        }
      },
      //Return data breadcrumd
      breadcrumbs() {
        let response = []
        //Get breadcrumbs from params
        let breadcrumbs = this.params.breadcrumb ? this.$clone(this.params.breadcrumb) : []
        breadcrumbs = this.$clone(breadcrumbs.reverse())

        //Set Home page and current page
        let pages = (this.currentRoute.name.indexOf('app.home') == -1) ?
          [config(`pages.app.home`), this.currentRoute.meta] : [config(`pages.app.home`)]

        //Get page from breadcrum
        breadcrumbs.forEach(pageName => pages.splice(1, 0, config(`pages.${pageName}`)))

        //Format all routes to breadcrum
        pages.forEach(page => {
          if (page.activated && this.$auth.hasAccess(page.permission))
            response.push({
              label: this.$tr(page.headerTitle || page.title),
              icon: page.icon,
              to: page.name
            })
        })

        //Response
        return response
      }
    },
    methods: {
      init() {
        this.restoreData()//Restore data
        this.emitValue()//Emit value
      },
      //Restore data form cache
      restoreData() {
        let extras = this.$clone(this.subHeaderData)
        if (extras[this.currentRoute.name]) this.form = this.$clone(extras[this.currentRoute.name])
      },
      //Emit response
      emitValue() {
        //this.$refs.menuDepartmentId.hide()//Hide menu department
        let response = {departmentId: this.departmentId || null}
        this.$root.$emit('page.data.refresh', response)
      },
      //Back page
      backAction() {
        window.history.back()
      }
    }
  }
</script>
<style lang="stylus">
  #subHeadercomponent
    width 100%
    color $grey-9
    position relative

    #contentSubHeader
      background-color white
      padding 5px 10px
      border-bottom 1px solid $grey-4
      width 100%
      min-height 48px

      #dynamicFieldComponent
        .q-field__control
          min-height 37px

        .q-field__label
          font-size 14px

        .vue-treeselect
          font-size 12px
          max-height 23px !important

      #messageFilter
        background white
        border 2px solid $warning
        border-top none
        border-radius 0 0 10px 10px
        padding 0 6px 1px 6px
        position absolute
        margin-right auto
        margin-left auto
        left 0
        right 0
        bottom -23px
        width max-content

    .btn-action
      .q-btn__wrapper
        min-height 30px !important
        min-width 30px !important
        padding 5px

        .q-icon
          font-size 16px !important

    .q-breadcrumbs
      .q-breadcrumbs__el
        font-size 14px

      .q-icon
        font-size 15px
</style>
