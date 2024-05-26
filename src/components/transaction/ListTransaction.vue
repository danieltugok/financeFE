<template>
    <q-table :rows="transactions" row-key="id" :key="Date.now()" flat :columns="columns" :pagination="pagination"
        hide-pagination class="table-card bg-transparent" @row-click="onDetaill">
        <template #body-cell-amount="props">
            <q-td :props="props">
                <q-chip :label="`R$ ${formatPrice(props.row.debit)}`" square text-color="white"
                    :color="props.row.debit > 0 ? 'positive' : 'negative'" />
            </q-td>
        </template>
    </q-table>
    <div class="row item-center q-mt-sm">
        <div class="row item-center q-mt-sm" :class="$q.screen.lt.sm ? 'justify-center' : 'justify-center'"
            v-if="countTransactions > pagination.rowsPerPage">
            <q-pagination v-if="pagination.rowsPerPage !== 0" v-model="page" :max="pagesNumber"
                :max-pages="$q.screen.lt.sm ? 4 : 9" active-design="unelevated"
                :color="$q.dark.isActive ? 'white' : 'dark'" active-color="primary" direction-links gutter="sm" />
        </div>
        <q-space />
        <q-select class="tw-min-w-[120px]" v-model="perPage" :options="perPageOptions" label="Per Page" outlined dense
            map-options emit-value dropdown-icon="sym_r_expand_more" color-icon
            :bg-color="$q.dark.isActive ? 'grey-9' : 'grey-1'" />
    </div>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { QTableProps } from 'quasar';
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { formatPrice } from 'src/utils/helpers'

const route = useRouter()
const { getTransactions, transactions, queryTransaction, setQueryTransaction, countTransactions } = useTransactionComposable()
const page = ref<number>(1);
const perPage = ref<number>(10);

// const pagination = ref<any>({
//     rowsPerPage: +perPage.value,
//     sortBy: 'created_at',
//     descending: true
// })

const pagination = computed<any>({
    get: () => {
        return {
            rowsPerPage: +perPage.value,
            sortBy: 'created_at',
            descending: true
        }
    },
    set: (value) => {
        pagination.value = value
    }
})

// ref<any>({
//     rowsPerPage: +perPage.value,
//     sortBy: 'created_at',
//     descending: true
// })

const perPageOptions = [
    { label: '10', value: 10 },
    { label: '20', value: 20 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
]
const columns = ref<QTableProps['columns']>([
    // {
    //     name: 'id',
    //     required: true,
    //     label: 'ID',
    //     align: 'left',
    //     field: 'id',
    // },
    {
        name: 'user',
        required: true,
        label: 'User',
        align: 'left',
        field: row => row.user.name,
        format: val => `${val}`,
        sortable: true
    },
    { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: true },
    { name: 'amount', align: 'left', label: 'Amount', field: 'debit', format: val => `R$ ${val}`, sortable: true },
    { name: 'date', align: 'left', label: 'Date', field: 'date', format: val => date.formatDate(val, 'DD/MM/YYYY'), sortable: true },
    // { name: 'created_at', align: 'left', label: 'Created at', field: 'created_at', format: val => date.formatDate(val, 'DD/MM/YYYY HH:mm') },
])
const pagesNumber = computed<number>(() => Math.ceil((countTransactions.value || 0) / pagination.value.rowsPerPage))
function onDetaill(event: Event, row: any): void {
    route.push({ name: 'TransactionDetail', params: { id: row.id } })
}
watch(() => [page.value, perPage.value], () => {
    const query = {
        page: page.value,
        perPage: pagination.value.rowsPerPage,
    }
    setQueryTransaction({ ...queryTransaction.value, ...query })
    getTransactions(queryTransaction.value)
})

getTransactions(queryTransaction.value)

</script>