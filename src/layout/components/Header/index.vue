<template>
  <div class="header-box">
    <div class="header-left">
      <!-- 左侧菜单展开和折叠图标 -->
      <Collapse />
      <!-- 面包屑 -->
      <BreadCrumb class="md:hidden"></BreadCrumb>
    </div>
    <!-- 工具栏 -->
    <Toolbar />
  </div>
</template>

<script setup lang="ts">
import Collapse from "./components/Collapse.vue";
import BreadCrumb from "./components/BreadCrumb.vue";
import Toolbar from "./components/Toolbar.vue";
</script>

<style lang="scss" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  height: 56px;
  .header-left {
    display: flex;
    align-items: center;
    overflow: hidden;
    white-space: nowrap;
  }
}
</style>
