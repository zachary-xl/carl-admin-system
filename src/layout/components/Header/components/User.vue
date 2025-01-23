<template>
  <!-- 头像 -->
  <el-image class="user-avatar h-[34px] w-[34px] select-none rounded-full" :src="avatar">
    <template #error>
      <el-image class="user-avatar h-[34px] w-[34px] select-none rounded-full" :src="errorAvatar"></el-image>
    </template>
  </el-image>
  <el-dropdown class="ml-[10px]" :hide-on-click="false" @command="handleCommand">
    <div class="dropdown">
      <div class="m-w-[113px] mr-[6px] line-clamp-1 select-none text-[14px]">Carl</div>
      <el-icon><arrow-down /></el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item command="Mine">个人中心</el-dropdown-item> -->
        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        <!-- <el-dropdown-item command="Mine">{{ $t("header.personalCenter") }}</el-dropdown-item> -->
        <!-- <el-dropdown-item command="logout">{{ $t("header.logout") }}</el-dropdown-item> -->
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { LOGIN_URL } from "@/config";
import { clearStorage } from "@/utils";
import { useAuthStore } from "@/store";

const router = useRouter();
const authStore = useAuthStore();

// 退出登录
const handleLayout = async () => {
  clearStorage();
  // 如果不想要保存上次登录设置的全局颜色、布局等，则将下方第一行清空全部代码打开。
  // LocalStorage.clear();
  // LocalStorage.remove("user");
  // LocalStorage.remove("keepAlive");
  // LocalStorage.remove("tabs");
  // 退出登录。必须使用replace把页面缓存刷掉。
  await authStore.setTokenAction("");
  router.replace({ path: LOGIN_URL });
};
// 用户头像
const avatar = ref(
  "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fae90b4c7-98b6-4a47-b1b3-9ee8bc71acf6%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1692146441&t=6fca60f3a0d323869b81d8fb53b5dd1b"
);
const errorAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";
// 下拉折叠
const handleCommand = (command: string | number) => {
  switch (command) {
    case "Mine":
      router.push("/system/personage");
      break;
    case "logout":
      handleLayout();
      break;
  }
};
</script>

<style lang="scss" scoped>
// dropdown字体颜色
.dropdown {
  color: var(--el-color-primary);
  white-space: nowrap; /* 不换行 */
  cursor: pointer;
  outline: none; // 去除伪元素
  display: flex;
  align-items: center;
}
</style>
