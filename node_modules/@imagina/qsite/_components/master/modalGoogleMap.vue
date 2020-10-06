<template>
  <q-dialog id="modalGoogleMap" v-model="show">
    <!--Map-->
    <google-map v-bind="this.$props"/>
    <!--button close-->
    <q-btn icon="fas fa-times" color="primary" round />
  </q-dialog>
</template>
<script>
  //Components
  import googleMap from '@imagina/qsite/_components/master/googleMap'

  export default {
    props: {
      defaultCenter: {
        default: () => {
          return {lat: 4.4418993, lng: -75.2128882}
        }
      },
      defaultCityId: {default: 957},// Ibague City
      mapData: {default: false},
      mapType: {default: 'route'}
    },
    components: {googleMap},
    watch: {},
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {
        show: false
      }
    },
    computed: {},
    methods: {
      open() {
        this.show = true
      }
    }
  }
</script>
<style lang="stylus">
  #modalGoogleMap
    #map
      height 90vh
      max-height 90vh
</style>
