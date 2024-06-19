<template>
    <q-table :rows="processedTableData" row-key="id" :key="Date.now()" flat :columns="columns" :pagination="pagination"
        hide-pagination class="table-card bg-transparent" @row-click="onDetaill">
        <template #body-cell-amount="props">
            <q-td :props="props">
                <div class="tw-flex tw-flex-col">
                    <span :class="props.row.debit > 0 ? 'text-positive' : 'text-negative'">{{
                        formatPrice(props.row.debit) }}</span>
                    <span class="tw-text-neutral-500">Balance: {{ formatPrice(props.row.balance) }}</span>
                </div>
            </q-td>
        </template>
        <template #body-cell-delete="props">
            <q-td :props="props">
                <q-btn color="white" text-color="negative" icon="delete" dense round unelevated size="11px"
                    @click.stop="onDelete(props.row)" />
            </q-td>
        </template>
        <template #body-cell-description="props">
            <q-td :props="props">
                <div class="tw-flex tw-items-center">
                    <q-icon
                        :name="props.row.referenceCategoryBalance?.sub_category_balance?.icon ? props.row.referenceCategoryBalance?.sub_category_balance?.icon : 'mdi-shape-outline'"
                        color="primary" size="32px" class="q-mr-md" />
                    <div class="tw-flex tw-flex-col">
                        <span class="text-black">{{ props.row.description }}</span>
                        <span class="tw-text-neutral-500">
                            {{ date.formatDate(props.row.date, 'DD/MM/YYYY') }}
                            {{ props.row.referenceCategoryBalance ? '|' : '' }}
                            {{ props.row.referenceCategoryBalance?.sub_category_balance.name }}</span>
                    </div>
                </div>
            </q-td>
        </template>
        <!-- <template #body-cell="props">
            <q-td class="q-gutter-x-sm" :props="props">
                <template v-if="props.col.name === 'description'">
                    <div class="tw-flex tw-flex-col">
                        {{ props.row.description }}
                        {{ date.formatDate(props.row.date, 'DD/MM/YYYY') }}
                    </div>
                </template>
            </q-td>
        </template> -->
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
const { getTransactions, transactions, queryTransaction, setQueryTransaction, countTransactions, getBalanceService } = useTransactionComposable()
const page = ref<number>(1);
const perPage = ref<number>(100);
const confirmDelete = ref<boolean>(false);
const deleteTransaction = ref<any>(null);
const balanceInfo = ref<any>(null);

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

const calculateProcessedTableData = () => {
    let processedData = [];
    let previousDate: string | null = null;
    let totalBalance = balanceInfo.value ? balanceInfo.value[0]?.totalAmount : 0;
    for (let row of transactions.value.reverse()) {

        // dayAmount += transactions.value.filter(el => {
        //     if (new Date(el.date).getTime() === new Date(previousDate).getTime()) return el
        // }).reduce((acc, cur) => acc + cur.debit, 0);

        // processedData.push({
        //     description: 'balance', debit: dayAmount, date: previousDate, user: {
        //         email: '',
        //         id: '',
        //         name: ''
        //     }
        // });
        processedData.push({ ...row, balance: totalBalance });
        totalBalance += row.debit;
        previousDate = row.date;
    }
    return processedData.reverse();
};

const processedTableData = computed(() => {
    return calculateProcessedTableData();
});

const onDelete = (row: any) => {
    confirmDelete.value = true
    deleteTransaction.value = row
}

const clickedToDeleteTransaction = async () => {
    const response = await deleteTransactionService(deleteTransaction.value.id)
    if (response.status === 200) {
        notify('positive', 'Transaction Deleted', 'Transaction was deleted successfully');
        confirmDelete.value = false;
        balanceService();
        getTransactions(queryTransaction.value);
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
    // { name: 'date', align: 'left', label: 'Date', field: 'date', format: val => date.formatDate(val, 'DD/MM/YYYY'), sortable: false },
    { name: 'description', align: 'left', label: 'Description', field: 'description', sortable: false },
    { name: 'amount', align: 'right', label: 'Amount', field: 'debit', format: val => `R$${val}`, sortable: false },
    { name: 'delete', align: 'right', label: 'Actions', field: 'delete' },
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
const balanceService = async () => {
    const result = await getBalanceService();
    balanceInfo.value = result.data;
}
balanceService();
getTransactions({ ...queryTransaction.value, page: 1, perPage: pagination.value.rowsPerPage })
</script>

<style lang="scss"></style>