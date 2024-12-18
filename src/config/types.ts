const ENV = import.meta.env;

export type TConfig = {
  appEnv: typeof ENV.VITE_APP_ENV;
  appName: typeof ENV.VITE_APP_NAME;
  enAppName: typeof ENV.VITE_APP_EN_NAME;
  systemTitle: typeof ENV.VITE_SYSTEM_TITLE;
  enSystemTitle: typeof ENV.VITE_SYSTEM_EN_TITLE;
  baseUrl: typeof ENV.VITE_BASE_URL;
  baseServerUrl: typeof ENV.VITE_BASE_SERVER_URL;
  timeout: typeof ENV.VITE_TIMER_OUT;
  storage: typeof ENV.VITE_STORAGE;
  storageIsExpire: typeof ENV.VITE_IS_EXPIRE;
  routerMode: typeof ENV.VITE_ROUTER_MODE;
};
