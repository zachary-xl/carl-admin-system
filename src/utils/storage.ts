import { configSource } from "@/config";

const config = {
  type: configSource.storage, // 本地存储类型
  prefix: "", // 名称前缀
  expire: 100000 //过期时间 单位：秒
};
// 判断是否支持 Storage
export const isSupportStorage = () => {
  return typeof Storage !== "undefined";
};
// 设置 setStorage
export const setStorage = (key: string, value: unknown, expire: number = 0) => {
  if (value === "" || value === null || value === undefined) value = null;
  if (isNaN(expire) || expire < 0) throw new Error("Expire must be a number");
  const data = {
    value: value, // 存储值
    time: Date.now() //存值时间戳
  };
  if (configSource.storageIsExpire) data["expire"] = (expire ? expire : config.expire) * 1000; // 过期时间
  window[config.type].setItem(autoAddPrefix(key), JSON.stringify(data));
};
// 获取 getStorage
export const getStorage = (k: string) => {
  const key = autoAddPrefix(k);
  const val = window[config.type].getItem(key);
  if (JSON.stringify(val) === "null" || !val) return null;
  const storage = JSON.parse(val);
  const nowTime = Date.now();
  if (configSource.storageIsExpire && storage.expire && config.expire * 6000 < nowTime - storage.time) {
    removeStorage(key);
    return null;
  } else {
    setStorage(autoRemovePrefix(key), storage.value);
    return storage.value;
  }
};
// 是否存在 hasStorage
export const hasStorage = (key) => {
  const k = autoAddPrefix(key);
  const arr = getStorageAll().filter((item) => item.key === k);
  return !!arr.length;
};
// 获取所有key
export const getStorageKeys = () => {
  return getStorageAll().map((item) => {
    return item.key;
  });
};
// 获取全部 getAllStorage
export const getStorageAll = () => {
  return Object.keys(window[config.type]).map((key) => {
    const val = window[config.type].getItem(key);
    return { key, val };
  });
};
// 根据索引获取key
export const getStorageForIndex = (index: number): string => {
  return window[config.type].key(index);
};
// 获取localStorage长度
export const getStorageLength = (): number => {
  return window[config.type].length;
};
// 删除 removeStorage
export const removeStorage = (key: string): void => {
  window[config.type].removeItem(autoAddPrefix(key));
};
// 清空 clearStorage
export const clearStorage = (): void => {
  window[config.type].clear();
};
// 名称前自动添加前缀
const autoAddPrefix = (key: string): string => {
  return (config.prefix ? config.prefix + "_" : "") + key;
};
// 移除已添加的前缀
const autoRemovePrefix = (key: string): string => {
  const len: number = config.prefix ? config.prefix.length + 1 : 0;
  return key.substring(len);
};
