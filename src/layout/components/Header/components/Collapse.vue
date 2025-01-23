<template>
  <div class="icon flex h-[36px] w-[36px] items-center justify-center rounded-md hover:bg-[rgba(0,0,0,0.06)]" @click="changeCollapseIcon">
    <el-icon :size="20">
      <SvgIcon name="s-menu-left" width="20px" height="20px" v-if="!globalStore.isCollapse"></SvgIcon>
      <SvgIcon name="s-menu-right" width="20px" height="20px" v-if="globalStore.isCollapse"></SvgIcon>
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from "@/store";

const globalStore = useGlobalStore();

/** 切换图标 */
const changeCollapseIcon = () => {
  // 定义图标切换变量(true-折叠，false-展开)
  globalStore.setCollapse(!globalStore.isCollapse);
};
</script>
