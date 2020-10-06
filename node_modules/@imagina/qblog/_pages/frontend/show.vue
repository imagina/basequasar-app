<template>
   <div id="showIblog" class="relative-position">
      <div id="bannerIblog" v-if="post">
         <div class="q-container">
            <!--BreadCrum-->
            <q-breadcrumbs active-color="primary" color="light" align="right">
               <!-- Separator -->
               <q-icon name="fas fa-angle-right" slot="separator" slot-scope="props"/>
               <!-- Route Home -->
               <q-breadcrumbs-el label="Inicio" :to="{name : 'app.home'}" icon="home"/>
               <!-- To category -->
               <q-breadcrumbs-el :label="post.category.title"
                                 :to="{name : 'qblog.index', params : {category: post.category.slug}}"/>
               <!-- To Post -->
               <q-breadcrumbs-el :label="post.title"/>
            </q-breadcrumbs>
            <!--Title-->
            <h1 class="q-ma-none text-h5 bg-white q-pa-lg title-container text-uppercase text-grey-9">
               <label>{{post.title}}</label>
            </h1>
         </div>
      </div>

      <!--content-->
      <div class="q-container relative-position" v-if="post">
         <div class="row q-py-xl">
            <!--Post-->
            <div class="post col-12 col-lg-8">
               <!--Image-->
               <div class="img" :style="'background-image: url('+post.mainImage.path+')'"></div>

               <!--Description-->
               <div class="description q-px-sm" v-html="post.description"></div>

               <!--Autor-->
               <div class="autor q-headline">
                  <span class="text-primary">{{post.editor.first_name+' '+post.editor.last_name}}</span>, Autor
               </div>
            </div>

            <!--Other Posts-->
            <div class="col-12 col-lg-4 desktop-only">
               <posts-component :category-slug="$route.params.category"/>
            </div>

            <inner-loading :visible="loading"/>
         </div>
      </div>
   </div>
</template>

<script>
   /*Component*/
   import commentComponent from '@imagina/qsite/_components/master/commentsFB'
   import postsComponent from '@imagina/qblog/_components/widgets/widget-post-blog'

   export default {
      preFetch({store, currentRoute, previousRoute, redirect, ssrContext}) {
         return new Promise(async resolve => {
            //Get data post
            let postSlug = currentRoute.params.slugPost || false
            await store.dispatch('qcrudMaster/SHOW', {
               indexName: `qblog-posts-${postSlug}`,
               criteria: postSlug,
               apiRoute: 'apiRoutes.qblog.posts',
               requestParams: {refresh: true, params: {include: 'category,user'}}
            })
            //Get list related posts
            let categorySlug = currentRoute.params.category || false
            await store.dispatch('qcrudMaster/SHOW', {
               indexName: `qblog-categories-${categorySlug}`,
               criteria: categorySlug,
               apiRoute: 'apiRoutes.qblog.categories',
               requestParams: {refresh: true, params: {}}
            })
            resolve(true)
         })
      },
      meta() {
         let postSlug = this.$route.params.slugPost
         let routetitle = postSlug || 'productos'
         let siteName = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-name')
         let siteDescription = this.$store.getters['qsiteApp/getSettingValueByName']('core::site-description')
         //Set category data
         let post = this.$store.state.qcrudMaster.show[`qblog-posts-${postSlug}`].data
         if (post) {
            routetitle = post.title
            siteDescription = post.summary
         }
         return {
            title: `${routetitle.charAt(0).toUpperCase() + routetitle.slice(1)} | ${siteName}`,
            meta: {
               description: {name: 'description', content: (siteDescription || siteName)},
            },
         }
      },
      components: {
         commentComponent,
         postsComponent
      },
      watch: {
         '$route.params'() {
            this.getData()
         },
      },
      data() {
         return {
            post: this.$store.state.qcrudMaster.show[`qblog-posts-${this.$route.params.slugPost}`].data,
            loading: false
         }
      },
      computed: {
         post() {
            let postSlug = this.$route.params.slugPost
            let post = this.$store.state.qcrudMaster.show[`qblog-posts-${postSlug}`]
            return post.data || false
         }
      },
      methods: {
         async getData() {
            this.loading = true

            let postSlug = this.$clone(this.$route.params.slugPost)
            await this.$store.dispatch('qcrudMaster/SHOW', {
               indexName: `qblog-posts-${postSlug}`,
               criteria: postSlug,
               apiRoute: 'apiRoutes.qblog.posts',
               requestParams: {refresh: true, params: {include: 'categories,user'}}
            })
            this.loading = false
         },
      },
   }
</script>

<style lang="stylus">
   #showIblog
      .post
         .title
            font-size 34px
            color $dark
            margin-top 0
            @media screen and (max-width: $breakpoint-md)
               font-size 24px
               text-align center

         .img
            height 400px
            width 100%
            position relative
            background-repeat no-repeat
            background-position center
            background-size cover

            span
               padding 5px
               position absolute
               top 0px
               left 20px
               line-height 1.5

               h4
                  margin 0

         .autor
            padding 15px 8px
            margin-bottom 25px
            border-top: 1px solid $grey-5
            border-bottom: 1px solid $grey-5

         .description
            margin 30px 0px

            p
               line-height 1.6
               text-align justify

      iframe
         width 100% !important

      #bannerIblog
         background-color $grey-4
         padding 5px

         .title-container
            border-top-right-radius 50px
            width max-content

            label
               font-weight bold !important
               border-bottom: 5px solid $secondary
</style>


name: "show"
