import type { AxiosInstance, AxiosResponse } from 'axios';
import http from 'src/plugins/http';
import { objectToQueryString, type QueryParameters } from 'src/utils/helpers';

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
  console.log('🚀 ~ query:', query);
  return await http.patch<AxiosInstance>(`cashflows/${transitionId}`, query);
};

export const createTransactionDetailService = async (
  transitionId: string,
  query: QueryParameters = {}
): Promise<AxiosResponse> => {
  console.log('🚀 ~ query:', query);
  return await http.post<AxiosInstance>('cashflows', query);
};
