<template>
  <div class="backend-page row q-col-gutter-x-md">
    <div class="col-md-5">
      <div class="box">
        <formOptions/>
      </div>
    </div>
    <div class="col-md-7">
      <div class="box">
        <indexValuesByOptions/>
      </div>
    </div>
  </div>
</template>

<script>
  // Components
  import formOptions from '@imagina/qcommerce/_components/admin/options/form'
  import indexValuesByOptions from '@imagina/qcommerce/_components/admin/optionValues/indexValuesByOptions'

  export default {
    components: {
      formOptions,
        indexValuesByOptions
    }
  }
</script>
