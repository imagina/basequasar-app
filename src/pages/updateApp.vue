<template>
  <div class="tw-flex tw-justify-center tw-items-center tw-bg-gray-100 tw-h-screen">
    <div class="tw-max-w-xl tw-bg-white tw-p-6 tw-mx-5 tw-rounded-xl tw-shadow-lg">
      <div class="text-center">
        <q-icon :name="content.icon" size="xl" color="secondary" />
        <div class="tw-text-2xl tw-font-bold tw-my-5 text-blue">
          {{ i18n.tr(content.title) }}
        </div>
      </div>
      <p class="tw-text-base tw-font-medium text-justify">
        {{ i18n.tr(content.message) }}
      </p>
      <q-linear-progress rounded size="8px" indeterminate color="secondary" class="tw-mt-7" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { i18n, store, router, cache } from 'src/plugins/utils';

const route = useRoute();
const fromCache = route.query.fromCache;
const content = ref({
  title: fromCache ? 'isite.cms.label.cacheCleanup' : 'isite.cms.messages.updateAvailable',
  message: fromCache ? 'isite.cms.messages.cacheCleanupMessage' : 'isite.cms.messages.refreshAppVersion',
  action: fromCache ? 'isite.cms.label.clear' : 'isite.cms.messages.updateNow',
  icon: fromCache ? 'fas fa-broom' : 'fa-regular fa-rocket-launch'
});

onMounted(async () => await update());

const update = async () =>
{
  await Promise.allSettled([
    store.dispatch('qsiteApp/REFRESH_PAGE'),
    store.dispatch('qsiteApp/CLEAR_CACHE_STORAGE'),
    store.dispatch('qsiteApp/DELETE_SW'),
    route.query.version ? cache.set('api.version', route.query.version) : null
  ]);
  window.location.reload()
};
</script>
