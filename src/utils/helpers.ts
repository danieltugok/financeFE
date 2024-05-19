import { Notify } from 'quasar';
export interface QueryParameters {
  [key: string]: string | number | boolean | undefined;
}

export const objectToQueryString = (
  queryParameters: QueryParameters
): string => {
  return queryParameters
    ? Object.entries(queryParameters).reduce((queryString, [key, val]) => {
        const symbol = queryString.length === 0 ? '?' : '&';
        queryString += val ? `${symbol}${key}=${val}` : '';
        return queryString;
      }, '')
    : '';
};

export const notify = (
  type = 'info',
  message: string,
  caption = '',
  icon: string | undefined = undefined
) => {
  // type: 'info', 'positive', 'negative', 'warning'
  Notify.create({
    type,
    message,
    caption,
    icon: icon || undefined,
  });
};

export const isRequired = (v: string) => (v && v.length > 0) || 'REQUIRED';
export const isEmail = (v: string) => /.+@.+/.test(v) || 'E-mail must be valid';
