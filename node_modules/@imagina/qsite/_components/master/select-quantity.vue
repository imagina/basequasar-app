<template>
  <q-input class="quantityInput" outlined v-model="response" :label="labelData" dense
           color="primary" :style="`width : ${width}`">
    <template v-slot:prepend>
      <q-btn size="10px" round dense flat icon="fas fa-minus" @click="response -= 1"/>
    </template>
    <template v-slot:append>
      <q-btn size="10px" color="primary" round dense flat icon="fas fa-plus" @click="response += 1"/>
    </template>
  </q-input>
</template>
<script>
  export default {
    props: {
      label: {default: false},
      value: {default: 0},
      min: {default: 0},
      max: {default: 10},
      width: {default: '100px'}
    },
    components: {},
    watch: {
      value(newValue, oldValue) {
        if (newValue != oldValue) {
          this.response = this.$clone(this.value)
        }
      },
      response(value) {
        let quantity = parseInt(value)
        let min = parseInt(this.min)
        let max = parseInt(this.max)

        //Validate values
        if (!quantity) this.response = min
        if (quantity < min) this.response = min
        if (quantity > max) this.response = max

        //Emit response
        this.$emit('input', this.response)
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.response = this.$clone(this.value)
      })
    },
    data() {
      return {
        response: 1
      }
    },
    computed: {
      labelData() {
        this.label || this.$tr('store.layout.label.quantity')
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  .quantityInput
    .q-field__control
      padding 0 6px
      input
        text-align center
</style>
