<template>
  <div v-if="category">
    <div class="home-locations" :style="'background: url('+category.mainImage.path+')'">
      <div class="q-container text-white relative-position q-py-xl">
        <h1 class="q-ma-none bg-primary text-white text-h4 absolute q-px-md q-py-md location-title">
          {{ category.title }}
        </h1>
        <div class="row q-py-xl">
          <div class="col-12 col-md-6 q-py-xl place-content" v-for="(place,i) in category.places"
               :key="i" @click="$helper.map(place.address.address)">
            <div class="row gutter-sm">
              <div class="col-2 col-sm-4 text-right">
                <q-icon name="location_on" size="4em"/>
              </div>
              <div class="col-10 col-sm-8">
                <p class="text-h5">{{ place.title }}</p>
                <p>{{ place.address.address }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "homeLocations",
    props: {
      slug: {default: null}
    },
    beforeRouteLeave(to, from, next) {
      // closing modal details if is opened
      if (!this.openedDialog) {
        next()
      } else {
        this.openedDialog = false
        next(false)
      }
    },
    mounted() {
    },
    data() {
      return {
        openedDialog: false
      }
    },
    computed:{
      category(){
        return this.$store.state.qcrudMaster.show[`qplace-places-${this.slug}`].data
      }
    },
    methods: {
      gotoTel: function (tel) {
        window.location.href = "tel:" + tel;
      }
    }
  }
</script>

<style lang="stylus">
  .location-title
    top -30px
    left 0

  .place-content
    cursor pointer
    background-color rgba(0, 0, 0, .7)

  .home-locations
    min-height 310px
    background-attachment: fixed;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
</style>
