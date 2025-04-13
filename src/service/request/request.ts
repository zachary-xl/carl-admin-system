import axios from "axios";
import router from "@/router";
import { ElLoading, ElMessage } from "element-plus";
import {
  DEFAULT_SHOW_LOADING,
  DEFAULT_REDUCE_DATA_FORMAT,
  DEFAULT_REPEAT_REQUEST_CANCEL,
  DEFAULT_SHOW_ERROR_MESSAGE,
  DEFAULT_SHOW_CODE_MESSAGE,
  DEFAULT_HEADER_AUTHORIZATION
} from "./constant";
import { refreshTokenFn } from "@/utils/refreshTokenFn";
import { getStorage, hasStorage, isType, removeStorage, setStorage } from "@/utils";
import type { AxiosInstance, IAxiosConfig, IAxiosInterceptors, ILoadingInstance, TStatusMap, IRequest } from "./types";
import { useAuthStore } from "@/store";

const statusMap: TStatusMap = new Map();
const LoadingInstance: ILoadingInstance = {
  _target: null,
  _count: 0
};

export default class MyRequest implements IRequest {
  instance: AxiosInstance;
  interceptors?: IAxiosInterceptors;
  repeatRequestCancel: boolean;
  reduceDataFormat: boolean;
  showLoading: boolean;
  showErrorMessage: boolean;
  showCodeMessage: boolean;

