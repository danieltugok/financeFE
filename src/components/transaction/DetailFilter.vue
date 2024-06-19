<template>
    <q-card flat style="width: 600px;" bordered>
        <q-toolbar>
            <q-toolbar-title class="text-body1">
                Filter Transactions
            </q-toolbar-title>
            <!-- <q-btn flat round dense icon="sym_r_close" to="/balance" /> -->
            <q-btn flat round dense icon="sym_r_close" @click="closeDetailTransaction" />
        </q-toolbar>
        <q-separator />
        <q-card-section class="q-pt-none">
            <q-list>
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_description" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Sort by</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <div class="q-gutter-md" style="min-width: 300px">
                            <q-select class="tw-min-w-[120px]" v-model="sortBySelect" :options="sortByOptions"
                                label="Sort By" outlined dense map-options emit-value dropdown-icon="sym_r_expand_more"
                                color-icon :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
                        </div>
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section side>
                        <q-icon name="sym_r_payments" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label>Filter by time</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                        <div class="q-gutter-md" style="min-width: 300px">
                            <q-select class="tw-min-w-[120px]" v-model="timeFilterSelect" :options="timeFilterOptions"
                                label="By Time" outlined dense map-options emit-value dropdown-icon="sym_r_expand_more"
                                color-icon :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
                        </div>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-space />
            <div class="row item-center justify-end q-gutter-sm">
                <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated
                    @click="closeDetailTransaction" />
                <q-btn color="primary" class="tw-px-3" :label="$t('ok')" dense unelevated @click="filterTransaction" />
            </div>
        </q-card-section>
    </q-card>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close', 'updated', 'filterTransaction'])
const { transaction, getTransactionById, setTransaction, setTransactionDetail, createTransactionDetail } = useTransactionComposable()

const router = useRouter();

const sortBySelect = ref<string>('date');
const sortByOptions = [
    { label: 'Most Recent', value: 'date' },
    { label: 'High to Low', value: 'debitAsc' },
    { label: 'Low to High', value: 'debitDesc' },
]
const timeFilterSelect = ref<any>(30);
const timeFilterOptions = [
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
    { label: 'Current Year', value: 'Current Year' },
    { label: 'Last Year', value: 'Last Year' },
    // { label: 'All Time', value: 'All Time' },
]

const filterTransaction = async () => {
    emit('filterTransaction', { sortBy: sortBySelect.value, timeFilter: timeFilterSelect.value });
    closeDetailTransaction();
}

const closeDetailTransaction = () => {
    emit('close');
    router.push({ path: '/balance' })
}

</script>