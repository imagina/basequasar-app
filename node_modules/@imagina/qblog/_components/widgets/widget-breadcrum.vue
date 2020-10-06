<template>
  <div id="breadcrumComponent">
    <div class="content">
      <q-breadcrumbs
        active-color="primary"
        color="light"
      >
        <!-- Separator -->
        <q-icon name="fas fa-angle-right" slot="separator" slot-scope="props"/>
        <!-- Route Home -->
        <q-breadcrumbs-el label="Inicio" to="/" icon="home"/>
        <!-- Other Routes -->
        <q-breadcrumbs-el v-for="(r,index) in itemsBreadCrum" :key="index"
                          :label="r.name" :to="'/'+r.to"/>
      </q-breadcrumbs>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      items: {default: false},
    },
    components: {},
    watch: {
      $route(to, from) {
        this.orderRoutes()
      },
      items(data) {
        this.orderRoutes()
      }
    },
    mounted() {
      this.$nextTick(function () {
        this.orderRoutes()
      })
    },
    data() {
      return {
        itemsBreadCrum: []
      }
    },
    methods: {
      /*Order routes from route*/
      orderRoutes() {
        this.itemsBreadCrum = []
        let items = this.items ? this.items : this.$route.path.split('/')
        for (var i = 0; i < items.length; i++) {
          if (items[i] !== '') {
            this.itemsBreadCrum.push({
              name: items[i].split('-').join(' '),
              to: items[i]
            })
          }
        }
      },
    }

  }
</script>
<style lang="stylus">
  #breadcrumComponent
    @media screen and (max-width: $breakpoint-md)
      overflow-x scroll
    .content
      text-transform capitalize !important
      font-size 13px
      width max-content
      display inline-block
      .q-link
        font-weight normal
        .q-icon
          font-size 17px
      .q-breadcrumbs-separator
        font-size 9px
      .q-breadcrumbs-last
        color $primary !important

</style>
