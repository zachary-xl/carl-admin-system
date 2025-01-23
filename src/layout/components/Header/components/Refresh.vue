<template>
  <!-- 刷新 -->
  <div class="w-[32px] h-full justify-center items-center flex hover:bg-[rgba(0,0,0,0.06)]" @click="handleRefresh">
    <el-tooltip content="刷新页面">
      <el-icon class="icon" :size="20">
        <RefreshRight />
      </el-icon>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { LOGIN_URL } from "@/config";
import { useAuthStore } from "@/store";
import { clearStorage } from "@/utils";
import { MsgSuccess } from "@/utils/notification";

const router = useRouter();

/** 刷新路由 */
const handleRefresh = async () => {
  MsgSuccess("刷新页面成功🌻");
  // 必须使用这个把页面缓存刷掉
  router.go(0);
};
</script>
