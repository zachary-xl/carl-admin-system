<template>
  <el-container class="layout-container">
    <el-aside
      class="layout-aside transition-all"
      :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : settings.asideMenuCollapseWidth }"
    >
      <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
      <el-scrollbar class="layout-scrollbar">
        <!-- :unique-opened="true" 子菜单不能同时展开 -->
        <el-menu
          :default-active="activeMenu"
          :collapse="globalStore.isCollapse"
          :collapse-transition="false"
          :uniqueOpened="globalStore.uniqueOpened"
          :router="false"
          :class="menuAnimate"
        >
          <AsideSubMenu :menuList="menuList"></AsideSubMenu>
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header class="layout-header">
        <Header></Header>
      </el-header>
      <!-- 路由页面 -->
      <Main></Main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import settings from "@/settings";
import Logo from "./components/Logo/index.vue";
import Header from "./components/Header/index.vue";
import AsideSubMenu from "./components/Menu/AsideSubMenu.vue";
import Main from "./components/Main/index.vue";
import { useGlobalStore, useAuthStore } from "@/store";

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();

console.log("纵向布局左侧动态路由", authStore.showMenuList);

// 动态绑定左侧菜单animate动画
const menuAnimate = ref(settings.menuAnimate);
const menuList = computed(() => authStore.showMenuList);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string);
const menuHoverCollapse = ref(settings.asideMenuHoverCollapse);
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100vw;
  height: 100vh;
  .layout-aside {
    z-index: $layout-aside-z-index; // 左侧菜单层级
    padding-right: $aside-menu-padding-right; // 左侧布局右边距[用于悬浮和选中更明显]
    padding-left: $aside-menu-padding-left; // 左侧布局左边距[用于悬浮和选中更明显]
    background-color: var(--el-menu-bg-color);
    border-right: none;
    box-shadow: $aside-menu-box-shadow; // 左侧布局右边框阴影
  }
  .layout-header {
    height: $aside-header-height;
    background-color: var(--el-header-bg-color);
  }
}

/** 去除菜单右侧边框 */
.el-menu {
  border-right: none;
}
.layout-scrollbar {
  width: 100%;
  height: calc(100vh - $aside-header-height);
}
</style>
