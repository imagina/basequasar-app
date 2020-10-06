<template>
  <div id="pageId" class="q-layout-page layout-padding">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/qcommerce/_crud/coupons')" />
  </div>
</template>

<script>
  export default {
    name: "index"
  }
</script>

<style scoped>

</style>
