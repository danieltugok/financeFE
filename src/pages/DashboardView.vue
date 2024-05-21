<template>
  <q-page padding>
    <q-toolbar>
      <q-toolbar-title>
        Dashboard
      </q-toolbar-title>
      <div class="row q-gutter-md items-center">
        <q-select v-model="dashboardSelect" :options="dashboards" option-label="name" option-value="id"
          :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" style="width: 220px;" dense outlined label-color="white"
          dropdown-icon="sym_r_expand_more" transition-show="flip-up" transition-hide="flip-down" />
        <input-date-ranger @update="setFilterDashboard" dense borderless clearable style="width: 250px;" outlined
          :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" />
      </div>
    </q-toolbar>
    <grid-layout />

    <!-- <div class="row q-col-gutter-sm q-my-md">
      <div class="col-md-6 col-xs-12">
        <q-card>
          <apex-area />
        </q-card>
      </div>
      <div class="col-md-6 col-xs-12">
        <q-card>
          <apex-line />
        </q-card>
      </div>
      <div class="col-md-6 col-xs-12">
        <q-card>
          <apex-bar />
        </q-card>
      </div>
    </div> -->
  </q-page>
</template>

<!-- <script lang="ts">
import { defineComponent, defineAsyncComponent } from 'vue';

const ApexBar = defineAsyncComponent(() =>
  import('src/components/charts/bar/ApexBar.vue')
)
const ApexArea = defineAsyncComponent(() =>
  import('src/components/charts/area/ApexArea.vue')
)
const ApexLine = defineAsyncComponent(() =>
  import('src/components/charts/line/ApexLine.vue')
)

export default defineComponent({
  name: 'DashboardView',
  components: {
    ApexArea,
    ApexLine,
    ApexBar
  }
})
</script> -->

<script setup lang="ts">
import { computed } from 'vue'
import GridLayout from 'src/components/dashboard/GridLayout.vue'
import { useDashboardComposable } from 'src/composables/dashboardComposable';
import InputDateRanger from 'src/components/InputDateRanger.vue';
const { setFilterDashboard, dashboards, dashboard, setDashboard } = useDashboardComposable()
const dashboardSelect = computed({
  get: () => dashboard.value,
  set: (value) => {
    setDashboard(value)
  }
})
</script>