<template>
  <div id="masterIblog">
    <!--= BANNER =-->
    <banner-component :dataBanner="dataIblog"
                      v-if="component.banner">
    </banner-component>

    <div class="relative-position">
      <!--INDEX-->
      <index-component :categories="dataIblog"
                       v-if="component.index">
      </index-component>

      <!--SHOW-->
      <show-component :dataPost="dataIblog"
                      v-if="component.show">
      </show-component>

      <!--404-->
      <not-found v-if="component.notFound"></not-found>

      <!--Inner Loading-->
      <inner-loading :visible="innerLoading" />
    </div>
  </div>
</template>

<script>
  /*Component*/
  import bannerComponent from '@imagina/qblog/_components/widgets/widget-banner'
  import indexComponent from '@imagina/qblog/_components/index'
  import showComponent from '@imagina/qblog/_components/show'
  import notFound from 'src/components/404'
  import innerLoading from 'src/components/master/innerLoading'

  /*Services*/
  import categoriesServices from '@imagina/qblog/_services/categories'
  import postsServices from '@imagina/qblog/_services/posts'

  export default {
    preFetch({store, currentRoute, previousRoute, redirect, ssrContext}) {
      return store.dispatch('qblogMaster/BLOG_SHOW', currentRoute)
    },
    meta() {
      return {
        title: this.metaData.siteName,
        meta: {
          description: {name: 'description', content: this.metaData.summary},
          //Schema.org para Google+
          itemprop: {itemprop: "name", content: this.metaData.title},
          itemprop1: {itemprop: "description", content: this.metaData.summary},
          itemprop2: {itemprop: "image", content: this.metaData.image},
          //Open Graph para Facebook
          property: {property: "og:title", content: this.metaData.title},
          property1: {property: "og:type", content: "article"},
          property2: {property: "og:image", itemprop: "image", content: this.metaData.image},
          property3: {property: "og:image:secure_url", itemprop: "image", content: this.metaData.image},
          property4: {property: "og:url", content: this.metaData.url},
          property5: {property: "og:description", content: this.metaData.summary},
          property6: {property: "og:site_name", content: this.metaData.siteName},
          property7: {property: "og:locale", content: "es_ES"},
          //Twitter Card
          name: {name: "twitter:card", content: "summary_large_image"},
          name1: {name: "twitter:site", content: this.metaData.siteName},
          name2: {name: "twitter:title", content: this.metaData.title},
          name3: {name: "twitter:description", content: this.metaData.summary},
          name4: {name: "twitter:creator", content: ""},
          name5: {name: "twitter:image:,src", content: this.metaData.image},
        },
      }
    },
    components: {
      bannerComponent,
      indexComponent,
      showComponent,
      notFound,
      innerLoading
    },
    watch: {
      $route(to, from) {
        this.innerLoading = true
        this.$store.dispatch('qblogMaster/BLOG_SHOW', this.$route).then(response => {
          this.dataIblog = this.$store.state.qblogMaster.dataIblog
          this.innerLoading = false
        })
      },
    },
    data() {
      return {
        dataIblog: this.$store.state.qblogMaster.dataIblog,
        innerLoading: false,
      }
    },
    mounted() {
      this.$nextTick(function () {})
    },
    computed: {
      /**
       * Order the meta data
       */
      metaData() {
        let data = this.$store.state.qblogMaster.dataIblog

        return {
          siteName: (data && data.title) ? data.title + ' | ' + env('TITLE') : 'not found',
          title: (data && data.title) ? data.title : 'not found',
          summary: (data && data.summary) ? data.summary : 'not found',
          image: (data && data.mainimage) ? data.mainimage : 'not found',
          url: data ? env('URL')+this.$route.path : 'not found'
        }
      },
      /**
       * Select Component to show according to data
       */
      component() {
        let data = this.$store.state.qblogMaster.dataIblog
        let show = {
          notFound: false,
          index: false,
          show: false,
          banner: false
        }

        if(data){
          show.banner = true
          // Condition for select component Index
          if (data.children && data.children.length) {
            show.index = true
          }

          // Condition for select component Show
          if ((data.children && !data.children.length) || !data.children) {
            show.show = true
          }
        }else{
          show.notFound = true
        }

        return show
      }
    },
  }
</script>

<style lang="stylus">
</style>
