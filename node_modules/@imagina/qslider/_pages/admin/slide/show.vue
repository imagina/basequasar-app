<template>
  <div
    id="pageId"
    class="q-layout-page layout-padding">
    <div class="q-mb-lg backend-page">
      <div class="row">
        <div class="col-12 flex justify-end q-my-sm">
          <q-breadcrumbs>
            <q-breadcrumbs-el label="Sliders" :to="{name: 'qslider.admin.sliders'}"/>
            <q-breadcrumbs-el label="Slider" :to="{name: 'qslider.admin.sliders.show', params:{id:$route.params.sliderId}}"/>
            <q-breadcrumbs-el label="Slide" />
          </q-breadcrumbs>
        </div>
      </div>
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <div class="box">
            <formSlide />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import formSlide from '@imagina/qslider/_components/admin/slide/form'
  
  export default {
    components:{
      formSlide
    }
  
  }
</script>

<style scoped>

</style>
