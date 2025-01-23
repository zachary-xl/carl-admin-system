import type { AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import type { LoadingInstance } from "element-plus/lib/components/loading/src/loading";
import type { AxiosInstance } from "axios";

export { AxiosInstance };

export type TStatusMap = Map<string, (message?: string, config?: IAxiosConfig, request?: any) => void>;

export interface IAxiosInterceptors<T = AxiosResponse> {
  requestInterceptor?: ((value: InternalAxiosRequestConfig) => InternalAxiosRequestConfig) | null;
  requestInterceptorCatch?: (error: any) => any;
  responseInterceptor?: (value: T) => T;
  responseInterceptorCatch?: (error: any) => any;
}

export interface IAxiosConfig<T = AxiosResponse> extends AxiosRequestConfig, IOtherOptions {
  interceptors?: IAxiosInterceptors<T>;
  headers?: AxiosRequestHeaders;
}

interface IOtherOptions {
  repeatRequestCancel?: boolean;
  reduceDataFormat?: boolean;
  showErrorMessage?: boolean;
  showCodeMessage?: boolean;
  showLoading?: boolean;
}

export interface ILoadingInstance {
  _target: LoadingInstance | null;
  _count: number;
}

export interface IRequest {
  instance: AxiosInstance;
  interceptors?: IAxiosInterceptors;
  repeatRequestCancel: boolean;
  reduceDataFormat: boolean;
  showLoading: boolean;
  showErrorMessage: boolean;
  showCodeMessage: boolean;
}

export type TRefreshToken = {
  data: {
    accessToken: string;
  };
};
