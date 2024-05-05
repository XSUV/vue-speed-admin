import type { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios';

export interface resultType {
  accessToken?: string;
}

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>;

export interface SpeedHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface SpeedHttpResponse extends AxiosResponse {
  config: SpeedHttpRequestConfig;
}

export interface SpeedHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: SpeedHttpRequestConfig) => void;
  beforeResponseCallback?: (response: SpeedHttpResponse) => void;
}

export default class SpeedHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: SpeedHttpRequestConfig,
  ): Promise<T>;
  post<T, P>(url: string, params?: T, config?: SpeedHttpRequestConfig): Promise<P>;
  get<T, P>(url: string, params?: T, config?: SpeedHttpRequestConfig): Promise<P>;
}
