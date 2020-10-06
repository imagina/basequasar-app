<template>
  <div class="col-12 q-py-md">
    <div class="q-container q-py-xl q-px-md">
      <div class="row items-center">
        <div class="col-12 col-md-6 text-center">
          <!--Title-->
          <h1 class="text-h3 text-primary text-weight-light q-my-sm">
            <router-link :to="{name: 'products.index'}"
                         class="text-primary">
              {{ post.title }}
            </router-link>
          </h1>
          <!--Menu-->
          <h6 class="text-weight-light menu-title q-my-none q-mb-md">
            <router-link :to="{name: 'products.index'}" class="text-primary" v-if="!disableLink">
              VER MENÚ
            </router-link>
          </h6>
        </div>
        <!--Description-->
        <div class="col-12 col-md-6 q-pa-none q-title" v-html="post.description"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "widget-post-full",
    props: {
      slug: {default: ''}
    },
    data() {
      return {
        disableLink: this.$store.getters['qsiteApp/getSettingValueByName']('isite::disableMenuLink')
      }
    },
    computed: {
      post(){
        return this.$store.state.qcrudMaster.show[`qblog-post-${this.slug}`].data || false
      }
    }
  }
</script>

<style lang="stylus">
  .menu-title a
    display inline-block
    padding 0 0 5px
    border-bottom 1px solid $primary
</style>
