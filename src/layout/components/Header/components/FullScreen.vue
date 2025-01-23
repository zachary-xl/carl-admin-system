<template>
  <!-- 全屏 -->
  <div class="icon w-[32px] h-full justify-center items-center flex hover:bg-[rgba(0,0,0,0.06)]" @click="toggle">
    <el-tooltip :content="globalStore.isFullScreen ? '全屏' : '退出全屏'">
      <el-icon class="icon" :size="18">
        <FullScreen v-if="!globalStore.isFullScreen" />
        <CloseBold v-else />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useGlobalStore } from "@/store";

const globalStore = useGlobalStore();
// @vueuse/core 处理是否全屏
const { isFullscreen, toggle } = useFullscreen();

watch(isFullscreen, () => {
  if (isFullscreen.value) {
    globalStore.setGlobalState("isFullScreen", true);
  } else {
    globalStore.setGlobalState("isFullScreen", false);
  }
});
</script>
