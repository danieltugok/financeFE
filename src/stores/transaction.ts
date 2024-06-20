import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { QueryParameters } from 'src/utils/helpers';
import type BalanceType from 'src/types/balanceType';

export const useTransactionStore = defineStore('transaction', () => {
  const transactions = ref<any[]>([]);
  const transaction = ref<any>({});
  const countTransactions = ref<number>(0);
  const queryTransaction = ref<QueryParameters>({
    page: 1,
    perPage: 100,
    orderBy: 'date',
    sortBy: 'asc',
  });
  const filterTransaction = ref<any>({});
  const filterDrawerTransaction = ref<boolean>(false);
  const totalBalance = ref<BalanceType | null>(null);

  function setTransactions(data: any[]): void {
    transactions.value = data;
  }
  function setTransaction(data: any): void {
    transaction.value = data;
  }
  function setCountTransactions(data: number): void {
    countTransactions.value = data;
  }
  function setQueryTransaction(data: QueryParameters): void {
    queryTransaction.value = data;
  }

  function setFilterTransaction(data: any): void {
    filterTransaction.value = data;
  }

  function setFilterDrawerTransaction(data: boolean): void {
    filterDrawerTransaction.value = data;
  }

  function setTotalBalance(data: BalanceType): void {
    totalBalance.value = data;
  }

  return {
    transactions,
    transaction,
    countTransactions,
    queryTransaction,
    filterTransaction,
    totalBalance,
    filterDrawerTransaction,
    setTransactions,
    setTransaction,
    setCountTransactions,
    setQueryTransaction,
    setFilterTransaction,
    setFilterDrawerTransaction,
    setTotalBalance,
  };
});
