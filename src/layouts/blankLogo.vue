<template>
  <q-layout id="layoutBlankLogo" view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <q-page-container>
      <!--Logo-->
      <div class="wrapp__logo logo-bg-primary">
        <img :src="settings.logo" />
      </div>
      <!--Router-->
      <div id="routerPageContent" class="layout-padding">
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import metaDataMixin from './metaDataMixin';

export default {
  mixins: [metaDataMixin],
  computed: {
    //Settings
    settings() {
      let response = {
        logo: this.$store.state.qsiteApp.logo
      };
      //response
      return response;
    }
  }
};
</script>

<style lang="scss">
#layoutBlankLogo {
  background-color: $custom-accent-color;

  .wrapp__logo {
    text-align: center;
    position: relative;
    height: 145px;
    max-height: 270px;
    padding: 30px 15px;
    border-radius: 10px;
    overflow: hidden;

    img {
      margin-left: auto;
      margin-right: auto;
      max-height: 100px;
      max-width: 100%;
    }
  }
}
</style>
