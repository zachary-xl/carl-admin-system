<template>
  <el-config-provider :locale="locale" :size="dimension">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { useGlobalStore } from "@/store";
import { getBrowserLang, useTheme } from "@/utils";

const { initThemeConfig } = useTheme();
// 初始化语言
const i18n = useI18n();
const dimension = computed(() => globalStore.dimension);
const globalStore = useGlobalStore();
/** 语言配置 */
const locale = computed(() => {
  if (globalStore.language === "zh") return zhCn;
  if (globalStore.language === "en") return en;
  return getBrowserLang() === "zh" ? zhCn : en;
});
/** 初始化语言配置 */
const handleI18nConfig = () => {
  const language = globalStore.language ?? getBrowserLang();
  i18n.locale.value = language;
  globalStore.setLanguage(language);
};
/** 初始化主题配置 */
const handleThemeConfig = () => {
  nextTick(() => {
    initThemeConfig();
  });
};
onMounted(() => {
  // 初始化主题配置
  handleThemeConfig();
  // 初始化语言配置
  handleI18nConfig();
});
</script>
