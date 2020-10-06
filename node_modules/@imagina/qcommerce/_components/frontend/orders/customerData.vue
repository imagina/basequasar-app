<template>
  <div id="customerDataComponent">

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
          { name: 'firstName', label: 'First Name', field: 'firstName', align: 'center' },
          { name: 'lastName', label: 'Last Name', field: 'lastName', align: 'center' },
          { name: 'email', label: 'Email', field: 'email', align: 'center' }
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #customerDataComponent
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
