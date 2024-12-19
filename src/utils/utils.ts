/**
 * @description 获取浏览器默认语言
 */
export function getBrowserLang(): string {
  // 获取浏览器语言并处理为小写
  const browserLang = (navigator.language || (navigator as any).browserLanguage || "en").toLowerCase();
  // 根据语言判断并返回默认语言
  return ["cn", "zh", "zh-cn"].some((lang) => browserLang.includes(lang)) ? "zh" : "en";
}

/*
 * @name: getAssets 获取assets目录的文件路径
 * @folder:  需要读取的目录
 * @name: 文件名，需要包括扩展名
 */
export const getAssets = (url: string) => {
  return new URL(`/src/assets/${url}`, import.meta.url).href;
};

/**
 * @description 获取匹配语言
 */
export const getLanguage = (language: string, zhName: string, enName?: string) => {
  switch (language) {
    case "zh":
      return zhName || "中文管理";
    case "en":
      return enName || "English Manage";
    default:
      return zhName || "中文管理";
  }
};
