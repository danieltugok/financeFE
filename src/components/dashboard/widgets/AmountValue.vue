<template>
    <q-card :style="{ height: `${size.height}px` }" class="no-scroll tw-relative">
        <div class="absolute-center" style="min-width: 300px;">
            <q-item class="text-h4">
                <q-item-section class="text-center">
                    <q-item-label class="text-weight-bold number">
                        <q-icon v-if="item.content.icon" :name="item.content.icon" :color="item.content.status" />
                        R$ <vue3-autocounter :startAmount="0" :endAmount="+amountValue?.debit" :duration="1"
                            :autoinit="true" separator="." /></q-item-label>
                    <q-item-label class="text-caption" lines="2">
                        <span class="tw-text-neutral-500">{{ date.formatDate(amountValue?.date, 'DD/MM/YYYY')
                            }}</span><br>
                        {{ amountValue?.description }}
                    </q-item-label>
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
    query.orderBy = 'debit';
    if (props.item.content.status == 'positive') query.sortBy = 'desc';
    else query.sortBy = 'asc';

    await getTransactions({ ...queryTransaction.value, ...query, perPage: 1 })
    if (props.item.content.status === 'negative' && transactions.value[0]?.debit > 0) {
        amountValue.value = {
            debit: 0,
            description: '-',
            date: '-'
        }
    } else if (props.item.content.status === 'positive' && transactions.value[0]?.debit < 0) {
        amountValue.value = {
            debit: 0,
            description: '-',
            date: '-'
        }
    } else amountValue.value = transactions.value[0]
    loading.value = false
}

watch(filterDashboard, (value) => {
    getAmountValueTransactions({ ...value, ...queryTransaction.value })
}, { immediate: true })

// getAmountValueTransactions()
</script>