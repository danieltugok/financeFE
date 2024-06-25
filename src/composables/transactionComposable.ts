import { useTransactionStore } from 'src/stores/transaction';
import { storeToRefs } from 'pinia';
import {
  getBalanceService,
  getTransactionsService,
  setTransactionDetailService,
  getTransactionByIdService,
  createTransactionDetailService,
  deleteTransactionService,
  getCategoryTransactionService,
  updateSubCategoryService,
  createSubCategoryService,
  deleteSubCategoryService,
  deleteReferenceSubCategoryService,
  refreshTransactionCategoriesService,
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
    setTotalBalance,
    setFilterDrawerTransaction,
  } = useTransactionStore();

  const {
    transactions,
    transaction,
    totalBalance,
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

  async function getTransactionById(id: string): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getTransactionsService({ id: id });
      if (status === 200) {
        setTransaction(data?.data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function getTotalBalance(): Promise<void> {
    $q.loading.show();
    try {
      const { status, data } = await getBalanceService();
      if (status === 200) {
        setTotalBalance(data[0]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function setTransactionDetail(transactionValue: any): Promise<any> {
    $q.loading.show();
    const transitionId = transactionValue?.id;
    const transactionDetail = JSON.parse(JSON.stringify(transactionValue));
    delete transactionDetail?.id;
    delete transactionDetail?.user;
    delete transactionDetail?.user;
    delete transactionDetail?.referenceCategoryBalance;
    transactionDetail.debit = +transactionDetail?.debit;
    try {
      const { status, data } = await setTransactionDetailService(
        transitionId,
        transactionDetail
      );
      if (status === 200 || status === 201) {
        return { status, data };
      }
    } catch (error) {
      console.log(error);
    } finally {
      $q.loading.hide();
    }
  }

  async function createTransactionDetail(transactionValue: any): Promise<any> {
    $q.loading.show();

    // validating data to send
    const transitionId = transactionValue?.id;
    const transactionDetail = JSON.parse(JSON.stringify(transactionValue));
    delete transactionDetail?.id;
    delete transactionDetail?.user;
    transactionDetail.amount = +transactionDetail?.debit;
    delete transactionDetail?.debit;

    try {
      const { status, data } = await createTransactionDetailService(
        transitionId,
        transactionDetail
      );
      if (status === 200 || status === 201) {
        return { status, data };
      }
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
    setTransactionDetail,
    createTransactionDetail,
    getTransactionById,
    setQueryTransaction,
    setFilterTransaction,
    setFilterDrawerTransaction,
    deleteTransactionService,
    getBalanceService,
    getCategoryTransactionService,
    setTotalBalance,
    totalBalance,
    getTotalBalance,
    updateSubCategoryService,
    createSubCategoryService,
    deleteSubCategoryService,
    deleteReferenceSubCategoryService,
    refreshTransactionCategoriesService,
  };
};
