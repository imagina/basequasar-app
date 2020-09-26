<template>
  <div id="orderItemsComponent">
    <q-table
      :data="items"
      :columns="columns"
      :pagination="{
        rowsPerPage: 0
      }" hide-bottom
      class="no-shadow secondary-font">
      <q-td slot="body-cell-description" slot-scope="props" :props="props">
        <div>
          <!--Title-->
          <div>
            {{props.row.title}}
          </div>
          <!--Options-->
          <div v-if="props.row.options && props.row.options.length">
            <div class="inline-block option-content text-left" :key="key"
                 v-for="(option, key) in props.row.options">
              <!--Option title-->
              <div class="option-title">{{option.optionDescription}}</div>
              <!--Value title-->
              <div class="value-title">
                <q-icon name="fas fa-caret-right"/>
                {{option.optionValueDescription}}
              </div>
            </div>
          </div>
        </div>
      </q-td>
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
          { name: 'cantidad', label: 'Cantidad', field: 'quantity', align: 'left' },
          { name: 'codigo', label: 'Codigo', field: 'id', align: 'left' },
          { name: 'description', label: 'Description', align: 'left' },
          {
            name: 'valor',
            label: 'Valor',
            field: 'total',
            format: val => val ? '$ ' + this.$n(val) : '0',
            align: 'center'
          },
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="stylus">
  #orderItemsComponent
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
