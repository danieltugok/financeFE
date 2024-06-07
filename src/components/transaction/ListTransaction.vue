<template>
    <q-table :rows="processedTableData" row-key="id" :key="Date.now()" flat :columns="columns" :pagination="pagination"
        hide-pagination class="table-card bg-transparent" @row-click="onDetaill">
        <template #body-cell-amount="props">
            <q-td v-if="props.row.description === 'balance'" :props="props">
                --
                <!-- <q-chip :label="`R$ ${formatPrice(props.row.amount)}`" square text-color="white" /> -->
            </q-td>
            <q-td v-else :props="props">
                <q-chip :label="`R$ ${formatPrice(props.row.debit)}`" square text-color="white"
                    :color="props.row.debit > 0 ? 'positive' : 'negative'" />
            </q-td>
        </template>
        <template #body-cell-delete="props">
            <q-td v-if="props.row.description === 'balance'" />
            <q-td v-else :props="props">
                <q-btn color="white" text-color="negative" icon="delete" dense round unelevated size="11px"
                    @click.stop="onDelete(props.row)" />
            </q-td>
        </template>
        <template #body-cell="props">
            <q-td v-if="props.row.description === 'balance'" class="balance-cell q-gutter-x-sm"
                :class="props.col.name === 'user' ? 'hidden' : ''" :colspan="props.col.name === 'description' ? 2 : 1"
                :props="props">
                <template v-if="props.col.name === 'date'">
                    {{ date.formatDate(props.row.date, 'DD/MM/YYYY') }}
                </template>
                <template v-if="props.col.name === 'description'">
                    {{ props.row.description }}
                </template>
                <template v-if="props.col.name === 'user'">
                    {{ props.row.user.name }}
                </template>
            </q-td>
            <q-td v-else :props="props">
                <template v-if="props.col.name === 'date'">
                    {{ date.formatDate(props.row.date, 'DD/MM/YYYY') }}
                </template>
                <template v-if="props.col.name === 'description'">
                    {{ props.row.description }}
                </template>
                <template v-if="props.col.name === 'user'">
                    {{ props.row.user.name }}
                </template>
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
    <q-dialog v-model="confirmDelete" persistent>
        <q-card>
            <q-card-section class="row items-center">
                <q-avatar icon="delete" color="negative" text-color="white" />
                <span class="q-ml-sm">Are you sure you want to delete the user "{{ deleteTransaction.description }}"
                    ?</span>
            </q-card-section>

            <q-card-actions align="right">
                <q-btn color="primary" :label="$t('cancel')" class="tw-px-3" outline no-caps dense unelevated
                    v-close-popup />
                <q-btn color="negative" class="tw-px-3" :label="$t('delete')" dense unelevated
                    @click="clickedToDeleteTransaction" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { QTableProps } from 'quasar';
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { date } from 'quasar'
import { useRouter } from 'vue-router'
import { formatPrice, notify } from 'src/utils/helpers'
import { deleteTransactionService } from 'src/services/transactionServices';

const route = useRouter()
const { getTransactions, transactions, queryTransaction, setQueryTransaction, countTransactions } = useTransactionComposable()
const page = ref<number>(1);
const perPage = ref<number>(10);
const confirmDelete = ref<boolean>(false);
const deleteTransaction = ref<any>(null);

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

const processedTableData = computed(() => {
    let processedData = [];
    let previousDate = null;

    for (let row of transactions.value) {
        if (previousDate && row.date !== previousDate) {
            // Insert a new row when the date changes
            processedData.push({
                description: 'balance', debit: 777, date: previousDate, user: {
                    email: '',
                    id: '',
                    name: ''
                }
            });
        }
        processedData.push(row);
        previousDate = row.date;
    }

    processedData.push({
        description: 'balance', debit: 777, date: previousDate, user: {
            email: '',
            id: '',
            name: ''
        }
    });

    return processedData;
})

const onDelete = (row: any) => {
    confirmDelete.value = true
    deleteTransaction.value = row
}

const clickedToDeleteTransaction = async () => {
    const response = await deleteTransactionService(deleteTransaction.value.id)
    if (response.status === 200) {
        notify('positive', 'Transaction Deleted', 'Transaction was deleted successfully');
        confirmDelete.value = false
        getTransactions(queryTransaction.value)
    }
    else notify('negative', 'Error', response.data.message);
}

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
    { name: 'delete', align: 'left', label: 'Actions', field: 'delete' },
    { name: 'date', align: 'left', label: 'Date', field: 'date', format: val => date.formatDate(val, 'DD/MM/YYYY'), sortable: false },
    { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: false },
    { name: 'user', required: true, label: 'User', align: 'left', field: row => row.user.name, format: val => `${val}`, sortable: false },
    { name: 'amount', align: 'left', label: 'Amount', field: 'debit', format: val => `R$ ${val}`, sortable: false },
    // { name: 'created_at', align: 'left', label: 'Created at', field: 'created_at', format: val => date.formatDate(val, 'DD/MM/YYYY HH:mm') },
])
const pagesNumber = computed<number>(() => Math.ceil((countTransactions.value || 0) / pagination.value.rowsPerPage))
function onDetaill(event: Event, row: any): void {
    if (row.id) route.push({ name: 'TransactionDetail', params: { id: row.id } })
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

<style lang="scss">
.q-table tbody {
    .cursor-pointer:has(.balance-cell) {
        max-height: 25px;
        background-color: $grey-3;

        td {
            max-height: 25px;
            background-color: yellow;
        }
    }
}
</style>