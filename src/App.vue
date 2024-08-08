<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App',
  mounted ()
  {
    this.$q.iconSet.arrow.dropdown = 'fa fa-caret-down';
    this.$q.iconSet.expansionItem.icon = 'fa fa-chevron-down';
  }
});
</script>
