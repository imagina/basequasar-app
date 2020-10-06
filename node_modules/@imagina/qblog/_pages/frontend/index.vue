<template>
   <div id="indexBlog1" class="relative-position">
      <!-- BANNER -->
      <div id="bannerIblog" v-if="category">
         <div class="q-container">
            <!--BreadCrum-->
            <q-breadcrumbs active-color="primary" color="light" align="right">
               <!-- Separator -->
               <q-icon name="fas fa-angle-right" slot="separator" slot-scope="props"/>
               <!-- Route Home -->
               <q-breadcrumbs-el label="Inicio" :to="{name : 'app.home'}" icon="home"/>
               <!-- To category -->
               <q-breadcrumbs-el :label="$route.params.category.split('-').join(' ')"/>
            </q-breadcrumbs>
            <!--Title-->
            <h1 class="q-ma-none text-h5 bg-white q-pa-lg title-container text-uppercase text-grey-9">
               <label>{{category.title}}</label>
            </h1>
         </div>
      </div>
<pre>

</pre>
      <!-- Contend -->
      <div class="q-container relative-position">
         <div class="contentDescription q-col-gutter-md row q-py-lg q-px-sm" v-if="category && category.posts">
            <div class="col-12 col-md-4 col-lg-3" :key="key"
                 v-for="(post,key) in category.posts">
               <q-card inline style="width: 100%" flat>
                  <!--Media-->
                  <router-link :to="{name: 'qblog.show',params:{category: post.category.slug, slugPost: post.slug}}">
                     <div class="img" :style="'background-image: url('+post.mainImage.path+')'"></div>
                  </router-link>
                  <!--Date-->
                  <q-card-actions class="q-px-sm q-pb-md">
                     <p class="q-mb-none">
                        {{ $trd(post.createdAt) }}
                     </p>
                  </q-card-actions>
                  <q-separator class="q-ml-sm"/>
                  <q-card-section class="q-pa-sm">
                     <router-link
                             :to="{name: 'qblog.show',params:{category: post.category.slug, slugPost: post.slug}}">
                        <h2 class="q-ma-none text-primary text-h6 text-weight-bold">
                           {{post.title}}
                        </h2>
                     </router-link>
                  </q-card-section>
                  <q-card-section class="q-pa-none">
                     <p class="q-pa-sm text-justify">
                        {{post.summary}}
                     </p>
                  </q-card-section>
               </q-card>
            </div>
         </div>

         <!--Not results-->
         <not-results v-else/>
      </div>
   </div>
</template>

<script>
   export default {
      preFetch({store, currentRoute, previousRoute, redirect, ssrContext}) {
         return new Promise(async resolve => {
            let category = currentRoute.params.category || false
            await store.dispatch('qcrudMaster/SHOW', {
               indexName: `qblog-categories-${category}`,
               criteria: category,
               apiRoute: 'apiRoutes.qblog.categories',
               requestParams: {refresh: true, params: {include: 'posts'}}
            })
            resolve(true)
         })
      },
      meta() {

         let routetitle = this.$route.params.category || 'productos'
         let siteName = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-name')
         let siteDescription = this.$store.getters['qsiteSettings/getSettingValueByName']('core::site-description')
         let iconHref = this.$store.getters['qsiteSettings/getSettingMediaByName']('isite::favicon').path
         //Set category data
         let category = this.$store.state.qcrudMaster.show[`qblog-categories-${routetitle}`].data
         if (category) {
            routetitle = category.title
            siteDescription = category.summary
         }
         return {
            title: `${routetitle.charAt(0).toUpperCase() + routetitle.slice(1)} | ${siteName}`,
            meta: {
               description: {name: 'description', content: (siteDescription || siteName)},
            },
         }
      },
      data() {
         return {
            category: this.$store.state.qcrudMaster.show[`qblog-categories-${this.$route.params.category}`].data,
         }
      }
   }
</script>

<style lang="stylus">
   #indexBlog1
      .q-card
         .img
            background-size cover
            background-position center
            background-repeat no-repeat
            height 230px
            width 100%

         .q-separator
            background $secondary
            height 5px
            width 30%

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



