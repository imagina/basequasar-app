<template>
  <div id="indexMasterPage" class="relative-position">
    <!--Page Actions-->
    <div class="q-mb-md">
      <page-actions 
        :title="$tr($route.meta.title)" 
        :excludeActions="['refresh']" 
        :tour-name="tourName" 
        @activateTour="$tour.start(tourName)"
      />
    </div>

    <!--Activities-->
    <div id="adminHomeActivities" class="col-12 q-mb-md">
      <activities system-name="admin_home_actions" @loaded="loading = false" view="cardImage" />
    </div>

    <!--Quick cards-->
    <div v-if="quickCards.list1 && quickCards.list1.length">
      <div class="row q-col-gutter-x-md">
        <!-- QuickCards -->
        <div id="quickCardsContent" class="col-12">
          <div class="row q-col-gutter-x-md">
            <div v-for="(groupQuickCard, key) in quickCards" :key="key" class="col-12 col-lg-6">
              <div class="row q-col-gutter-y-md full-width">
                <div v-for="(item, keyItem) in groupQuickCard" :key="keyItem" class="col-12">
                  <component :is="item.component" :key="`component${keyItem}`" v-bind="item.props || {}" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--inner-loading-->
    <inner-loading :visible="loading" />
  </div>
</template>
<script>
import { markRaw } from 'vue';

export default {
  created() {
    this.loading = true;
  },
  mounted() {
    this.$nextTick(function() {
      setTimeout(() => {
        this.loading = false;
        this.setQuickCards();
      }, 1000);
    });
  },
  data() {
    return {
      testSchedule: false,
      loading: false,
      quickCards: {},
      tourName: this.$q.platform.is.desktop ? 'admin_home_tour' : 'admin_home_tour_mobile'
    };
  },
  computed: {},
  methods: {
    async setQuickCards() {
      //Get quick cards
      let quickCards = [];
      let mainConfigs = Object.values(config('main')).map(item => item.quickCards || []);
      mainConfigs.forEach(item => quickCards = quickCards.concat(item));
      //Validate Permissions
      let quickCardsToShow = [];
      for (const card of quickCards) {
        if (!card.permission || this.$hasAccess(card.permission)) {
          let qcComponent = card?.component
          if(typeof qcComponent == 'function') qcComponent = await qcComponent();
          card.component = markRaw(qcComponent.default || qcComponent);
          quickCardsToShow.push(card);
        }
      }

      //Divide quick cards
      let response = {
        list1: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice(0, (quickCardsToShow.length / 2)) : quickCardsToShow,
        list2: (quickCardsToShow.length >= 2) ? quickCardsToShow.slice((quickCardsToShow.length / 2), quickCardsToShow.length) : []
      };
      //Response
      this.quickCards = response;
    }
  }
};
</script>
<style lang="scss">
.flex-break {
  flex: 1 0 100% !important;
  height: 0 !important;
}

.example-container {
  .example-cell {
    margin: 1px;
    padding: 4px 8px;
    box-shadow: inset 0 0 0 2px $grey-6;
  }
}

#indexMasterPage {
  #logoContent {
    min-height: calc(100vh - 200px);
  }
}
</style>
