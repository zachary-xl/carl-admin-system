<template>
  <div class="flex justify-between">
    <div class="flex items-center overflow-hidden whitespace-nowrap">
      <!-- 左侧菜单展开和折叠图标 -->
      <Collapse></Collapse>
      <!-- 面包屑 -->
      <!--      <BreadCrumb class="md:hidden"></BreadCrumb>-->
    </div>
    <!-- 工具栏 -->
    <!--    <Toolbar></Toolbar>-->
  </div>
</template>

<script setup lang="ts">
import Collapse from "@/layout/components/Header/components/Collapse.vue";
import BreadCrumb from "@/layout/components/Header/components/BreadCrumb.vue";
import Toolbar from "@/layout/components/Header/components/Toolbar.vue";
</script>

<style lang="scss" scoped>
.header-box {
  height: $aside-header-height;
}
</style>
