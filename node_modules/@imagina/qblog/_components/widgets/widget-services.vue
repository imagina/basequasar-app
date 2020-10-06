<template>
  <div id="serviciosComponent" v-if="getData.posts.length"
       :class="'bg-widget-services ' + (this.$q.platform.is.desktop ? 'desktop' : 'mobile')">
    <div class="overlay"></div>
    <div class="q-container full-height">
      <div class="row items-center full-height gutter-x-lg">

        <div class="block col-12 col-md-6 col-lg-4"
             v-for="(post, key) in getData.posts" :key="key">
          <!--IMG-->
          <div class="content">
            <router-link :to="'/'+getData.category.slug+'/'+post.slug" class="link">
              <div class="img text-center row items-center"
                   :style="'background-image: url('+post.mainimage+')'">
                <div class="col-12">
                  <img :src="post.options['media-icon']"
                       v-if="post.options['media-icon']"
                       class="hidden"
                       width="74px"
                       alt="reparación">
                </div>
              </div>
              <div class="title">
                {{post.title}}
              </div>
            </router-link>
          </div>

          <!--SLUG-->
          <h6 v-html="post.summary"></h6>

          <!-- BUTTON-->
          <q-btn label="Ver más" :to="'/'+getData.category.slug+'/'+post.slug"
                 color="secondary" rounded
                 icon-right="fas fa-arrow-right">
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        category: false,
        posts: []
      }
    },
    computed: {
      getData() {
        let widgets = this.$store.state.qblogMaster.widgets
        let category = false
        let posts = []

        if(widgets.servicesHome){
          category = widgets.servicesHome
          posts = widgets.servicesHome.posts
        }

        return {category : category, posts: posts}
      }
    }

  }
</script>
<style lang="stylus">
  #serviciosComponent
    width 100%
    position relative
    &.desktop
      height 695px
    @media screen and (max-width: $breakpoint-md)
      height auto !important
    .overlay
      position absolute
      background-color #e0e0e030
      width 100%
      height 100%
    .block
      text-align center
      padding-top 40px
      padding-bottom 40px

      .content
        padding 5px
        background-color white
        position relative
        box-shadow: 3px 2px 37px -6px rgba(0, 0, 0, 0.85);
        .img
          width 100%
          height 346px
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          @media screen and (max-width: $breakpoint-lg)
            height 200px
        .title
          color $secondary
          font-size 20px
          font-weight bold
          text-transform uppercase
          text-align center

          position absolute
          margin-left auto
          margin-right auto
          left 0
          right 0
          bottom -19px

          background white
          width 205px
          padding 10px 0
          box-shadow: 5px 5px 20px -9px rgba(0, 0, 0, 1);

        &:hover
          .img
            background-image none !important
            background-color $secondary !important
            img
              display block !important
              filter: brightness(0) invert(1);
              margin 0 auto
      h6
        font-size 16px
        color $grey-8
        line-height 1.4
        height 66px
        max-height 66px
        overflow hidden
        padding 0 20px
        @media screen and (max-width: $breakpoint-lg)
          height auto
          margin 30px auto
      .q-btn
        text-transform none
        .q-focus-helper
          display none !important
        &:hover
          background $primary !important
          .content
            .img
              background-image none !important
              background-color $secondary !important
              content "TEST"
</style>
