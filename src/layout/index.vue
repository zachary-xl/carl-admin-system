<template>
  <div>
    <!-- 同级进行选择不同布局时就不会被关闭 -->
    <component :is="ThemeConfig" />
    <component :is="LayoutComponent[layout]" v-if="!isMobile" />
    <component :is="LayoutMobile" v-if="isMobile" />
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue"
import { useGlobalStore } from "@/store";
import { useScreenStore } from "@/hooks";
import ThemeConfig from "@/layout/components/ThemeConfig/index.vue";
import LayoutMobile from "@/layout/LayoutMobile/index.vue";
import LayoutVertical from "@/layout/LayoutVertical/index.vue";
import LayoutColumns from "@/layout/LayoutColumns/index.vue";
import LayoutClassic from "@/layout/LayoutClassic/index.vue";
import LayoutHorizontal from "@/layout/LayoutHorizontal/index.vue";
import LayoutOptimum from "@/layout/LayoutOptimum/index.vue";
import type { LayoutType } from "@/layout/types";

const globalStore = useGlobalStore()
const LayoutComponent: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  columns: LayoutColumns,
  classic: LayoutClassic,
  horizontal: LayoutHorizontal,
  optimum: LayoutOptimum
};
/** 获取布局格式 */
const layout = computed(() => globalStore.layout);
// 获取当前为[移动端、IPad、PC端]仓库，阔以使用 watchEffect(() => {}) 进行监听。
const { isMobile } = useScreenStore();
</script>

<style scoped lang="scss">

</style>
