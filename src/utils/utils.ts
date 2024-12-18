/**
 * @description 获取浏览器默认语言
 */
export function getBrowserLang(): string {
  // 获取浏览器语言并处理为小写
  const browserLang = (navigator.language || (navigator as any).browserLanguage || "en").toLowerCase();
  // 根据语言判断并返回默认语言
  return ["cn", "zh", "zh-cn"].some((lang) => browserLang.includes(lang)) ? "zh" : "en";
}
