<template>
  <div id="marcasComponent"
       v-if="slides && slides.length"
       :class="$q.platform.is.desktop ? 'desktop' : 'mobile'">
    <div class="q-container full-height">
      <div class="row full-height items-center">
        <div class="col-12">
          <carousel autoplay loop
                    :autoplayTimeout="$q.platform.is.desktop ? 4000 : 2000"
                    :perPage="$q.platform.is.desktop ? 5 : 1"
                    :paginationEnabled="false"
                    :navigationEnabled="$q.platform.is.desktop ? true : false"
                    navigationNextLabel="<i class='fas fa-angle-right'></i>"
                    navigationPrevLabel="<i class='fas fa-angle-left'></i>">
            <slide v-for="(slide, key) in slides" :key="key">
              <img :src="slide.imageUrl"></img>
            </slide>
          </carousel>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  /*Services*/
  import sliderServices from '@imagina/qslider/_services/slider'
  export default {
    props: {
      id : {default: 2}
    },
    components: {},
    watch: {},
    mounted() {
      this.$nextTick(function () {
        this.getData()
      })
    },
    data() {
      return {
        slides : []
      }
    },
    methods: {
      getData(){
        sliderServices.show(this.id).then((response) => {
          this.slides = response.data
        })
      }
    }
  }
</script>
<style lang="stylus">
  #marcasComponent
    text-align center
    border-top 1px solid $grey-11
    &.desktop
      height 190px
    img
      filter: grayscale(100%);
      &:hover
        filter none
    .VueCarousel-navigation
      padding 20px auto
      .VueCarousel-navigation-button
        font-size 31px
      i
        color $grey-6 !important
</style>
