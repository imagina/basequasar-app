<template>
  <div id="postBlogComponent" v-if="category">
    <div class="text-h6 text-center text-uppercase">
      {{category.title}}
    </div>

    <div class="full-width q-px-md">
      <!--Not results-->
      <not-result v-if="!category.posts || !category.posts.length"/>
      <!--List-->
      <q-list class="q-pa-none" v-else bordered separator>
        <q-item :key="key" clickable v-for="(post, key) in category.posts"
                :to="{name: 'qblog.show', params : {category : category.slug, slugPost: post.slug}}">
          <q-item-section>
            <label>{{post.title}}</label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      categorySlug: {default: false}
    },
    computed:{
      category(){
        let category = this.$store.state.qcrudMaster.show[`qblog-categories-${this.categorySlug}`]
        return category.data || false
      }
    }

  }
</script>
<style lang="stylus">
</style>
