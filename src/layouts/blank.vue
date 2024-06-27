<template>
  <q-layout view="lHh LpR fFf">
    <!-- === ROUTER VIEW === -->
    <drawersBlank />
    <q-page-container>
      <router-view />
    </q-page-container>

    <!---Cropper-->
    <cropper-component ref="cropperComponent"/>
  </q-layout>
</template>

<script>
import drawersBlank from 'src/modules/qsite/_components/admin/theme2/drawersBlank.vue';
import cropperComponent from 'src/modules/qsite/_components/master/cropper.vue';
import metaDataMixin from './metaDataMixin';

export default {
  name: 'blankLayout',
  components: {
    drawersBlank,
    cropperComponent
  },
  mixins: [metaDataMixin],
  computed: {}
};
</script>
