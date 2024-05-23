import { useTransactionStore } from 'src/stores/transaction';
import { storeToRefs } from 'pinia';
import {
  getTransactionsService,
  getTransactionByIdService,
} from 'src/services/transactionServices';
import { useQuasar } from 'quasar';

export const useTransactionComposable = () => {
  const $q = useQuasar();
  const {
    setTransactions,
    setTransaction,
    setCountTransactions,
    setQueryTransaction,
    setFilterTransaction,
    setFilterDrawerTransaction,
  } = useTransactionStore();

  const {
    transactions,
    transaction,
    queryTransaction,
    countTransactions,
    filterTransaction,
    filterDrawerTransaction,
  } = storeToRefs(useTransactionStore());

  async function getTransactions(query: any): Promise<void> {
    $q.loading.show();

    // Transform from & to -> startDate & endDate
    const { from, to, ...rest } = query;
    query.startDate = from
      ? new Date(from).toISOString()
      : query.startDate
      ? query.startDate
      : null;
    query.endDate = to
      ? new Date(to).toISOString()
      : query.endDate
      ? query.endDate
      : null;
    delete query.from;
    delete query.to;

    try {
      const { status, data } = await getTransactionsService(query);
      if (status === 200) {
        setTransactions(data?.data);
        setCountTransactions(data?.meta?.totalItems);
      }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function getTransactionById(id: number): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getTransactionByIdService(id);
      if (status === 200) setTransaction(data);
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  return {
    transactions,
    transaction,
    queryTransaction,
    countTransactions,
    filterTransaction,
    filterDrawerTransaction,
    getTransactions,
    setTransaction,
    getTransactionById,
    setQueryTransaction,
    setFilterTransaction,
    setFilterDrawerTransaction,
  };
};
