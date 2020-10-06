<template>
  <div id="transactionsComponent">

    <q-table
      :data="items"
      :columns="columns"
      :pagination="{
        rowsPerPage: 0
      }" hide-bottom
      class="no-shadow"
    />




  </div>
</template>
<script>
  export default {
    props: { items: { default: [] } },
    components: {},
    watch: {},
    mounted () {
      this.$nextTick(function () {
      })
    },
    data () {
      return {
        columns: [
          { name: 'transaction', label: 'Payment Method', field: row => row.paymentMethodTitle, align: 'center' },

          {
            name: 'amount',
            label: 'Amount',
            field:'amount',
            format: val => val ? '$ ' + this.$n(val) : '0',
            align: 'center'
          },
          { name: 'status', label: 'Status', field: row => row.status == "1" ? "Success" : "Fail", align: 'center' },
          { name: 'statusTitle', label: 'Status', field:'statusTitle'},
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #transactionsComponent
    table
      thead
        th
          color $primary
      td, th
        font-family $secondaryFont !important
        font-size 14px
        color $tertiary
        font-weight bold
    .option-content
      margin-left 20px
      .option-title
        color $grey-10
        font-weight bold
        font-size 14px
      .value-title
        color $grey-8
        font-size 14px
</style>
