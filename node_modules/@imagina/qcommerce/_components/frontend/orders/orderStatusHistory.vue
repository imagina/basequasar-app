<template>
  <div id="orderStatusHistoryComponent">

    <q-table
      :data="items"
      :columns="columns"
      :pagination="{
        rowsPerPage: 0
      }" hide-bottom
      class="no-shadow"
    >



    </q-table>

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
          { name: 'title', label: 'Status', field: row => row.status.title, align: 'center' },

          {
            name: 'createdAt',
            label: 'Date',
            field: 'createdAt',
            format: val => val ? this.$d(this.$moment(val,"YYYY-MM-DD HH:mm").toDate(),'long',this.$q.i18n.lang) : "-",
            align: 'center'
          },
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #orderStatusHistoryComponent
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
