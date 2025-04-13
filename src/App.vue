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

<style scoped lang="scss">
:deep(.el-button) {
  height: 30px;
  font-size: 12px;
}

:deep(.el-input) {
  .el-input__wrapper {
    box-shadow: none;
    background-color: rgba(247, 248, 250, 1);
    color: rgba(136, 136, 136, 1);
    font-size: 12px !important;
    position: relative;

    .el-input__inner {
      padding-right: 18px;
    }

    .el-input__suffix {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

:deep(.el-select) {
  width: 220px !important;

  .el-select__wrapper {
    box-shadow: none;
    background-color: rgba(247, 248, 250, 1);
    color: rgba(136, 136, 136, 1);
    font-size: 12px;
  }
}

:deep(.el-date-editor.el-input__wrapper) {
  background-color: rgba(247, 248, 250, 1);
  color: rgba(136, 136, 136, 1);
  width: 220px;
  height: 30px;
  box-shadow: none;

  .el-range-input {
    font-size: 12px !important;
  }
}

:deep(.el-form-item__label) {
  font-weight: 600;
}

:deep(.table-header) {
  .cell {
    font-weight: bolder !important;
    white-space: nowrap !important;
  }
}
</style>
