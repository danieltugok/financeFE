<template>
    <q-card :style="{ height: `${size.height}px` }" class="no-scroll">
        <div class="absolute-center" style="min-width: 300px;">
            <q-item class="text-h4">
                <q-item-section class="text-center">
                    <q-item-label class="text-weight-bold number"><vue3-autocounter :startAmount="0"
                            :endAmount="itemsSold" :duration="1" :autoinit="true" separator="." /></q-item-label>
                    <q-item-label class="text-caption" lines="2">Quantidade total de itens</q-item-label>
                </q-item-section>
            </q-item>
        </div>
    </q-card>
    <div class="absolute-center fit z-top flex flex-center" :class="Dark.isActive ? 'bg-grey-10' : 'bg-white'"
        v-show="loading"> <q-spinner-oval color="primary" size="5.5em" />
    </div>
</template>
<script lang="ts" setup>
import { getWidgetByTypeService } from 'src/services/transactionServices';
import { defineProps, ref, watch } from 'vue';
import Vue3Autocounter from 'vue3-autocounter';
import { Dark } from 'quasar'
import { useDashboardComposable } from 'src/composables/dashboardComposable';
import type { QueryParameters } from 'src/utils/helpers';

defineProps({
    item: {
        type: Object,
        required: true,
    },
    size: {
        type: Object,
        required: true
    },
});
const { filterDashboard } = useDashboardComposable()
const loading = ref<boolean>(false)
const itemsSold = ref<any>(0)

async function getItemsSoldTransactions(query: QueryParameters = {}): Promise<void> {
    loading.value = true
    try {
        const { status, data } = await getWidgetByTypeService('quantity', query) // redraw map to remove markers
        if (status === 200) itemsSold.value = +data

    } catch (error: any) {
        console.log(error?.response?.data?.message)
    } finally {
        loading.value = false
    }
}
watch(filterDashboard, (value) => {
    getItemsSoldTransactions(value)
})

getItemsSoldTransactions()
</script>