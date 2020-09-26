<template>
  <div id="postComponent" v-if="posts.length" :class="$q.platform.is.desktop ? 'desktop' : 'mobile'">
    <div class="q-container full-height">
      <div class="row full-height items-center">
        <div class="col-12">
          <!--Category title-->
          <h4 class="text-left text-grey-9 q-my-md text-weight-light" v-if="posts.length">
            {{posts[0].category.title}}
          </h4>
          <q-no-ssr>
            <!--Carousel-->
            <carousel autoplay loop
                      v-if="category && posts.length"
                      :autoplayTimeout="4000"
                      :perPage="$q.platform.is.desktop ? 2 : 1"
                      :paginationEnabled="false"
                      :navigationEnabled="$q.platform.is.desktop ? true : false"
                      navigationNextLabel="<i class='fas fa-angle-right'></i>"
                      navigationPrevLabel="<i class='fas fa-angle-left'></i>">
              <!--POSTS-->
              <slide v-for="(post, index) in posts" :key="index">
                <router-link
                  :to="{name : 'qblog.show', params : {category : post.category.slug, slugPost : post.slug}}"
                  class="text-secondary">
                  <div class="row q-col-gutter-sm">
                    <div class="col-12 col-md-6">
                      <div class="img" :style="'background-image: url('+post.mainImage.path+')'"></div>
                    </div>
                    <div class="col-12 col-md-6 text-justify text-grey-8">
                      <div class="text-h6 q-mb-sm">{{post.title}}</div>
                      <p v-html="post.summary"></p>
                    </div>
                  </div>
                </router-link>
              </slide>
            </carousel>
          </q-no-ssr>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      category: {default: false},
      dataPosts: {default: false}
    },
    components: {},
    watch: {
      category(data) {
        if (!this.posts && this.category) this.getPosts()
      },
      dataPosts() {
        this.posts = this.dataPosts
      }
    },
    mounted() {
      this.$nextTick(function () {
        if ((!this.posts.length) && this.category)
          this.getPosts()
      })
    },
    data() {
      return {
        posts: []
      }
    },
    computed: {
      categorySlug() {
        return this.category.parent ? this.category.parent.slug : this.category.slug
      }
    },
    methods: {
      getPosts() {
        let parameters = {
          params: {
            filter: {categoryId: this.category.id},
            include: 'category,categories'
          }
        }

        this.$crud.index('apiRoutes.qblog.posts', parameters).then((response) => {
          this.posts = response.data
        }).catch(error => {
        })
      }
    }

  }
</script>
<style lang="stylus">
  #postComponent
    text-align center

    .img
      height 192px
      width 100%
      background-position center
      background-size cover
      background-repeat: no-repeat;
      border 1px solid $grey-3

    .VueCarousel
      margin-bottom 17px

      .VueCarousel-slide
        padding 0 15px

        a
          text-decoration none

        .title
          position relative
          padding-top 10px
          text-align left

          .q-icon
            position absolute
            left 10px
            top 20px

          .q-btn
            text-align left
            padding-left 40px

            .q-focus-helper
              display none
        @media screen and (max-width: $breakpoint-md)
          padding 0 60px !important

      .VueCarousel-navigation
        padding 20px auto

        .VueCarousel-navigation-button
          font-size 31px
          color $secondary

</style>
