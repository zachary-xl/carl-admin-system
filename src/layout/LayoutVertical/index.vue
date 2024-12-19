<template>
  <el-container class="h-screen w-screen">
    <el-aside
      class="layout-aside transition-all"
      :style="{ width: !globalStore.isCollapse ? globalStore.menuWidth + 'px' : settings.asideMenuCollapseWidth }"
    >
      <Logo :isCollapse="globalStore.isCollapse" :layout="globalStore.layout"></Logo>
      <!--      <el-scrollbar class="layout-scrollbar">-->
      <!--        &lt;!&ndash; :unique-opened="true" 子菜单不能同时展开 &ndash;&gt;-->
      <!--        <el-menu-->
      <!--          :default-active="activeMenu"-->
      <!--          :collapse="globalStore.isCollapse"-->
      <!--          :collapse-transition="false"-->
      <!--          :uniqueOpened="globalStore.uniqueOpened"-->
      <!--          :router="false"-->
      <!--          :class="menuAnimate"-->
      <!--        >-->
      <!--          <AsideSubMenu :menuList="menuList"></AsideSubMenu>-->
      <!--        </el-menu>-->
      <!--      </el-scrollbar>-->
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
import settings from "@/settings";
import { useGlobalStore } from "@/store";
import Logo from "@/layout/components/Logo/index.vue";
import Header from "@/layout/components/Header/index.vue";
import Main from "@/layout/components/Main/index.vue";

const globalStore = useGlobalStore();
</script>

<style scoped lang="scss">
.layout-aside {
  z-index: $layout-aside-z-index; // 左侧菜单层级
  padding-right: $aside-menu-padding-right; // 左侧布局右边距[用于悬浮和选中更明显]
  padding-left: $aside-menu-padding-left; // 左侧布局左边距[用于悬浮和选中更明显]
  background-color: var(--el-menu-bg-color);
  border-right: none;
  box-shadow: $aside-menu-box-shadow; // 左侧布局右边框阴影
}
</style>
