import type { TConfig } from "./types";

// 获取环境变量
const ENV = import.meta.env;
// 默认配置文件
export const configSource: TConfig = {
  // 开发环境
  appEnv: ENV.VITE_APP_ENV,
  // 项目名
  appName: ENV.VITE_APP_NAME,
  enAppName: ENV.VITE_APP_EN_NAME,
  // 系统标题
  systemTitle: ENV.VITE_SYSTEM_TITLE,
  enSystemTitle: ENV.VITE_SYSTEM_EN_TITLE,
  // 接口代理URL路径
  baseUrl: ENV.VITE_BASE_URL,
  // 服务端接口路径
  baseServerUrl: ENV.VITE_BASE_SERVER_URL,
  // 请求过期时间
  timeout: Number(ENV.VITE_TIMER_OUT),
  // 存储方法
  storage: ENV.VITE_STORAGE,
  // 存储过期方法
  storageIsExpire: JSON.parse(ENV.VITE_IS_EXPIRE),
  // 路由模式
  routerMode: ENV.VITE_ROUTER_MODE
};
