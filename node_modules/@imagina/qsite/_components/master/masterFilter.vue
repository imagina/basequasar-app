<template>
  <div id="masterFilterComponent" v-if="filter">
    <!-- Header -->
    <div ref="headerContent">
      <!--Title-->
      <div class="q-pt-sm">
        <q-item class="text-primary">
          <q-item-section avatar>
            <q-icon name="fas fa-filter"></q-icon>
          </q-item-section>
          <q-item-section class="text-h6">
            {{$trp('ui.label.filter', {capitalize : true})}}
          </q-item-section>
        </q-item>
      </div>

      <!--Tabs-->
      <q-separator class="q-mt-sm"/>
      <div id="tabsContent" class="full-width">
        <q-tabs v-model="tabName" dense class="text-grey" active-color="primary" indicator-color="primary"
                align="justify" v-if="filter.hasValues" :breakpoint="0">
          <q-tab name="tabForm" :label="$tr('ui.label.filter')"/>
          <q-tab name="tabSummary" :label="$tr('ui.form.summary')"/>
        </q-tabs>
      </div>
      <q-separator v-if="filter.hasValues"/>
    </div>

    <!--Content-->
    <q-scroll-area id="contentMasterField" class="q-py-md" style="height: calc(100vh - 253px)">
      <!--Tab panels-->
      <q-tab-panels v-model="tabName" animated keep-alive>
        <!--Tab form-->
        <q-tab-panel name="tabForm" class="q-pa-none q-px-xs">
          <div id="filtersContent" class="q-px-sm">
            <!--Search-->
            <div v-if="filter.fields && filter.fields.search" class="q-mb-sm">
              <!--Label-->
              <div class="full-width text-primary q-mb-xs">
                <q-icon name="fas fa-search" class="q-mr-xs"/>
                {{$tr('ui.label.search' , {capitalize : true})}}
              </div>
              <!--Input search-->
              <dynamic-field v-model="filterValues.search"
                             :field="{...filter.fields.search, props : {debounce : '0'}}"/>
            </div>
            <!--Date-->
            <div v-if="filter.fields && filter.fields.date" class="q-mb-sm">
              <!--Label-->
              <div class="full-width text-primary q-mb-xs">
                <q-icon name="far fa-calendar-check" class="q-mr-xs"/>
                {{$tr('ui.form.date' , {capitalize : true})}}
              </div>
              <!--Fields date-->
              <dynamic-field v-for="(fieldDate, key) in dateFields" :key="key" :field="fieldDate" class="q-mb-sm"
                             v-model="filterValues.date[fieldDate.name || key]"/>
            </div>
            <!--Pagination-->
            <div v-if="filter.fields && filter.fields.pagination" class="q-mb-sm">
              <!--Label-->
              <div class="full-width text-primary q-mb-xs">
                <q-icon name="fab fa-buffer" class="q-mr-xs"/>
                {{$tr('ui.label.pagination' , {capitalize : true})}}
              </div>
              <!--Fields pagination-->
              <dynamic-field v-for="(fieldPagination, key) in paginationFields" :field="fieldPagination" class="q-mb-sm"
                             v-model="pagination[fieldPagination.name || key]" :key="key"/>
            </div>
            <q-separator class="q-my-md" v-if="filter.fields.search || filter.fields.date || filter.fields.pagination"/>
            <!--others Fields-->
            <dynamic-field v-for="(field, key) in filter.fields" :key="key" v-model="filterValues[field.name || key]"
                           v-if="['search','pagination'].indexOf(key) == -1" class="q-mb-sm" :field="field"/>
          </div>
        </q-tab-panel>
        <!--Tab Summary-->
        <q-tab-panel name="tabSummary" class="q-pa-none q-px-md">
          <!--Search-->
          <dynamic-field v-model="filterValues.search" v-if="filter.fields && filter.fields.search"
                         :field="filter.fields.search" read-only class="q-mb-sm"/>
          <!--Date-->
          <dynamic-field v-for="(fieldDate, key) in dateFields" :key="key" :field="fieldDate" class="q-mb-sm"
                         v-model="filterValues.date[fieldDate.name || key]" read-only
                         v-if="filter.fields && filter.fields.date && key != 'type'"/>
          <!--others Fields-->
          <dynamic-field v-for="(field, key) in filter.fields" :key="key" read-only class="q-mb-sm"
                         v-model="filterValues[field.name || key]" :field="field"
                         v-if="['search','pagination', 'date'].indexOf(key) == -1"/>
        </q-tab-panel>
      </q-tab-panels>
    </q-scroll-area>

    <!--footer -->
    <div class="absolute-bottom text-center bg-white" ref="footerContent">
      <q-separator/>
      <q-btn :label="$tr('ui.label.search')" unelevated color="primary" class="q-my-sm" @click="emitFilter()"/>
    </div>
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {
      '$filter': {
        deep: true,
        handler: function (newValue, oldValue) {
          if (JSON.stringify(newValue) !== JSON.stringify(oldValue))
            this.init()
        }
      },
      'filterValues.date': {
        deep: true,
        handler: function (newValue) {
          if (newValue) this.changeDate()
        }
      },
      '$route.name': {
        deep: true,
        handler: function (newValue) {
          this.$filter.reset()
        }
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.init()
      })
    },
    data() {
      return {
        filter: this.$filter,
        tabName: 'tabForm',
        filterValues: {},
        pagination: {}
      }
    },
    computed: {
      dateFields() {
        let filterDate = this.$clone(this.filterValues.date)
        let filterFields = this.$clone(this.filter.fields)
        let fieldDate = (filterFields && filterFields.date && filterFields.date.field) ? filterFields.date.field : false

        if (!filterDate) return {}
        let fields = {
          field: fieldDate || {value: 'created_at'},
          type: {
            value: this.filterValues.date.type || null,
            type: 'select',
            props: {
              label: this.$tr('ui.form.type'),
              clearable: true,
              options: [
                {label: this.$tr('ui.label.customRange'), value: 'customRange'},
                {label: this.$tr('ui.label.today'), value: 'today'},
                {label: this.$tr('ui.label.yesterday'), value: 'yesterday'},
                {label: this.$tr('ui.label.tomorrow'), value: 'tomorrow'},
                {label: this.$tr('ui.label.LastNumDays', {numDays: 7}), value: 'lastSevenDays'},
                {label: this.$tr('ui.label.LastNumDays', {numDays: 30}), value: 'lastThirtyDays'},
                {label: this.$tr('ui.label.LastNumDays', {numDays: 60}), value: 'lastSixtyDays'},
                {label: this.$tr('ui.label.currentWeek'), value: 'currentWeek'},
                {label: this.$tr('ui.label.lastWeek'), value: 'lastWeek'},
                {label: this.$tr('ui.label.nextWeek'), value: 'nextWeek'},
                {label: this.$tr('ui.label.currentMonth'), value: 'currentMonth'},
                {label: this.$tr('ui.label.lastMonth'), value: 'lastMonth'},
                {label: this.$tr('ui.label.nextMonth'), value: 'nextMonth'},
                {label: this.$tr('ui.label.numMonthsAgo', {numMonths: 2}), value: 'twoMonthsAgo'},
                {label: this.$tr('ui.label.currentYear'), value: 'currentYear'},
                {label: this.$tr('ui.label.lastYear'), value: 'lastYear'},
                {label: this.$tr('ui.label.numYearsAgo', {numYears: 2}), value: 'twoYearsAgo'},
                {label: this.$tr('ui.label.lastNumYears', {numYears: 2}), value: 'lastTwoYears'},
              ]
            }
          },
          from: {
            value: this.filterValues.date.from || null,
            type: 'date',
            props: {
              vIf: (filterDate && (filterDate.type == 'customRange')) ? true : false,
              label: this.$tr('ui.form.startDate'),
              clearable: true,
              options: (date) => filterDate.to ? (date < this.$moment(filterDate.to).format('YYYY/MM/DD')) : true,
            }
          },
          to: {
            value: this.filterValues.date.to || null,
            type: 'date',
            props: {
              vIf: (filterDate && (filterDate.type == 'customRange')) ? true : false,
              label: this.$tr('ui.form.endDate'),
              clearable: true,
              options: (date) => filterDate.from ? (date > this.$moment(filterDate.from).format('YYYY/MM/DD')) : true,
            }
          }
        }

        return fields
      },
      paginationFields() {
        let filter = this.$clone(this.filter)
        //Order fields to pagination
        if (filter && filter.fields && filter.fields.pagination) {
          let pages = []
          let lastPage = filter.pagination.lastPage || 1
          //Define number of pages
          for (let i = 1; i <= lastPage; i++)
            pages.push({label: i.toString(), value: i.toString()})

          return {
            page: {
              value: filter.pagination.page || 1,
              type: 'select',
              props: {
                label: this.$tr('ui.form.page'),
                options: pages
              }
            },
            rowsPerPage: {
              value: filter.pagination.rowsPerPage || 20,
              type: 'select',
              props: {
                label: this.$tr('ui.form.perPage'),
                options: [
                  {label: this.$tr('ui.label.all'), value: '0'},
                  {label: '5', value: '5'},
                  {label: '10', value: '10'},
                  {label: '20', value: '20'},
                  {label: '50', value: '50'},
                  {label: '100', value: '100'},
                ]
              }
            }
          }
        } else return {}
      }
    },
    methods: {
      init() {
        if (this.filter && this.filter.values) this.filterValues = this.$clone(this.filter.values)
        if (this.filter && this.filter.pagination) this.pagination = this.$clone(this.filter.pagination)
        this.emitFilter()
      },
      //Emit filter
      async emitFilter() {
        this.changeDate()
        this.$filter.addValues(this.filterValues)

        //Emit Filter
        if (this.filter && this.filter.callBack) {
          this.filter.callBack(this.filter)//Call back
          this.$root.$emit('page.data.filtered', this.filter)//Global event
        }
      },
      //Change dates by type
      changeDate() {
        if (this.filterValues.date && this.filterValues.date.type) {
          let typeDate = this.$clone(this.filterValues.date.type)
          if (typeDate) {
            //Default Dates
            let fromDate = this.filterValues.date.from
            let toDate = this.filterValues.date.to
            //Case values
            switch (typeDate) {
              case 'today':
                fromDate = this.$moment().format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().format('YYYY/MM/DD 23:59:59')
                break;
              case 'yesterday':
                fromDate = this.$moment().subtract(1, 'd').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(1, 'd').format('YYYY/MM/DD 23:59:59')
                break;
              case 'tomorrow':
                fromDate = this.$moment().add(1, 'd').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().add(1, 'd').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastSevenDays':
                fromDate = this.$moment().subtract(6, 'd').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().format('YYYY/MM/DD 23:59:59')
                break;
              case 'currentWeek':
                fromDate = this.$moment().startOf('isoWeek').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastWeek':
                fromDate = this.$moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
                break;
              case 'nextWeek':
                fromDate = this.$moment().add(1, 'weeks').startOf('isoWeek').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().add(1, 'weeks').endOf('isoWeek').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastThirtyDays':
                fromDate = this.$moment().subtract(29, 'd').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastSixtyDays':
                fromDate = this.$moment().subtract(59, 'd').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().format('YYYY/MM/DD 23:59:59')
                break;
              case 'currentMonth':
                fromDate = this.$moment().startOf('month').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().endOf('month').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastMonth':
                fromDate = this.$moment().subtract(1, 'months').startOf('month').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(1, 'months').endOf('month').format('YYYY/MM/DD 23:59:59')
                break;
              case 'nextMonth':
                fromDate = this.$moment().add(1, 'months').startOf('month').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().add(1, 'months').endOf('month').format('YYYY/MM/DD 23:59:59')
                break;
              case 'twoMonthsAgo':
                fromDate = this.$moment().subtract(2, 'months').startOf('month').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(2, 'months').endOf('month').format('YYYY/MM/DD 23:59:59')
                break;
              case 'twoYearsAgo':
                fromDate = this.$moment().subtract(2, 'year').startOf('year').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(2, 'year').endOf('year').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastYear':
                fromDate = this.$moment().subtract(1, 'year').startOf('year').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().subtract(1, 'year').endOf('year').format('YYYY/MM/DD 23:59:59')
                break;
              case 'lastTwoYears':
                fromDate = this.$moment().subtract(1, 'year').startOf('year').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().endOf('year').format('YYYY/MM/DD 23:59:59')
                break;
              case 'currentYear':
                fromDate = this.$moment().startOf('year').format('YYYY/MM/DD 00:00:00')
                toDate = this.$moment().endOf('year').format('YYYY/MM/DD 23:59:59')
                break;
              case 'customRange':
                if (fromDate)
                  fromDate = this.$moment(fromDate).format('YYYY/MM/DD 00:00:00')
                if (toDate)
                  toDate = this.$moment(toDate).format('YYYY/MM/DD 23:59:59')
                break;
            }
            //Set new Date
            this.filterValues.date.from = this.$clone(fromDate)
            this.filterValues.date.to = this.$clone(toDate)
          }
        } else if (this.filterValues.date) {
          //Remove dates
          this.filterValues.date.from = null
          this.filterValues.date.to = null
        }
      },
    }
  }
</script>
<style lang="stylus">
  #masterFilterComponent
    #tabsContent
      .q-tab__content
        min-width auto
</style>
