<!-- eslint-disable @typescript-eslint/no-unused-vars -->

<template>
    <q-page class="wrapper" padding>
        {{ $route.params.id }}
        <q-breadcrumbs v-if="!$q.screen.lt.sm">
            <template v-slot:separator>
                <q-icon size="1.2em" name="chevron_right" color="primary" />
            </template>
            <q-breadcrumbs-el label="Principal" to="/" />
            <q-breadcrumbs-el label="Transações" />
        </q-breadcrumbs>
        <q-toolbar class="q-px-none q-my-sm">
            <q-toolbar-title> Transações </q-toolbar-title>
            <div class="row q-gutter-md items-center">
                <template v-for="item in Object.keys(filterTransaction)" :key="item">
                    <q-chip removable @remove="onRemoveFilter(item)" icon-remove="sym_r_close" :label="item"
                        text-color="white" color="primary" />
                </template>
                <q-input v-model="search" type="search" label="Buscar..." dense outlined
                    :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" debounce="300" clear-icon="sym_r_close"
                    clearable>
                    <template v-slot:prepend>
                        <q-icon name="sym_r_search" />
                    </template>
                </q-input>
                <input-date-ranger @update="onFilterDate" dense outlined clear-icon="sym_r_close" clearable
                    :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" />
                <!-- <q-btn :text-color="$q.dark.isActive ? 'white' : 'dark'" :color="$q.dark.isActive ? 'primary' : 'white'"
                    :icon="filterDialog ? 'sym_r_filter_list_off' : 'sym_r_filter_list'"
                    class="borderless q-card--bordered" @click="setFilterDrawerTransaction(!filterDrawerTransaction)"
                    dense unelevated padding="sm">
                    <q-badge color="secondary" floating v-if="Object.keys(filterTransaction).length > 0">
                        {{ Object.keys(filterTransaction).length }}</q-badge>
                </q-btn> -->
            </div>
        </q-toolbar>
        <list-transaction />
    </q-page>
    <q-dialog v-model="detailDialog" persistent>
        <detail-transaction @close="detailDialog = false"
            :id="typeof $route.params.id === 'string' ? $route.params.id : ''" />
    </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ListTransaction from 'src/components/transaction/ListTransaction.vue'
import InputDateRanger from 'src/components/InputDateRanger.vue'
import DetailTransaction from 'src/components/transaction/DetailTransaction.vue';
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { useRoute } from 'vue-router'

const { getTransactions, queryTransaction, setQueryTransaction, filterTransaction, setFilterTransaction, setFilterDrawerTransaction, filterDrawerTransaction } = useTransactionComposable()
const filterDialog = ref<boolean>(false)
const detailDialog = ref<boolean>(false)
const search = ref<string>('')

const route = useRoute()

watch(search, (value) => {
    setQueryTransaction({ ...queryTransaction.value, description: value })
    getTransactions(queryTransaction.value)
})
watch(() => route.params.id, (newId, oldId) => {
    onOpenDetail()
}, { immediate: true })

function onRemoveFilter(item: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [item]: _, ...rest } = filterTransaction.value
    setFilterTransaction(rest)
    setQueryTransaction({ ...queryTransaction.value, [item]: '' })
    getTransactions(queryTransaction.value)
}
function onFilterDate(date: any): void {
    let { from, to, ...rest } = date;
    from = from ? new Date(from).toISOString() : null;
    to = to ? new Date(to).toISOString() : null;
    let dateParse = { startDate: from, endDate: to, ...rest };

    setQueryTransaction({ ...queryTransaction.value, ...dateParse })
    getTransactions(queryTransaction.value)
}
function onOpenDetail(): void {
    if (route?.params?.id) detailDialog.value = true
    else detailDialog.value = false
}

</script>