  constructor(config: IAxiosConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors; // 实例拦截器
    this.repeatRequestCancel = config.repeatRequestCancel ?? DEFAULT_REPEAT_REQUEST_CANCEL; // 是否开启取消重复请求
    this.reduceDataFormat = config.reduceDataFormat ?? DEFAULT_REDUCE_DATA_FORMAT; // 是否开启简洁的数据结构响应
    this.showErrorMessage = config.showErrorMessage ?? DEFAULT_SHOW_ERROR_MESSAGE; // 是否开启接口错误信息展示
    this.showCodeMessage = config.showCodeMessage ?? DEFAULT_SHOW_CODE_MESSAGE; // 是否开启code不为0时的信息提示
    this.showLoading = config.showLoading ?? DEFAULT_SHOW_LOADING; // 是否开启loading层效果
    // 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        this.repeatRequestCancel && addStatus(config);
        // 创建loading实例
        if (this.showLoading) {
          LoadingInstance._count++;
          if (LoadingInstance._count === 1) {
            LoadingInstance._target = ElLoading.service({});
          }
        }
        if (config!.url && config.url.indexOf("/refresh") >= 0) {
          // token 过期
          config.headers![DEFAULT_HEADER_AUTHORIZATION] = getStorage("refreshToken");
        } else if (router.currentRoute.value.path.indexOf("salesman") >= 0 && hasStorage("salesmanToken")) {
          config.headers![DEFAULT_HEADER_AUTHORIZATION] = getStorage("salesmanToken");
        } else if (hasStorage("accessToken") && typeof window !== "undefined") {
          // 自动携带token
          config.headers![DEFAULT_HEADER_AUTHORIZATION] = getStorage("accessToken");
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.instance.interceptors.response.use(
      (response) => {
        delStatus(response.config);
        this.showLoading && closeLoading(this.showLoading);
        if (isType(response.data) === "[object Blob]" || isType(response.data) === "[object ArrayBuffer]") {
          return response.data;
        }
        if (this.showCodeMessage && response.data && response.data.code !== 0) {
          ElMessage({ type: "error", message: response.data.msg });
          return Promise.reject(response.data);
        }
        return this.reduceDataFormat ? response.data : response;
      },
      async (error) => {
        this.showLoading && closeLoading(this.showLoading); // 关闭loading
        if (error.response?.status === 401 || error.response?.status === 401) {
          const authStore = useAuthStore();
          removeStorage("accessToken");
          removeStorage("salesmanToken");
          removeStorage("refreshToken");
          console.log("error", error);
          authStore.setTokenAction("");
          if (router.currentRoute.value.path.indexOf("salesman") >= 0) {
            return await router.push("/salesman-login");
          } else {
            return await router.push("/login");
          }
        }
        error.config && delStatus(error.config);
        this.showErrorMessage && httpErrorStatusHandle(error); // 处理错误状态码
        return Promise.reject(error); // 错误继续返回给到具体页面
      }
    );
    // 自定义实例拦截器
    this.instance.interceptors.request.use(this.interceptors?.requestInterceptor, this.interceptors?.requestInterceptorCatch);
    this.instance.interceptors.response.use(this.interceptors?.responseInterceptor, this.interceptors?.responseInterceptorCatch);
  }

  request<T>(config: IAxiosConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // api 接口请求拦截器
      // if (config.interceptors?.requestInterceptor) {
      //   config = config.interceptors.requestInterceptor(config);
      // }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // api 接口响应拦截器
          // if (config.interceptors?.responseInterceptor) {
          //   res = config.interceptors.responseInterceptor(res);
          // }
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  get<T>(config: IAxiosConfig<T>): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T>(config: IAxiosConfig<T>): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }

  put<T>(config: IAxiosConfig<T>): Promise<T> {
    return this.request({ ...config, method: "PUT" });
  }

  delete<T>(config: IAxiosConfig<T>): Promise<T> {
    return this.request({ ...config, method: "DELETE" });
  }
}

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error: any) {
  // 处理被取消的请求
  if (axios.isCancel(error)) return console.error("请求的重复请求：" + error.message);
  let message = "";
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = "接口重定向了！";
        break;
      case 400:
        message = "参数不正确！";
        break;
      case 401:
        message = "您未登录，或者登录已经超时，请先登录！";
        break;
      case 403:
        message = "您没有权限操作！";
        break;
      case 404:
        message = `请求地址出错: ${error.response.config.url}`;
        break; // 在正确域名下
      case 408:
        message = "请求超时！";
        break;
      case 409:
        message = "系统已存在相同数据！";
        break;
      case 500:
        message = "服务器内部错误！";
        break;
      case 501:
        message = "服务未实现！";
        break;
      case 502:
        message = "网关错误！";
        break;
      case 503:
        message = "服务不可用！";
        break;
      case 504:
        message = "服务暂时无法访问，请稍后再试！";
        break;
      case 505:
        message = "HTTP版本不受支持！";
        break;
      default:
        message = "异常问题，请联系管理员！";
        break;
    }
  }
  if (error.message.includes("timeout")) message = "网络请求超时！";
  if (error.message.includes("Network")) message = window.navigator.onLine ? "服务端异常！" : "您断网了！";
  ElMessage({ type: "error", message });
}

/**
 * 关闭Loading层实例
 * @param {*} showLoading
 */
function closeLoading(showLoading) {
  if (showLoading && LoadingInstance._count > 0) LoadingInstance._count--;
  if (LoadingInstance._count === 0) {
    LoadingInstance._target!.close();
    LoadingInstance._target = null;
  }
}

/**
 * 储存每个请求的唯一cancel回调, 以此为标识
 * @param {*} config
 */
function addStatus(config: IAxiosConfig): void {
  delStatus(config);
  const status = getStatus(config);
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken((cancel) => {
      if (!statusMap.has(status)) {
        statusMap.set(status, cancel);
      }
    });
}

/**
 * 删除重复的请求
 * @param {*} config
 */
function delStatus(config: IAxiosConfig): void {
  const status = getStatus(config);
  if (statusMap.has(status)) {
    const cancelToken = statusMap.get(status);
    cancelToken!(status);
    statusMap.delete(status);
  }
}

/**
 * 生成唯一的每个请求的唯一key
 * @param {*} config
 * @returns
 */
function getStatus(config: IAxiosConfig): string {
  let { url, method, params, data } = config;
  if (typeof data === "string") data = JSON.parse(data); // response里面返回的config.data是个字符串对象
  return encodeURI([url, method, JSON.stringify(params), JSON.stringify(data)].join("&"));
}
