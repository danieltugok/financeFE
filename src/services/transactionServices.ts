import type { AxiosInstance, AxiosResponse } from 'axios';
import http from 'src/plugins/http';
import { objectToQueryString, type QueryParameters } from 'src/utils/helpers';

export const getCategoryTransactionService =
  async (): Promise<AxiosResponse> => {
    return await http.get<AxiosInstance>('category-transaction/');
  };

export const getBalanceService = async (): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>('balance/');
};

export const getTransactionsService = async (
  query: QueryParameters
): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>(
    `cashflows/find${objectToQueryString(query)}`
  );
};

export const deleteTransactionService = async (
  id: string
): Promise<AxiosResponse> => {
  return await http.delete<AxiosInstance>(`cashflows/${id}`);
};

export const getTransactionByIdService = async (
  id: number
): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>(`transactions/${id}`);
};

export const getWidgetByTypeService = async (
  type: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  return await http.get<AxiosInstance>(
    `widgets/${type}/dashboard${objectToQueryString(query)}`
  );
};

export const setTransactionDetailService = async (
  transitionId: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  return await http.patch<AxiosInstance>(`cashflows/${transitionId}`, query);
};

export const createTransactionDetailService = async (
  transitionId: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  return await http.post<AxiosInstance>('cashflows', query);
};

export const updateSubCategoryService = async (
  transitionId: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  return await http.patch<AxiosInstance>(
    `category-transaction/sub/${transitionId}`,
    query
  );
};

export const createSubCategoryService = async (
  transitionId: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  return await http.post<AxiosInstance>(
    `category-transaction/${transitionId}`,
    query
  );
};

export const deleteSubCategoryService = async (
  transitionId: string
): Promise<AxiosResponse> => {
  return await http.delete<AxiosInstance>(
    `category-transaction/${transitionId}`
  );
};
