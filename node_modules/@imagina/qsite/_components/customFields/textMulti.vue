<template>
  <div v-if="type=='text-multi'" id="textMulti" class="row gutter-xs">
    <div class="q-caption text-grey">{{label}}</div>
    <div class="row full-width gutter-xs"  v-for="(value,index) in items" :key="index">
      <div class="col-10">
        <q-input
          outlined dense
          autocomplete="false"
          v-model="value.value"
          :type="input"
          :label="label+' '+(index+1)"
          :after="$auth.hasAccess('isite.settings.destroy') ? [{icon: 'clear', handler () {deleteItem(index)}}] : []"
          @input="$emit('input',items)"/>
      </div>
      <div class="col-2">
        <q-btn
          color="negative"
          class="q-mt-sm"
          rounded
          size="xs"
          icon="fas fa-trash"
          @click="deleteItem(index)"
        />
      </div>
    </div>


    <div class="col-12 text-right" v-if="$auth.hasAccess('isite.settings.create')">
      <q-btn round @click="addItem()" icon="add" size="xs" color="primary">
        <q-tooltip>
        Add {{label}}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
  <div v-else id="textMultiWidthOptions" class="row gutter-xs">
    <div class="q-caption text-grey">{{label}}</div>
    <div class="col-12" v-for="(item,index) in items" :key="index">
      <div class="row gutter-xs">
        <div class="col-12 col-md-3">
          <q-select
            outlined dense
            :label="label+' '+(index+1)"
            :options="options"
            v-model="item.label"
          />
        </div>
        <div class="col-12 col-md-7">
          <q-input
            outlined dense
            autocomplete="false"
            v-model="item.value"
            :type="input"
            :label="label+' '+(index+1)"
            :after="$auth.hasAccess('isite.settings.destroy') ? [{icon: 'clear', handler () {deleteItem(index)}}] : []"
            @input="$emit('input',items)"/>

        </div>
        <div class="col-12 col-md-2">
          <q-btn
            color="negative"
            class="q-mt-sm"
            rounded
            size="xs"
            icon="fas fa-trash"
            @click="deleteItem(index)"
          />
        </div>
      </div>
    </div>

    <div class="col-12 text-right" v-if="$auth.hasAccess('isite.settings.create')">
      <q-btn round @click="addItem()" icon="add" size="xs" color="primary">
        <q-tooltip>
          Add {{label}}
        </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script>
  import alert from '@imagina/qsite/_plugins/alert'

  export default {
    props: ['value','label','type','input','options'],
    components: {},
    watch: {
      value(){
        this.items = JSON.parse(JSON.stringify(this.value))
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.items = JSON.parse(JSON.stringify(this.value))
      })
    },
    data() {
      return {
        items:[]
      }
    },
    methods: {
      addItem(){
        if(this.type == 'text-multi')
          this.items.push({value:''})
        else
          this.items.push({label:'',value:''})

      },
      deleteItem(index){
        this.items.splice(index,1)
        let items = JSON.parse(JSON.stringify(this.items))
        this.$emit('input',items)
      }
    }

  }
</script>
<style lang="stylus">
</style>
