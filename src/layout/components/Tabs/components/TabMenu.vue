<template>
  <div class="tabs-card">
    <div @click="handleRefresh()" class="tab-menu-item c-#0C6ED0">
      <el-icon class="mr-[2px]"><Refresh /></el-icon>重新刷新
    </div>
    <br />
    <div @click="handleMaximize()" class="tab-menu-item c-#646cff">
      <el-icon class="mr-[2px]"><FullScreen /></el-icon>全屏切换
    </div>
    <br />
    <div @click="handleCloseCurrentTab()" class="tab-menu-item c-#C93992">
      <el-icon class="mr-[2px]"><Close /></el-icon>关闭当前
    </div>
    <br />
    <div @click="handleCloseOtherTabs()" class="tab-menu-item c-#DD5858">
      <el-icon class="mr-[2px]"><Star /></el-icon>关闭其他
    </div>
    <br />
    <div @click="handleCloseSideTabs('left')" class="tab-menu-item c-#31A24D">
      <el-icon class="mr-[2px]"><DArrowLeft /></el-icon>关闭左侧
    </div>
    <br />
    <div @click="handleCloseSideTabs('right')" class="tab-menu-item c-#F77A05">
      <el-icon class="mr-[2px]"><DArrowRight /></el-icon>关闭右侧
    </div>
    <br />
    <div icon="Remove" @click="handleCloseAllTabs()" class="tab-menu-item c-#7723B0">
      <el-icon class="mr-[2px]"><Remove /></el-icon>关闭全部
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useGlobalStore, useKeepAliveStore, useTabsStore } from "@/store";
import { HOME_URL } from "@/config";

const route = useRoute();
const router = useRouter();
const keepAliveStore = useKeepAliveStore();
const tabsStore = useTabsStore();
const globalStore = useGlobalStore();

// 点击鼠标右键点击出现菜单
const choosePath = ref();

const handleMenuParent = (e: any) => {
  if (e.srcElement?.id) {
    choosePath.value = e.srcElement.id.split("-")[1];
  } else {
    return;
  }
  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 设置 card 的位置为鼠标点击位置
    card.style.display = "block";
    card.style.left = (e.pageX + "px") as string;
    card.style.top = (e.pageY + "px") as string;

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.style.display = "none";
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick]
  e.stopPropagation();
};

const handleMenuChildren = (path: any, e: any) => {
  choosePath.value = path;
  const card = document.querySelector(".tabs-card") as HTMLElement | null;

  // 阻止默认右键菜单
  e.preventDefault();
  if (card != null) {
    // 设置 card 的位置为鼠标点击位置
    card.style.display = "block";
    card.style.left = (e.pageX + "px") as string;
    card.style.top = (e.pageY + "px") as string;

    // 点击数据时，菜单消失
    const hideCard = () => {
      if (card !== null) {
        card.style.display = "none";
      }
      window.removeEventListener("click", hideCard); // 移除点击事件监听器，以免影响其他操作
    };

    window.addEventListener("click", hideCard);
  }
  // 阻止事件冒泡到父元素[防止触发全局的 window.onclick]
  e.stopPropagation();
};

// 刷新当前页
const refreshCurrentPage: Function = inject("refresh") as Function;

const handleRefresh = () => {
  setTimeout(() => {
    route.meta.isKeepAlive && keepAliveStore.removeKeepAliveName(route.name as string);
    refreshCurrentPage(false);
    nextTick(() => {
      route.meta.isKeepAlive && keepAliveStore.addKeepAliveName(route.name as string);
      refreshCurrentPage(true);
    });
  }, 0);
};

/** 当前页全屏 */
const handleMaximize = () => {
  // 切换哪个，先跳转哪个
  router.push(choosePath.value);
  globalStore.setGlobalState("maximize", !globalStore.maximize);
};

/** 关闭左边 OR 右边选项卡 */
const handleCloseSideTabs = (direction: any) => {
  // console.log("关闭左边 OR 右边选项卡", direction);
  if (choosePath.value) {
    tabsStore.closeSideTabs(choosePath.value, direction);
  } else {
    tabsStore.closeSideTabs(route.fullPath, direction);
  }
};

/** 关闭当前选项卡 */
const handleCloseCurrentTab = () => {
  // console.log("关闭当前选项卡");
  if (choosePath.value) {
    tabsStore.removeTab(choosePath.value, true, route.fullPath);
  } else {
    tabsStore.removeTab(route.fullPath);
  }
};

/** 关闭其他选项卡 */
const handleCloseOtherTabs = () => {
  // console.log("关闭其他选项卡");
  if (choosePath.value) {
    tabsStore.closeManyTabs(choosePath.value);
    router.push(choosePath.value);
  } else {
    tabsStore.closeManyTabs(route.fullPath);
  }
};

/** 关闭全部选项卡 */
const handleCloseAllTabs = () => {
  // console.log("关闭全部选项卡");
  tabsStore.closeManyTabs();
  router.push(HOME_URL);
};

/** 组件对外暴露 */
defineExpose({
  handleMenuParent,
  handleMenuChildren
});
</script>

<style lang="scss" scoped>
/** 右键点击选项开始 */
.tabs-card {
  position: absolute;
  z-index: 9999;
  display: none;
  cursor: pointer;
  background-color: #ffffff;
  @apply dark:bg-black;
  border-radius: var(--el-border-radius-base);
  box-shadow: var(--el-box-shadow-light);
  color: #333639;
  padding: 2px;
}
.tab-menu-item {
  display: inline-block;
  width: auto;
  height: 12px;
  padding: 8px 12px;
  margin-top: 1px;
  font-size: var(--el-font-size-base);
  user-select: none;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);
  &:hover {
    color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}
</style>
