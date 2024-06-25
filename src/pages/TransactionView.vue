<!-- eslint-disable @typescript-eslint/no-unused-vars -->

<template>
  <q-page class="wrapper" padding>
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
          <q-chip removable @remove="onRemoveFilter(item)" icon-remove="sym_r_close" :label="item" text-color="white"
            color="primary" />
        </template>
        <q-btn :text-color="$q.dark.isActive ? 'dark' : 'white'" :color="$q.dark.isActive ? 'white' : 'primary'"
          icon="mdi-refresh" class="borderless q-card--bordered"
          :class="isRefreshingTransactionCategories ? 'image-spinner-animation' : ''"
          @click="refreshTransactionCategories" dense unelevated padding="sm">
          <q-tooltip>Research the non-categories transactions</q-tooltip>
        </q-btn>
        <q-btn :text-color="$q.dark.isActive ? 'white' : 'dark'" :color="$q.dark.isActive ? 'primary' : 'white'"
          icon="mdi-tab-plus" class="borderless q-card--bordered" @click="detailDialog = !detailDialog" dense unelevated
          padding="sm">
          <q-tooltip>Add new transaction</q-tooltip>
        </q-btn>
        <q-input v-model="search" type="search" label="Buscar..." dense outlined
          :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" debounce="300" clear-icon="sym_r_close" clearable>
          <template v-slot:prepend>
            <q-icon name="sym_r_search" />
          </template>
          <template v-slot:append>
            <q-btn flat dense color="primary" icon="mdi-tune" @click="detailDialogFilter = !detailDialogFilter" />
          </template>
        </q-input>

        <!-- <input-date-ranger @update="onFilterDate" dense outlined clear-icon="sym_r_close" clearable
                    :bg-color="$q.dark.isActive ? 'grey-10' : 'white'" /> -->

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
    <detail-transaction @close="detailDialog = false" @updated="transactionDetailUpdated"
      :id="typeof $route.params.id === 'string' ? $route.params.id : ''" />
  </q-dialog>
  <q-dialog v-model="detailDialogFilter" persistent>
    <detail-filter @close="detailDialogFilter = false" @filterTransaction="onFilterTransactions"
      :id="typeof $route.params.id === 'string' ? $route.params.id : ''" />
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import ListTransaction from 'src/components/transaction/ListTransaction.vue'
import InputDateRanger from 'src/components/InputDateRanger.vue'
import DetailTransaction from 'src/components/transaction/DetailTransaction.vue';
import DetailFilter from 'src/components/transaction/DetailFilter.vue';
import { useTransactionComposable } from 'src/composables/transactionComposable'
import { useRoute } from 'vue-router'
import { notify } from 'src/utils/helpers'

const { refreshTransactionCategoriesService, getTotalBalance, getTransactions, queryTransaction, setQueryTransaction, filterTransaction, setFilterTransaction, setFilterDrawerTransaction, filterDrawerTransaction } = useTransactionComposable()
const filterDialog = ref<boolean>(false)
const detailDialog = ref<boolean>(false)
const detailDialogFilter = ref<boolean>(false)
const isRefreshingTransactionCategories = ref<boolean>(false)
const search = ref<string>('')

const route = useRoute()

watch(search, (value) => {
  setQueryTransaction({ ...queryTransaction.value, description: value })
  getTransactions(queryTransaction.value)
})
watch(() => route.params.id, (newId, oldId) => {
  onOpenDetail()
}, { immediate: true })
const transactionDetailUpdated = async () => {
  await getTransactions(queryTransaction.value)
  await getTotalBalance();
}

const refreshTransactionCategories = async () => {
  isRefreshingTransactionCategories.value = true
  const { status } = await refreshTransactionCategoriesService()
  if (status === 200) {
    isRefreshingTransactionCategories.value = false
    notify('positive', 'Transactions analized successfully', '');
    transactionDetailUpdated()
  }
  else notify('negative', 'ERROR', 'Something went wrong');
}

function onRemoveFilter(item: string): void {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [item]: _, ...rest } = filterTransaction.value
  setFilterTransaction(rest)
  setQueryTransaction({ ...queryTransaction.value, [item]: '' })
  getTransactions(queryTransaction.value)
}
function onFilterTransactions({ sortBy, timeFilter }: any): void {
  console.log(sortBy, timeFilter)
  let filterParse: any = { orderBy: null, sortBy: null, startDate: null, endDate: null };

  switch (sortBy) {
    case 'date':
      filterParse.orderBy = 'date'
      break;
    case 'debitAsc':
      filterParse.orderBy = 'debit'
      filterParse.sortBy = 'asc'
      break;
    case 'debitDesc':
      filterParse.orderBy = 'debit'
      filterParse.sortBy = 'desc'
      break;
    default:
      break;
  }
  switch (timeFilter) {
    case 30:
      filterParse.startDate = new Date(new Date().setDate(new Date().getDate() - 30));
      filterParse.endDate = new Date()
      break;
    case 60:
      filterParse.startDate = new Date(new Date().setDate(new Date().getDate() - 60));
      filterParse.endDate = new Date()
      break;
    case 90:
      filterParse.startDate = new Date(new Date().setDate(new Date().getDate() - 90));
      filterParse.endDate = new Date()
      break;
    case 'Current Year':
      filterParse.startDate = new Date(new Date().getFullYear(), 0, 1);
      filterParse.endDate = new Date(new Date().getFullYear(), 11, 31);
      break;
    case 'Last Year':
      filterParse.startDate = new Date(new Date().getFullYear() - 1, 0, 1);
      filterParse.endDate = new Date(new Date().getFullYear() - 1, 11, 31);
      break;
    default:
      break;
  }
  setQueryTransaction({ ...queryTransaction.value, ...filterParse })
  getTransactions(queryTransaction.value)
}
function onOpenDetail(): void {
  if (route?.params?.id) detailDialog.value = true
  else detailDialog.value = false
}

</script>

<style lang="scss">
.image-spinner-animation {
  i {
    -webkit-animation: spin 2s linear infinite;
    -moz-animation: spin 2s linear infinite;
    animation: spin 2s linear infinite;
  }
}

@-moz-keyframes spin {
  100% {
    -moz-transform: rotate(360deg);
  }
}

@-webkit-keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
  }
}

@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
