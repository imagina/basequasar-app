<template>
  <div id="pageId">
    <!---Component CRUD-->
    <crud :crud-data="import('@imagina/qform/_crud/crudForms')" />
  </div>
</template>
<script>
  export default {
    props: {},
    components: {},
    watch: {},
    validations() {
      return {}
    },
    mounted() {
      this.$nextTick(function () {
      })
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>
