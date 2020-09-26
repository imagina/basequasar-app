<template>

  <div id="textMultiWidthOptions" class="row gutter-xs">
    <div class="q-caption text-grey">{{label}}</div>

    <q-list class="full-width" no-border highlight>

      <q-item v-for="(item,index) in items" :key="index">
        <q-item-section>
          {{item.field}}
        </q-item-section>
        <q-item-section right>
          <div class="text-right">
            <q-checkbox
              v-model="item.active"
              label="Active"
              @input="emitActivedItems(item.required,index)"
            />
            <q-checkbox
              class="q-ml-xs"
              v-model="item.required"
              label="Required"
              @input="emitActivedItems(item.required,index)"
            />
          </div>
        </q-item-section>
      </q-item>

    </q-list>


  </div>
</template>
<script>
  import alert from '@imagina/qsite/_plugins/alert'

  export default {
    props: ['value', 'label', 'type', 'input', 'setting'],
    components: {},

    mounted () {
      this.$nextTick(function () {
        let values = JSON.parse(JSON.stringify(this.value))
        this.items = []
        this.setting.fields.forEach(field => {
          let val = values.find(val => val.field == field)
          let active = val ? val.active : false
          let required = val ? val.required : false

          this.items.push({
            active: active,
            field: field,
            required: required
          })
        })

      })
    },
    data () {
      return {
        items: []
      }
    },
    methods: {

      emitActivedItems (required = false, index = 0) {
        if (required) {
          this.items[index].active = true
        }

        let activedItems = []
        this.items.forEach(item => {
          if (item.active) {
            activedItems.push(item)
          }
        })

        this.$emit('input', activedItems)
      }
    }

  }
</script>
<style lang="stylus">
</style>
