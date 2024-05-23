<template>
    <q-card :style="{ height: `${size.height}px` }" class="no-scroll tw-relative">
        <span class="tw-absolute tw-left">{{ date.formatDate(amountValue?.date, 'DD/MM/YYYY') }}</span>
        <div class="absolute-center" style="min-width: 300px;">
            <q-item class="text-h4">
                <q-item-section class="text-center">
                    <q-item-label class="text-weight-bold number">
                        <q-icon v-if="item.content.icon" :name="item.content.icon" :color="item.content.status" />
                        R$ <vue3-autocounter :startAmount="0" :endAmount="+amountValue?.debit" :duration="1"
                            :autoinit="true" separator="." /></q-item-label>
                    <q-item-label class="text-caption" lines="2">{{ amountValue?.description }}</q-item-label>
                </q-item-section>
            </q-item>

        </div>
    </q-card>
    <div class="absolute-center fit z-top flex flex-center " :class="Dark.isActive ? 'bg-grey-10' : 'bg-white'"
        v-show="loading"> <q-spinner-oval color="primary" size="5.5em" />
    </div>
</template>
<script lang="ts" setup>
import { getWidgetByTypeService } from 'src/services/transactionServices';
import { defineProps, ref, watch } from 'vue';
import Vue3Autocounter from 'vue3-autocounter';
import { Dark } from 'quasar'
import type { QueryParameters } from 'src/utils/helpers';
import { useDashboardComposable } from 'src/composables/dashboardComposable';
import { useTransactionComposable } from 'src/composables/transactionComposable';
import { date } from 'quasar'
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    size: {
        type: Object,
        required: true
    },
});
const { filterDashboard } = useDashboardComposable();
const { getTransactions, transactions, queryTransaction } = useTransactionComposable()

const loading = ref<boolean>(false);
const amountValue = ref<any>({});

async function getAmountValueTransactions(query: QueryParameters = {}): Promise<void> {
    loading.value = true
    if (props.item.content.status == 'positive') query.sortBy = 'desc';
    else query.sortBy = 'asc';
    await getTransactions({ ...query, ...queryTransaction.value, perPage: 1 })
    // if (transactions.value.length > 0) amountValue.value = transactions.value[0]
    amountValue.value = transactions.value[0]
    loading.value = false
}

watch(filterDashboard, (value) => {
    getAmountValueTransactions({ ...value, ...queryTransaction.value })
})
getAmountValueTransactions()
</script>