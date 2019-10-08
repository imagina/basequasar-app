<template>
  <div id="pageId">
    <!--Schedules-->
    <q-list separator bordered>
      <!--Title-->
      <q-item class="q-px-sm" v-if="!readonly">
        <!--Title-->
        <q-item-section>{{$trp('ui.form.schedule')}}</q-item-section>
        <!--Button update-->
        <q-item-section side>
          <q-btn class="btn-small float-right" icon="fas fa-edit"
                 @click="modal.show = true"
                 :label="$tr('ui.label.update')" color="positive"/>
        </q-item-section>
      </q-item>
      <!--Schedules-->
      <q-item v-for="(item, key) in response" :key="key">
        <!--Day-->
        <q-item-section class="text-capitalize">
          {{$tr(`ui.label.${item.name}`)}}
        </q-item-section>
        <!--Hours-->
        <q-item-section side>
          <!--Message Close-->
          <div class="text-negative capitalize text-right q-body-2" v-if="item.schedules == '0'">
            {{$tr('ui.label.closed')}}
          </div>
          <!--Message 24 Hours-->
          <div class="text-positive capitalize text-right q-body-2"
               v-else-if="item.schedules == '1'">
            {{`24 ${$trp('ui.label.hour')}`}}
          </div>
          <!--List schedules-->
          <div v-else>
            <div v-for="(schedule,index) in item.schedules" :key="index">
              {{`${$trd(schedule.from,{type : 'time'})} - ${$trd(schedule.to,{type : 'time'})}`}}
            </div>
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <!--Form - Modal-->
    <q-dialog v-model="modal.show" no-esc-dismiss v-if="modal.show"
              no-backdrop-dismiss class="backend-page" id="modalSchedules">
      <q-card class="bg-grey-1">
        <!--Header-->
        <q-toolbar class="bg-primary text-white">
          <q-toolbar-title>{{$trp('ui.form.schedule')}}</q-toolbar-title>
          <q-btn flat v-close-popup icon="fas fa-times"/>
        </q-toolbar>

        <!--Content-->
        <div class="relative-position q-pa-md">
          <!--Schedules-->
          <q-list separator>
            <q-item v-for="(item, key) in response" :key="key" style="min-width: 450px">
              <!--Day-->
              <q-item-section class="text-capitalize">
                <q-item-label>{{$tr(`ui.label.${item.name}`)}}</q-item-label>
              </q-item-section>

              <!--Hours-->
              <q-item-section side>
                <div class="text-right">
                  <!--Button add hours-->
                  <q-btn icon="fas fa-plus" v-if="['1','0'].indexOf(modal.status[item.name]) == -1"
                         color="positive" flat size="sm" :disabled="!successLastSchedule(item.name)"
                         @click="modal.schedules[item.name].push({from : new Date(), to : new Date()})">
                    <q-tooltip>{{$tr('ui.label.add')}}</q-tooltip>
                  </q-btn>

                  <!--Select status-->
                  <q-select outlined dense style="max-width: 100px; min-width: 120px" v-model="modal.status[item.name]"
                            :options="options.status" emit-value map-options/>

                  <!--List schedules-->
                  <div v-if="['1','0'].indexOf(modal.status[item.name]) == -1">
                    <div v-for="(schedule,index) in modal.schedules[item.name]" :key="index">
                      <q-separator />

                      <!--Button remove hours-->
                      <q-btn icon="fas fa-times" color="negative" flat size="sm"
                             @click="modal.schedules[item.name].splice(index,1)"
                             :disabled="index == 0 ? true : false">
                        <q-tooltip>{{$tr('ui.label.remove')}}</q-tooltip>
                      </q-btn>

                      <!--Range date-->
                      <div class="inline-block q-py-xs">
                        <!--Date time from-->
                        <label>{{$trd(modal.schedules[item.name][index].from,{type : 'time'})}}</label>
                        <q-btn size="sm" round color="primary" icon="fas fa-clock" class="q-ml-sm">
                          <q-popup-proxy :ref="`popupFrom${index}`" transition-show="scale" transition-hide="scale">
                            <q-time :format24h="false" v-model="modal.schedules[item.name][index].from"
                                    mask="YYYY-MM-DD HH:mm"
                                    @input="$refs[`popupFrom${index}`][0].hide()"/>
                          </q-popup-proxy>
                        </q-btn>
                        <label class="q-px-sm">/</label>
                        <!--Date time To-->
                        <label>{{$trd(modal.schedules[item.name][index].to,{type : 'time'})}}</label>
                        <q-btn size="sm" round color="primary" icon="fas fa-clock" class="q-ml-sm">
                          <q-popup-proxy :ref="`popupTom${index}`" transition-show="scale" transition-hide="scale">
                            <q-time :format24h="false" v-model="modal.schedules[item.name][index].to"
                                    mask="YYYY-MM-DD HH:mm"
                                    @input="$refs[`popupTom${index}`][0].hide()"/>
                          </q-popup-proxy>
                        </q-btn>
                      </div>
                    </div>
                  </div>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
          <!--Loading-->
          <inner-loading :visible="modal.loading"/>
        </div>

        <!--Footer-->
        <q-toolbar color="white">
          <q-toolbar-title></q-toolbar-title>
          <!--Button Save-->
          <q-btn icon="fas fa-save" color="positive" @click="updateSchedules"
                 :label="$tr('ui.label.save')" :loading="modal.loading"/>
        </q-toolbar>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>

  export default {
    props: {
      value: { default: false },
      readonly: { default: false }
    },
    components: {},
    watch: {
      value: {
        handler (value) {
          this.setPropValue()
        },
        deep: true
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.init()
      })
    },
    data () {
      return {
        modal: {
          show: false,
          loading: false,
          status: {},
          schedules: {}
        },
        response: []
      }
    },
    computed: {
      //Init data
      initData () {
        return [
          { name: 'monday', iso: 1, schedules: '1' },
          { name: 'tuesday', iso: 2, schedules: '1' },
          { name: 'wednesday', iso: 3, schedules: '1' },
          { name: 'thursday', iso: 4, schedules: '1' },
          { name: 'friday', iso: 5, schedules: '1' },
          { name: 'saturday', iso: 6, schedules: '1' },
          { name: 'sunday', iso: 7, schedules: '1' },
        ]
      },
      //Return translatable options
      options () {
        //Options
        let response = {
          status: [
            { label: this.$tr('ui.label.open'), value: '2' },
            { label: `24 ${this.$trp('ui.label.hour')}`, value: '1' },
            { label: this.$tr('ui.label.closed'), value: '0' },
          ]
        }

        return response//Response
      }
    },
    methods: {
      //Init
      init () {
        this.response = this.initData//Set default data in response
        this.modal.schedules = this.initData//Set default data in modal
        this.setPropValue()//Merge prop value
      },
      //Check prop Value
      setPropValue () {
        if (this.value) {
          if (JSON.stringify(this.value) != JSON.stringify(this.response)) {
            if (this.value) this.response = this.$clone(this.value)
          }
        }

        this.setDynamicFieldsModal()//Set dynamic fields in modal
      },
      //Set dynamic values to modal
      setDynamicFieldsModal () {
        //Set status
        let status = {}
        this.response.forEach(item => {
          status[item.name] = '1'
        })
        this.modal.status = this.$clone(status)
        //Set default schedule
        let schedules = {}
        this.response.forEach(item => {
          this.modal.status[item.name] = item.schedules//Set schedules
          //Set default hours
          schedules[item.name] = [{
            from: '2019-07-16T08:00:00.000-05:00',
            to: '2019-07-16T20:00:00.000-05:00'
          }]
          //If is open, merge schedules
          if ((['1', '0'].indexOf(item.schedules) == -1)) {
            schedules[item.name] = item.schedules//Set status to modal
            this.modal.status[item.name] = '2'//Set status open
          }
        })
        this.modal.schedules = this.$clone(schedules)
        this.$emit('input', this.response)//Emit response
      },
      //check if Last Schedule is completed
      successLastSchedule (key) {
        let schedule = this.modal.schedules[key]
        let item = schedule[schedule.length - 1]
        let response = true
        if (!item.from) response = false
        if (!item.to) response = false

        return response
      },
      //Update schedule
      updateSchedules () {
        let response = {}
        //Order schedules according status
        Object.keys(this.modal.status).forEach(day => {
          response[day] = (['1', '0'].indexOf(this.modal.status[day]) != -1) ?
            this.modal.status[day] : this.modal.schedules[day]
        })

        //Merge with Response
        this.response.forEach((item, index) => {
          this.response[index].schedules = this.$clone(response[item.name])
        })

        this.$emit('input', this.response)//Emit response
        this.modal.show = false//hide modal
      }
    }
  }
</script>
<style lang="stylus">
  #modalSchedules
    .q-field
      padding 3px
      display: inline-block !important
</style>
