import Axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type CustomParamsSerializer,
} from 'axios';
import type {
  SpeedHttpError,
  RequestMethods,
  SpeedHttpResponse,
  SpeedHttpRequestConfig,
} from './types.d';
import { stringify } from 'qs';
import NProgress from '../progress';
import { getToken, formatToken } from '@/utils/auth';
import { useUserStoreHook } from '@/store/modules/user';

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer,
  },
};

class SpeedHttp {
  /** `token`过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新`token` */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: SpeedHttpRequestConfig = {};

  /** 保存当前`Axios`实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: SpeedHttpRequestConfig) {
    return new Promise((resolve) => {
      SpeedHttp.requests.push((token: string) => {
        config.headers.Authorization = formatToken(token);
        resolve(config);
      });
    });
  }

  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  /** 通用请求工具函数 */
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: SpeedHttpRequestConfig,
  ): Promise<T> {
    const config: SpeedHttpRequestConfig = {
      method,
      url,
      ...param,
      ...axiosConfig,
    };

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      SpeedHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /** 单独抽离的`post`工具函数 */
  post<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: SpeedHttpRequestConfig,
  ): Promise<T> {
    return this.request<T>('post', url, params, config);
  }

  /** 单独抽离的`get`工具函数 */
  get<T, P>(
    url: string,
    params?: AxiosRequestConfig<P>,
    config?: SpeedHttpRequestConfig,
  ): Promise<T> {
    return this.request<T>('get', url, params, config);
  }
  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    SpeedHttp.axiosInstance.interceptors.request.use(
      async (config: SpeedHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config);
          return config;
        }
        if (SpeedHttp.initConfig.beforeRequestCallback) {
          SpeedHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要`token`的接口（通过设置请求白名单，防止`token`过期后再请求造成的死循环问题） */
        const whiteList = ['/refresh-token', '/login'];
        return whiteList.some((url) => config.url.endsWith(url))
          ? config
          : new Promise((resolve) => {
              const data = getToken();
              if (data) {
                const now = new Date().getTime();
                const expired = parseInt(`${data.expires}`, 10) - now <= 0;
                if (expired) {
                  if (!SpeedHttp.isRefreshing) {
                    SpeedHttp.isRefreshing = true;
                    // token过期刷新
                    useUserStoreHook()
                      .handRefreshToken({ refreshToken: data.refreshToken })
                      .then((res) => {
                        const token = res.data.accessToken;
                        config.headers.Authorization = formatToken(token);
                        SpeedHttp.requests.forEach((cb) => cb(token));
                        SpeedHttp.requests = [];
                      })
                      .finally(() => {
                        SpeedHttp.isRefreshing = false;
                      });
                  }
                  resolve(SpeedHttp.retryOriginalRequest(config));
                } else {
                  config.headers.Authorization = formatToken(data.accessToken);
                  resolve(config);
                }
              } else {
                resolve(config);
              }
            });
      },
      (error) => {
        return Promise.reject(error);
      },
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = SpeedHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: SpeedHttpResponse) => {
        const $config = response.config;
        // 关闭进度条动画
        NProgress.done();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response);
          return response.data;
        }
        if (SpeedHttp.initConfig.beforeResponseCallback) {
          SpeedHttp.initConfig.beforeResponseCallback(response);
          return response.data;
        }
        return response.data;
      },
      (error: SpeedHttpError) => {
        const $error = error;
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      },
    );
  }
}

export const http = new SpeedHttp();
