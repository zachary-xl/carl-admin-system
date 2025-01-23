<template>
  <el-config-provider :locale="locale" :size="dimension">
    <RouterView v-slot="{ Component }">
      <component :is="Component"></component>
    </RouterView>
  </el-config-provider>
</template>

<script lang="ts" setup>
import useTheme from "@/hooks/useTheme";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import type { Language } from "element-plus/es/locale";
import { useGlobalStore } from "@/store";

const locale = ref<Language>(zhCn);
const { initThemeConfig } = useTheme();
const globalStore = useGlobalStore();
const dimension = computed(() => globalStore.dimension);

/** 初始化主题配置 */
const handleThemeConfig = () => {
  nextTick(() => {
    initThemeConfig();
  });
};

onMounted(() => {
  handleThemeConfig();
});
</script>