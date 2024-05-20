<template>
  <q-page padding>
    DASHBOARD

    <div class="row q-col-gutter-sm q-my-md">
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
    </div>
  </q-page>
</template>

<script lang="ts">
// import GridLayout from '@/components/dashboard/GridLayout.vue'
// import LineChart from 'src/components/charts/LineChart.vue'
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

</script>