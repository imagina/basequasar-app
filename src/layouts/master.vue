<template>
  <component :is="layoutComponent" />
</template>
<script>
export default {
  name: 'masterLayout',
  data() {
    return {
      appConfig: config('app'),
    };
  },
  computed: {
    layoutComponent() {
      return this.appConfig.productFrom
        ? require(`modules/${this.appConfig.productFrom}/_product/layout`).default
        : require('layouts/iadmin').default;
    },
  },
};
</script>
