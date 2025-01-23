import { configSource } from "@/config";

/**
 * @description 获取assets静态资源
 * @param url
 */
export const getAssets = (url: string) => {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
};
// 排除出对象中假的值
export function excludingFakeObject(obj: { [k: string]: unknown }): any {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== 0)
  );
}

export function isType(value): string {
  return Object.prototype.toString.call(value);
}

/**
 * @description 获取匹配语言
 */
export const getLanguage = (language: string, zhName: string, enName?: any) => {
  switch (language) {
    case "zh":
      return zhName || "中文管理";
    case "en":
      return enName || "English Manage";
    default:
      return zhName || "中文管理";
  }
};

/**
 * @description 获取不同路由模式所对应的 url + params
 * @returns {String}
 */
export function getUrlWithParams() {
  const url = {
    hash: location.hash.substring(1),
    history: location.pathname + location.search
  };
  return url[configSource.routerMode];
}
