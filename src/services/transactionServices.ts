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
